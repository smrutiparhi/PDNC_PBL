# Anomaly Detection in Satellite Imagery using Convolutional Autoencoders

An unsupervised deep learning pipeline leveraging Convolutional Autoencoders to detect structural and geographic anomalies in satellite imagery without needing labeled anomaly data during training.

## 🎯 Project Overview
This system identifies anomalies—such as deforestation, illegal construction, or oil spills—by exclusively learning the visual patterns of "Normal" satellite images. When an anomalous image is passed through the network, the Autoencoder fails to reconstruct the unfamiliar elements, resulting in a high Mean Squared Error (MSE) and highlighting the discrepancies via a Heatmap.

## 📦 Folder Structure
```text
satellite_anomaly_detection/
├── data/                    # Raw & Processed datasets
│   └── satellite_images_sample/
│       ├── Normal/          # Used for training & validation
│       └── Anomaly/         # Used purely for validation/testing
├── models/                  # Checkpoints & best models
├── results/                 # Output heatmaps, ROC, Graphs
├── src/
│   ├── dataset.py           # Dataloader, Transformations, Image Filtering
│   ├── model.py             # Architectures: Encoder & Decoder maps
│   ├── train.py             # Optimizer, MSELoss, Training loops
│   ├── detect.py            # Latent mappings, threshold algorithms, Heatmap logic
│   └── evaluate.py          # Validation Metrics: ROC curve, Confusion Matrix, Precision/Recall
├── app.py                   # Streamlit interactive application
├── requirements.txt         # Dependencies
└── README.md                # the documentation
```

## 🛠️ Installation & Setup

1. **Clone & Navigate**
```bash
git clone ...
cd satellite_anomaly_detection
```

2. **Install Requirements**
```bash
pip install -r requirements.txt
```

3. **Dataset Setup**
We recommend using [EuroSAT](https://github.com/phelber/EuroSAT) or DeepGlobe Land Cover Datasets. 
Organize your `data/` folder as follows:
```text
data/satellite_images_sample/
├── Normal/
│   ├── forest_01.jpg
│   └── ...
└── Anomaly/
    ├── deforestation_01.jpg
    └── ...
```

## 🚀 How to Run

### 1. Training the Model
To start training the autoencoder exclusively on normal images:
```bash
python src/train.py
```
This generates learning curves in `results/loss_graph.png` and saves the checkpoint to `models/best_autoencoder.pth`.

### 2. Evaluate Performance
To evaluate against anomalous imagery and verify the internal Threshold calculations:
```bash
python src/evaluate.py
```
This script computes Precision, Recall, F1-Score, and maps the localized Confusion Matrix in the `results/` folder.

### 3. Run Web App (Streamlit)
Start the dashboard to upload images and observe real-time anomaly mapping:
```bash
streamlit run app.py
```

## 📊 Evaluation & Results
* **ROCAUC / PR Curves** stored internally per batch inferences.
* Loss functions use localized Mean Squared Error (MSE) pixel comparisons mapping high discrepancy elements to the top of standard deviations.

*Example Screenshots (Placeholders):*
![Loss Graph](results/loss_graph.png)
*(Recreation visualization)*
