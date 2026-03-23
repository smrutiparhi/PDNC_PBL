import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import ReduceLROnPlateau
import matplotlib.pyplot as plt
import os
from model import ConvAutoencoder
from dataset import get_dataloaders

def train_model(train_dir, epochs=50, batch_size=32, lr=1e-3, device='cuda'):
    if not torch.cuda.is_available() and device == 'cuda':
        device = 'cpu'
    print(f"Using device: {device}")
    
    train_loader, val_loader, _ = get_dataloaders(train_dir, batch_size=batch_size)
    
    model = ConvAutoencoder().to(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)
    scheduler = ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=5, verbose=True)
    
    train_losses = []
    val_losses = []
    
    best_val_loss = float('inf')
    os.makedirs('checkpoints', exist_ok=True)
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for images, _ in train_loader:
            images = images.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, images)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
            
        epoch_train_loss = running_loss / len(train_loader.dataset)
        train_losses.append(epoch_train_loss)
        
        # Validation
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for images, _ in val_loader:
                images = images.to(device)
                outputs = model(images)
                loss = criterion(outputs, images)
                val_loss += loss.item() * images.size(0)
                
        epoch_val_loss = val_loss / len(val_loader.dataset)
        val_losses.append(epoch_val_loss)
        
        scheduler.step(epoch_val_loss)
        
        print(f"Epoch [{epoch+1}/{epochs}] - Train Loss: {epoch_train_loss:.6f} - Val Loss: {epoch_val_loss:.6f}")
        
        if epoch_val_loss < best_val_loss:
            best_val_loss = epoch_val_loss
            torch.save(model.state_dict(), 'checkpoints/best_autoencoder.pth')
            print("Saved best model.")
            
    # Plot losses
    plt.figure(figsize=(10, 5))
    plt.plot(train_losses, label='Train Loss')
    plt.plot(val_losses, label='Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('MSE Loss')
    plt.legend()
    plt.title('Training and Validation Loss')
    plt.savefig('loss_graph.png')
    plt.close()
    
    return model

if __name__ == "__main__":
    # Example usage:
    # train_model(train_dir='data/normal', epochs=50)
    pass
