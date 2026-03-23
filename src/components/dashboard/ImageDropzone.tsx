import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImageDropzoneProps {
  onImageSelect: (file: File) => void;
}

export default function ImageDropzone({ onImageSelect }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={cn(
        "w-full h-full min-h-[400px] border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden group",
        isDragging 
          ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.15)]" 
          : "border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/50"
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Glow Behind Icon */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] transition-opacity duration-500 pointer-events-none",
        isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-50"
      )} />

      <div className={cn(
        "bg-zinc-900 p-6 rounded-2xl mb-6 transition-all duration-300 shadow-xl relative z-10 border border-zinc-800",
        isDragging ? "scale-110 bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "group-hover:scale-110 group-hover:bg-zinc-800 text-zinc-400"
      )}>
        <Upload className="w-10 h-10" />
      </div>

      <h3 className="text-xl font-bold text-zinc-200 mb-3 relative z-10">
        Drop high-resolution imagery here
      </h3>
      <p className="text-sm text-zinc-500 max-w-md leading-relaxed relative z-10">
        Support for complex TIFF, multi-spectral PNG, and standard JPEG files. Max size 50MB.
      </p>

      {/* Decorative pulse border when dragging */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-emerald-500 rounded-3xl animate-ping opacity-20 pointer-events-none" />
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        className="hidden" 
        accept="image/jpeg, image/png, image/webp, image/tiff" 
      />
    </div>
  );
}
