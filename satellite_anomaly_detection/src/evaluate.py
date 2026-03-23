import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc, precision_recall_fscore_support, confusion_matrix
import seaborn as sns
from model import ConvAutoencoder
from dataset import get_dataloaders
import cv2

def calculate_threshold(model, val_loader, device, k=3):
    model.eval()
    errors = []
    criterion = nn.MSELoss(reduction='none')
    
    with torch.no_grad():
        for images, _ in val_loader:
            images = images.to(device)
            outputs = model(images)
            # Calculate MSE per image
            loss = criterion(outputs, images).view(images.size(0), -1).mean(dim=1)
            errors.extend(loss.cpu().numpy())
            
    mean_error = np.mean(errors)
    std_error = np.std(errors)
    threshold = mean_error + k * std_error
    print(f"Mean Error: {mean_error:.6f}, Std: {std_error:.6f}, Threshold (k={k}): {threshold:.6f}")
    return threshold

def evaluate_model(model_path, normal_dir, anomaly_dir, device='cuda'):
    if not torch.cuda.is_available() and device == 'cuda':
        device = 'cpu'
        
    model = ConvAutoencoder().to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    _, val_loader, test_loader = get_dataloaders(normal_dir, anomaly_dir, batch_size=1)
    
    # 1. Determine threshold using validation set (normal images only)
    threshold = calculate_threshold(model, val_loader, device, k=3)
    
    # 2. Evaluate on test set (normal + anomaly)
    y_true = []
    y_scores = []
    criterion = nn.MSELoss(reduction='none')
    
    with torch.no_grad():
        for images, labels, paths in test_loader:
            images = images.to(device)
            outputs = model(images)
            loss = criterion(outputs, images).view(images.size(0), -1).mean(dim=1)
            
            y_scores.extend(loss.cpu().numpy())
            y_true.extend(labels.numpy())
            
    y_pred = [1 if score > threshold else 0 for score in y_scores]
    
    # 3. Metrics
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='binary')
    print(f"Precision: {precision:.4f}, Recall: {recall:.4f}, F1-Score: {f1:.4f}")
    
    # Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Normal', 'Anomaly'], yticklabels=['Normal', 'Anomaly'])
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.savefig('confusion_matrix.png')
    plt.close()
    
    # ROC Curve
    fpr, tpr, _ = roc_curve(y_true, y_scores)
    roc_auc = auc(fpr, tpr)
    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic')
    plt.legend(loc="lower right")
    plt.savefig('roc_curve.png')
    plt.close()

if __name__ == "__main__":
    # evaluate_model('checkpoints/best_autoencoder.pth', 'data/normal', 'data/anomaly')
    pass
