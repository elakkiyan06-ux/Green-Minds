'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (base64: string | null) => void;
}

export default function ImageUploader({ image, onImageChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    {
      label: 'Sample: Overflowing Bin (Block 3)',
      url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Sample: Water Leakage (Hostel)',
      url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Sample: Plastic Litter (Canteen)',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    }
  ];

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onImageChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (url: string) => {
    onImageChange(url);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Upload Environmental Image <span className="text-gray-400 font-normal lowercase">(optional, AI multimodal)</span>
      </label>

      {image ? (
        <div className="relative rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/30 p-2 group">
          <div className="relative h-60 w-full rounded-lg overflow-hidden bg-black/5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Uploaded environmental issue"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Image Attached for AI
              </span>
              <button
                type="button"
                onClick={() => onImageChange(null)}
                className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-transform hover:scale-110"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#16A34A] bg-[#DCFCE7]/30 scale-[1.01]'
              : 'border-gray-200 hover:border-[#16A34A] bg-[#F7FAF7] hover:bg-emerald-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3.5 rounded-full bg-white shadow-sm border border-gray-100 text-[#16A34A]">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                Upload Environmental Image
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Drag & drop or click to browse (JPG, PNG or WEBP)
              </p>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Multimodal image recognition enabled
            </span>
          </div>
        </div>
      )}

      {/* Preset Sample Images for Demo convenience */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Quick Demo Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleImages.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleSelectSample(sample.url)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-700 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
