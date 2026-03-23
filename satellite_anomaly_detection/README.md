# Anomaly Detection in Satellite Imagery using Convolutional Autoencoders

## 🎯 Project Overview
This project implements an unsupervised deep learning system to detect anomalies in satellite imagery (e.g., deforestation, oil spills, illegal construction). It uses a Convolutional Autoencoder that is trained **only on normal images**. During inference, anomalous regions produce a high reconstruction error, which is used to flag anomalies.

## 🧠 Architecture
**Convolutional Autoencoder**
- **Encoder:** 4 Convolutional blocks (Conv2D -> BatchNorm -> ReLU) compressing the 128x128x3 image into a 8x8x256 latent representation.
- **Bottleneck:** The compressed latent space forces the model to learn the most essential features of "normal" satellite terrain.
- **Decoder:** 4 Transposed Convolutional blocks reconstructing the image back to 128x128x3, ending with a Sigmoid activation.

```text
Input (128x128x3) 
  -> Conv2D(32) -> Conv2D(64) -> Conv2D(128) -> Conv2D(256) 
  -> [Latent Space: 8x8x256] 
  -> ConvTranspose2d(128) -> ConvTranspose2d(64) -> ConvTranspose2d(32) -> ConvTranspose2d(3) 
  -> Output (128x128x3)
```

## 📁 Suggested Datasets
1. **EuroSAT:** Sentinel-2 satellite images. Use "Forest" or "SeaLake" as normal, and "Highway" or "Industrial" as anomalies.
2. **Kaggle Satellite Image Classification:** Filter specific classes to act as the normal baseline.
3. **DeepGlobe Land Cover Classification:** Extract patches of normal terrain vs anomalous terrain.

## 🚀 Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/satellite-anomaly-detection.git
cd satellite-anomaly-detection
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Organize your data:
```text
data/
  normal/      # Contains only normal satellite images
  anomaly/     # Contains anomalous images (for testing only)
```

## ⚙️ How to Run

**1. Train the Model:**
```bash
python src/train.py
```
*This will train the autoencoder and save the best model to `checkpoints/best_autoencoder.pth`.*

**2. Evaluate the Model:**
```bash
python src/evaluate.py
```
*This generates the ROC curve, Confusion Matrix, and calculates Precision/Recall/F1-score.*

**3. Run the Web App:**
```bash
streamlit run app.py
```
*Upload images via the UI to see the reconstruction, error heatmap, and anomaly classification.*

## 📊 Evaluation Metrics
The project outputs:
- **Reconstruction Error (MSE):** `||input - reconstructed||^2`
- **Threshold:** Calculated dynamically as `Mean(Validation_Errors) + k * Std(Validation_Errors)`
- **ROC Curve & AUC**
- **Confusion Matrix**

## 🖼️ Screenshots
*(Add your screenshots here)*
- `loss_graph.png`
- `roc_curve.png`
- `confusion_matrix.png`
- Web App UI showing the Heatmap Overlay.
