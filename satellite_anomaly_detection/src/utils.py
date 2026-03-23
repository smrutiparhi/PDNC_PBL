import torch
import numpy as np
import matplotlib.pyplot as plt
import cv2

def visualize_anomaly(model, image_tensor, threshold, device='cuda'):
    model.eval()
    image_tensor = image_tensor.to(device)
    
    with torch.no_grad():
        reconstructed = model(image_tensor)
        
    # Calculate pixel-wise MSE
    mse_map = torch.mean((image_tensor - reconstructed) ** 2, dim=1).squeeze().cpu().numpy()
    
    # Convert tensors to numpy images for visualization
    orig_img = image_tensor.squeeze().cpu().permute(1, 2, 0).numpy()
    recon_img = reconstructed.squeeze().cpu().permute(1, 2, 0).numpy()
    
    # Create heatmap
    heatmap = cv2.normalize(mse_map, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB) / 255.0
    
    # Overlay heatmap on original image
    # Only highlight regions where error > threshold
    mask = mse_map > threshold
    overlay = orig_img.copy()
    overlay[mask] = overlay[mask] * 0.5 + heatmap_color[mask] * 0.5
    
    fig, axes = plt.subplots(1, 4, figsize=(20, 5))
    axes[0].imshow(orig_img)
    axes[0].set_title('Original Image')
    axes[0].axis('off')
    
    axes[1].imshow(recon_img)
    axes[1].set_title('Reconstructed Image')
    axes[1].axis('off')
    
    axes[2].imshow(heatmap_color)
    axes[2].set_title('Error Heatmap')
    axes[2].axis('off')
    
    axes[3].imshow(overlay)
    axes[3].set_title('Anomaly Overlay')
    axes[3].axis('off')
    
    plt.tight_layout()
    return fig, np.mean(mse_map)
