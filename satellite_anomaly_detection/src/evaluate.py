import torch
import numpy as np
from sklearn.metrics import roc_curve, auc, precision_recall_fscore_support, confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import os

from dataset import get_dataloaders
from detect import AnomalyDetector

def evaluate_model(data_dir, model_path, k=3):
    # Setup Data and Model
    _, val_loader, test_loader, class_idx = get_dataloaders(data_dir)
    detector = AnomalyDetector(model_path)
    
    # Define threshold (Mean + k*StdDev on validation)
    threshold = detector.calculate_threshold(val_loader, k=k)
    print(f"Using Threshold: {threshold}")
    
    normal_idx = class_idx.get("Normal", 0)
    
    y_true = []
    y_scores = []
    y_pred = []
    
    print("Evaluating Test Set...")
    detector.model.eval()
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(detector.device)
            reconstructed, _ = detector.model(images)
            
            mse = torch.mean((images - reconstructed)**2, dim=[1,2,3]).cpu().numpy()
            
            for score, label_idx in zip(mse, labels.cpu().numpy()):
                # Ground truth: 1 for Anomaly, 0 for Normal
                gt_is_anomaly = 1 if label_idx != normal_idx else 0
                pred_is_anomaly = 1 if score > threshold else 0
                
                y_true.append(gt_is_anomaly)
                y_scores.append(score)
                y_pred.append(pred_is_anomaly)
                
    # 3. Metrics
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='binary', zero_division=0)
    print("\n--- Evaluation Metrics ---")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    
    # Check if there are multiple classes for ROC
    if len(np.unique(y_true)) > 1:
        # ROC Curve
        fpr, tpr, roc_thresholds = roc_curve(y_true, y_scores)
        roc_auc = auc(fpr, tpr)
        
        plt.figure()
        plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
        plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('Receiver Operating Characteristic')
        plt.legend(loc="lower right")
        os.makedirs('../results', exist_ok=True)
        plt.savefig('../results/roc_curve.png')
        plt.close()
    
    # Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Normal', 'Anomaly'])
    
    fig, ax = plt.subplots(figsize=(6, 6))
    disp.plot(cmap=plt.cm.Blues, ax=ax)
    plt.title('Confusion Matrix')
    plt.savefig('../results/confusion_matrix.png')
    plt.close()
    
    print("Evaluation Complete. Results saved in '../results/'")

if __name__ == "__main__":
    # evaluate_model("../data/satellite_images_sample", "../models/best_autoencoder.pth")
    pass
