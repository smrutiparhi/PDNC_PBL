import os
from PIL import Image
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

class SatelliteDataset(Dataset):
    def __init__(self, image_paths, transform=None):
        self.image_paths = image_paths
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, img_path

def get_dataloaders(normal_dir, anomaly_dir=None, batch_size=32, img_size=128):
    # Transforms for training (Normal images only)
    train_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.ToTensor(),
        # Normalize to [0, 1] is usually enough for Sigmoid output
    ])
    
    # Transforms for testing
    test_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
    ])

    # Load normal images
    normal_images = [os.path.join(normal_dir, f) for f in os.listdir(normal_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
    
    # Split normal images into train and validation (80/20)
    split_idx = int(0.8 * len(normal_images))
    train_images = normal_images[:split_idx]
    val_images = normal_images[split_idx:]

    train_dataset = SatelliteDataset(train_images, transform=train_transform)
    val_dataset = SatelliteDataset(val_images, transform=test_transform)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=2)

    test_loader = None
    if anomaly_dir:
        anomaly_images = [os.path.join(anomaly_dir, f) for f in os.listdir(anomaly_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
        # Test dataset contains both validation normal images and anomaly images
        test_images = val_images + anomaly_images
        test_labels = [0] * len(val_images) + [1] * len(anomaly_images) # 0 for normal, 1 for anomaly
        
        class TestDataset(Dataset):
            def __init__(self, image_paths, labels, transform):
                self.image_paths = image_paths
                self.labels = labels
                self.transform = transform
            def __len__(self): return len(self.image_paths)
            def __getitem__(self, idx):
                img = Image.open(self.image_paths[idx]).convert("RGB")
                return self.transform(img), self.labels[idx], self.image_paths[idx]
                
        test_dataset = TestDataset(test_images, test_labels, transform=test_transform)
        test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=2)

    return train_loader, val_loader, test_loader
