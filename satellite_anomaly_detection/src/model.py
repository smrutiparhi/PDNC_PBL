import torch
import torch.nn as nn

class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super(ResidualBlock, self).__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x):
        residual = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += residual
        out = self.relu(out)
        return out

class ConvAutoencoder(nn.Module):
    def __init__(self):
        super(ConvAutoencoder, self).__init__()
        
        # Encoder (ResNet-style)
        # Input: [B, 3, 256, 256]
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3), # [B, 64, 128, 128]
            nn.BatchNorm2d(64),
            nn.ReLU(True),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1), # [B, 64, 64, 64]
            
            ResidualBlock(64),
            nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1), # [B, 128, 32, 32]
            nn.BatchNorm2d(128),
            nn.ReLU(True),
            
            ResidualBlock(128),
            nn.Conv2d(128, 256, kernel_size=3, stride=2, padding=1), # [B, 256, 16, 16]
            nn.BatchNorm2d(256),
            nn.ReLU(True),
            
            ResidualBlock(256),
            nn.Conv2d(256, 512, kernel_size=3, stride=2, padding=1), # [B, 512, 8, 8]
            nn.BatchNorm2d(512),
            nn.ReLU(True),
            
            ResidualBlock(512)
        )
        
        # Bottleneck (Latent Space)
        # The latent space is represented by the [B, 512, 8, 8] tensor
        
        # Decoder
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(512, 256, kernel_size=3, stride=2, padding=1, output_padding=1), # [B, 256, 16, 16]
            nn.BatchNorm2d(256),
            nn.ReLU(True),
            ResidualBlock(256),
            
            nn.ConvTranspose2d(256, 128, kernel_size=3, stride=2, padding=1, output_padding=1), # [B, 128, 32, 32]
            nn.BatchNorm2d(128),
            nn.ReLU(True),
            ResidualBlock(128),
            
            nn.ConvTranspose2d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=1), # [B, 64, 64, 64]
            nn.BatchNorm2d(64),
            nn.ReLU(True),
            ResidualBlock(64),
            
            nn.ConvTranspose2d(64, 64, kernel_size=3, stride=2, padding=1, output_padding=1), # [B, 64, 128, 128]
            nn.BatchNorm2d(64),
            nn.ReLU(True),
            
            nn.ConvTranspose2d(64, 3, kernel_size=3, stride=2, padding=1, output_padding=1), # [B, 3, 256, 256]
            nn.Sigmoid() # Output values between 0 and 1
        )
        
    def forward(self, x):
        latent = self.encoder(x)
        reconstructed = self.decoder(latent)
        return reconstructed

