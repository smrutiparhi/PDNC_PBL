import torch
import torch.nn as nn

class ConvAutoencoder(nn.Module):
    def __init__(self):
        super(ConvAutoencoder, self).__init__()
        
        # ---------------------------
        # Encoder
        # Input shape: [B, 3, 128, 128]
        # ---------------------------
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.MaxPool2d(2, 2), # Output: [B, 32, 64, 64]
            
            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(2, 2), # Output: [B, 64, 32, 32]
            
            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.MaxPool2d(2, 2), # Output: [B, 128, 16, 16]
        )
        
        # Bottleneck
        self.flatten = nn.Flatten()
        self.latent_dim = 128 * 16 * 16
        self.bottleneck = nn.Sequential(
            nn.Linear(self.latent_dim, 512),
            nn.ReLU()
        )
        
        # ---------------------------
        # Decoder
        # ---------------------------
        self.unflatten = nn.Sequential(
            nn.Linear(512, self.latent_dim),
            nn.ReLU()
        )
        
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2), # Output: [B, 64, 32, 32]
            nn.ReLU(),
            nn.BatchNorm2d(64),
            
            nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2), # Output: [B, 32, 64, 64]
            nn.ReLU(),
            nn.BatchNorm2d(32),
            
            nn.ConvTranspose2d(32, 3, kernel_size=2, stride=2), # Output: [B, 3, 128, 128]
            nn.Sigmoid() # Scale pixels [0, 1]
        )

    def forward(self, x):
        encoded = self.encoder(x)
        flattened = self.flatten(encoded)
        latent = self.bottleneck(flattened)
        
        unflattened = self.unflatten(latent)
        reshaped = unflattened.view(-1, 128, 16, 16)
        reconstructed = self.decoder(reshaped)
        return reconstructed, latent
