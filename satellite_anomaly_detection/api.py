import os
import io
import base64
import cv2
import numpy as np
import torch
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from src.detect import AnomalyDetector

app = FastAPI(title="Satellite Anomaly Detection API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config
MODEL_PATH = "models/best_autoencoder.pth"
DEFAULT_THRESHOLD = 0.015

# Initialize Detector
if not os.path.exists(MODEL_PATH):
    print(f"ERROR: Model not found at {MODEL_PATH}")
    detector = None
else:
    detector = AnomalyDetector(MODEL_PATH)
    detector.threshold = DEFAULT_THRESHOLD

def ndarray_to_base64(arr: np.ndarray) -> str:
    """Convert a numpy array (image) to a base64 string."""
    # If it's a normalized float array [0, 1], convert to [0, 255] uint8
    if arr.dtype == np.float32 or arr.dtype == np.float64:
        arr = (arr * 255).astype(np.uint8)
    
    # Convert RGB to BGR for OpenCV if needed (Detector returns RGB for orig/recon)
    # But wait, detector.predict returns RGB for orig_img and recon_img, 
    # and BGR for heatmap (because of cv2.applyColorMap)
    
    is_success, buffer = cv2.imencode(".jpg", arr)
    if not is_success:
        return ""
    return base64.b64encode(buffer).decode("utf-8")

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...), threshold: float = DEFAULT_THRESHOLD):
    if detector is None:
        raise HTTPException(status_code=500, detail="AI Model not loaded on server.")
    
    try:
        # Update threshold if provided
        detector.threshold = threshold
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Save temp file for detector (it expects a path)
        temp_path = "temp_api_upload.jpg"
        image.save(temp_path)
        
        # Run inference
        error_score, label, orig_img, recon_img, heatmap = detector.predict(temp_path)
        
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        # Convert results to base64
        # Note: detector.predict returns RGB for orig and recon, but heatmap is BGR from cv2
        # We need to ensure we encode them correctly.
        # cv2.imencode expects BGR by default.
        
        orig_b64 = ndarray_to_base64(cv2.cvtColor((orig_img * 255).astype(np.uint8), cv2.COLOR_RGB2BGR))
        recon_b64 = ndarray_to_base64(cv2.cvtColor((recon_img * 255).astype(np.uint8), cv2.COLOR_RGB2BGR))
        heatmap_b64 = ndarray_to_base64(heatmap) # Heatmap is already BGR
        
        return {
            "score": float(error_score),
            "label": label,
            "isAnomaly": label == "Anomaly",
            "images": {
                "original": f"data:image/jpeg;base64,{orig_b64}",
                "reconstructed": f"data:image/jpeg;base64,{recon_b64}",
                "heatmap": f"data:image/jpeg;base64,{heatmap_b64}"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": detector is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
