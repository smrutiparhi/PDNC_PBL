import streamlit as st
import torch
from PIL import Image
from torchvision import transforms
from src.model import ConvAutoencoder
from src.utils import visualize_anomaly
import numpy as np

st.set_page_config(page_title="Satellite Anomaly Detection", layout="wide")

@st.cache_resource
def load_model(model_path):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = ConvAutoencoder().to(device)
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.eval()
        return model, device
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None, device

st.title("🌍 Anomaly Detection in Satellite Imagery")
st.markdown("""
This app uses a **Convolutional Autoencoder** to detect anomalies (like deforestation, oil spills, or illegal construction) in satellite imagery.
Upload a satellite image to see if it contains anomalies based on reconstruction error.
""")

# Load Model
# Note: You need a trained model at 'checkpoints/best_autoencoder.pth'
model_path = 'checkpoints/best_autoencoder.pth'
model, device = load_model(model_path)

# Threshold (Ideally calculated from validation set, hardcoded here for demo)
threshold = st.sidebar.slider("Anomaly Threshold", min_value=0.001, max_value=0.1, value=0.015, step=0.001)

uploaded_file = st.file_uploader("Upload a Satellite Image...", type=["jpg", "jpeg", "png", "webp"])

if uploaded_file is not None:
    image = Image.open(uploaded_file).convert('RGB')
    
    # Preprocess
    transform = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor()
    ])
    input_tensor = transform(image).unsqueeze(0)
    
    if model:
        with st.spinner('Analyzing image...'):
            fig, error_score = visualize_anomaly(model, input_tensor, threshold, device)
            
            st.subheader("Analysis Results")
            col1, col2 = st.columns(2)
            
            with col1:
                st.metric(label="Reconstruction Error (MSE)", value=f"{error_score:.5f}")
            with col2:
                if error_score > threshold:
                    st.error("🚨 ANOMALY DETECTED")
                else:
                    st.success("✅ NORMAL (No Anomaly)")
            
            st.pyplot(fig)
    else:
        st.warning("Model not found. Please train the model first and save it to 'checkpoints/best_autoencoder.pth'.")
        st.image(image, caption="Uploaded Image", use_column_width=True)
