import os
import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, Subset

def get_dataloaders(data_dir, batch_size=32, img_size=128):
    """
    Datasets suggested: 
    1. EuroSAT (Contains various land cover classes. Treat 'Forest' as Normal and 'Industrial' as Anomaly)
    2. DeepGlobe Land Cover Classification
    
    Ensures structure:
    data_dir/
       Normal/
           img1.jpg
           ...
       Anomaly/
           img2.jpg
           ...
    """
    transform_train = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(15),
        transforms.ToTensor(),
    ])

    transform_test = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
    ])
    
    full_train_dataset = datasets.ImageFolder(root=data_dir, transform=transform_train)
    full_test_dataset = datasets.ImageFolder(root=data_dir, transform=transform_test)

    # 2. Filter ONLY normal images for training
    normal_idx = full_train_dataset.class_to_idx.get('Normal', 0)
    normal_indices = [i for i, (_, label) in enumerate(full_train_dataset.samples) if label == normal_idx]
    
    # Split normal images into train & validation (80-20)
    split_point = int(0.8 * len(normal_indices))
    train_indices = normal_indices[:split_point]
    val_indices = normal_indices[split_point:]

    train_dataset = Subset(full_train_dataset, train_indices)
    val_dataset = Subset(full_test_dataset, val_indices) # use test transform (no aug)

    # Use single-process loading for better Windows/Python compatibility in local runs.
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    # For testing anomaly detection, we use the entire test dataset (normal + anomaly)
    test_loader = DataLoader(full_test_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    return train_loader, val_loader, test_loader, full_test_dataset.class_to_idx
