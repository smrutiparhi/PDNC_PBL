import streamlit as st
import torch
import cv2
import numpy as np
import os
from PIL import Image

# Import custom modules
from src.detect import AnomalyDetector

st.set_page_config(page_title="Satellite Anomaly Detection", layout="wide")

st.title("🌍 Anomaly Detection in Satellite Imagery using Convolutional Autoencoders")
st.markdown("Upload a satellite image to detect anomalies (like deforestation, illegal construction, or oil spills) based on structural deviations from normal terrains.")

# Config
MODEL_PATH = "models/best_autoencoder.pth"
LOSS_GRAPH_PATH = "results/loss_graph.png"
DEFAULT_THRESHOLD = 0.015

@st.cache_resource
def load_detector():
    detector = AnomalyDetector(MODEL_PATH)
    detector.threshold = DEFAULT_THRESHOLD
    return detector

st.sidebar.header("Settings")
# Load model quietly
try:
    detector = load_detector()
    model_loaded = os.path.exists(MODEL_PATH)
    if not model_loaded:
        st.sidebar.warning(f"Model not found at '{MODEL_PATH}'. Ensure you train the model first.")
except Exception as e:
    st.sidebar.error(f"Error loading model: {e}")
    model_loaded = False

if model_loaded:
    dynamic_threshold = st.sidebar.slider("Anomaly Threshold", min_value=0.001, max_value=0.100, value=DEFAULT_THRESHOLD, step=0.001, help="If Average MSE exceeds this threshold, the image is considered Anomalous. Increase to reduce false positives.")
    detector.threshold = dynamic_threshold

    uploaded_file = st.file_uploader("Upload a Satellite Image (JPG/PNG)", type=["jpg", "png", "jpeg"])

    if uploaded_file is not None:
        col1, col2, col3 = st.columns(3)
        
        # Save temp needed for PIL and Detector
        temp_path = "temp_upload.jpg"
        with open(temp_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        
        with st.spinner("Analyzing image dependencies & rebuilding via Autoencoder..."):
            error_score, label, orig_img, recon_img, heatmap = detector.predict(temp_path)
        
        st.subheader("Analysis Results")
        if label == "Anomaly":
            st.error(f"⚠️ **Anomaly Detected!** (Reconstruction Error: {error_score:.5f}) - Exceeds Threshold: {dynamic_threshold:.5f}")
        else:
            st.success(f"✅ **Normal Terrain** (Reconstruction Error: {error_score:.5f}) - Below Threshold: {dynamic_threshold:.5f}")
            
        with col1:
            st.image(orig_img, caption="1. Original Target Image", use_container_width=True)
            
        with col2:
            st.image(recon_img, caption="2. Autoencoder Reconstruction", use_container_width=True)
            
        with col3:
            # Heatmap RGB for pure stream
            heatmap_rgb = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
            st.image(heatmap_rgb, caption="3. Error Heatmap (Red = Anomalous Areas)", use_container_width=True)

    st.markdown("---")
    st.subheader("Training and Validation Loss")
    if os.path.exists(LOSS_GRAPH_PATH):
        st.image(LOSS_GRAPH_PATH, caption="Autoencoder loss curve", use_container_width=True)
    else:
        st.info("No loss graph found yet. Run training to generate results/loss_graph.png.")
            
st.markdown("---")
st.markdown("""
### 🧠 How this works
1. The **Encoder** compresses the image into a bottleneck (Latent vector).
2. The **Decoder** reconstructs it. Since the model learned *only* on normal terrains (e.g. dense forests or oceans), it fails to perfectly reconstruct structural novelties like deforestation lines or oil spills.
3. The **Reconstruction Error** calculates spatial pixel disagreement (MSE). The **Heatmap** highlights the regions where the model failed the hardest.
""")
