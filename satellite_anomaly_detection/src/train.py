import os
import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt

from dataset import get_dataloaders
from model import ConvAutoencoder

def train_model(data_dir, num_epochs=30, batch_size=32, lr=1e-3, device='cuda'):
    device = torch.device(device if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # 1. Load Data
    train_loader, val_loader, _, _ = get_dataloaders(data_dir, batch_size=batch_size)
    
    # 2. Init Model
    model = ConvAutoencoder().to(device)
    
    # 3. Loss & Optimizer (MSE handles reconstruction error)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)
    
    # Learning rate scheduler
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=3, factor=0.5)
    
    train_losses = []
    val_losses = []
    
    best_val_loss = float('inf')
    
    print("Starting Training...")
    # 4. Epoch loop
    for epoch in range(num_epochs):
        model.train()
        running_train_loss = 0.0
        
        for images, _ in train_loader: # use tqdm usually, skipped for simplified execution log
            images = images.to(device)
            optimizer.zero_grad()
            reconstructed, _ = model(images)
            loss = criterion(reconstructed, images)
            loss.backward()
            optimizer.step()
            
            running_train_loss += loss.item() * images.size(0)
            
        epoch_train_loss = running_train_loss / len(train_loader.dataset)
        train_losses.append(epoch_train_loss)
        
        # Validation step
        model.eval()
        running_val_loss = 0.0
        with torch.no_grad():
            for images, _ in val_loader:
                images = images.to(device)
                reconstructed, _ = model(images)
                loss = criterion(reconstructed, images)
                running_val_loss += loss.item() * images.size(0)
                
        epoch_val_loss = running_val_loss / len(val_loader.dataset)
        val_losses.append(epoch_val_loss)
        
        scheduler.step(epoch_val_loss)
        
        print(f"Epoch {epoch+1}/{num_epochs} - Train Loss: {epoch_train_loss:.5f} | Val Loss: {epoch_val_loss:.5f}")
        
        # Save best model
        if epoch_val_loss < best_val_loss:
            best_val_loss = epoch_val_loss
            os.makedirs('../models', exist_ok=True)
            torch.save(model.state_dict(), '../models/best_autoencoder.pth')
            print("Saved new best model.")
            
    # 5. Plot Loss Graph
    plt.figure(figsize=(10, 5))
    plt.plot(train_losses, label='Train Loss')
    plt.plot(val_losses, label='Validation Loss')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('MSE Loss')
    plt.legend()
    os.makedirs('../results', exist_ok=True)
    plt.savefig('../results/loss_graph.png')
    plt.close()
    print("Training Complete. Model saved to '../models/best_autoencoder.pth'")

if __name__ == "__main__":
    train_model(data_dir="data/satellite_images_sample", num_epochs=30)
