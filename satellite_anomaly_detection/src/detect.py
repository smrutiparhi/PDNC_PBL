import os
import torch
import numpy as np
import matplotlib.pyplot as plt
import cv2
from PIL import Image

# For absolute imports depending on how script is run
try:
    from src.model import ConvAutoencoder
except ModuleNotFoundError:
    from model import ConvAutoencoder

from torchvision import transforms

class AnomalyDetector:
    def __init__(self, model_path, device='cuda', img_size=128):
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        self.img_size = img_size
        
        # Load Model
        self.model = ConvAutoencoder().to(self.device)
        if os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        else:
            print(f"Warning: Model weights not found at {model_path}")
            
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor()
        ])
        
        # Default threshold, calculated later
        self.threshold = 0.015 
        
    def calculate_threshold(self, normal_val_loader, k=3):
        """
        Define threshold based on validation normal images.
        Threshold = Mean(errors) + k * StdDev(errors)
        """
        print("Calculating Error Threshold from Validation Set...")
        errors = []
        with torch.no_grad():
            for images, _ in normal_val_loader:
                images = images.to(self.device)
                reconstructed, _ = self.model(images)
                
                # Reconstruction error calculation: ||input - reconstructed||²
                mse = torch.mean((images - reconstructed)**2, dim=[1,2,3]).cpu().numpy()
                errors.extend(mse)
                
        errors = np.array(errors)
        mean_err = np.mean(errors)
        std_err = np.std(errors)
        
        self.threshold = mean_err + k * std_err
        print(f"Calculated Threshold: {self.threshold:.6f} (Mean: {mean_err:.6f}, Std: {std_err:.6f})")
        return self.threshold

    def predict(self, image_path):
        """
        Score a single image
        """
        image = Image.open(image_path).convert('RGB')
        img_tensor = self.transform(image).unsqueeze(0).to(self.device) # [1, 3, H, W]
        
        with torch.no_grad():
            reconstructed, _ = self.model(img_tensor)
            
            # MSE per pixel across channels
            squared_diff = (img_tensor - reconstructed) ** 2
            pixel_mse = torch.mean(squared_diff, dim=1).squeeze(0).cpu().numpy()
            
            error_score = np.mean(pixel_mse)
            
        is_anomaly = float(error_score) > self.threshold
        label = "Anomaly" if is_anomaly else "Normal"
        
        # Generate Error Heatmap
        # Scale to 0-255 for cv2 colormap
        # We cap the extreme values to avoid heatmap washing out
        max_val = np.percentile(pixel_mse, 99)
        heatmap = np.clip(pixel_mse / max_val, 0, 1) * 255
        heatmap = heatmap.astype(np.uint8)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        # Convert tensors to displayable format [H, W, 3]
        orig_img = img_tensor.squeeze(0).cpu().permute(1, 2, 0).numpy()
        recon_img = reconstructed.squeeze(0).cpu().permute(1, 2, 0).numpy()
        
        return float(error_score), label, orig_img, recon_img, heatmap

    def visualize(self, image_path, save_path=None):
        error_score, label, orig_img, recon_img, heatmap = self.predict(image_path)
        
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))
        
        axes[0].imshow(orig_img)
        axes[0].set_title(f"Original\n{label} (Score: {error_score:.4f})")
        axes[0].axis('off')
        
        axes[1].imshow(recon_img)
        axes[1].set_title("Reconstructed")
        axes[1].axis('off')
        
        heatmap_rgb = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
        axes[2].imshow(heatmap_rgb)
        axes[2].set_title("Error Heatmap")
        axes[2].axis('off')
        
        if save_path:
            plt.savefig(save_path)
            print(f"Visualization saved to {save_path}")
        else:
            plt.show()
        plt.close()

if __name__ == "__main__":
    pass
