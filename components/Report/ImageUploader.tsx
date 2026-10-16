'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, Droplet, Zap, Trash2, Sprout, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  image: string | null;
  fileName?: string;
  categoryHint?: string;
  onImageChange: (base64: string | null, fileName?: string, categoryHint?: string) => void;
  onCategoryHintChange?: (hint: string) => void;
}

export default function ImageUploader({ 
  image, 
  fileName, 
  categoryHint = 'water', 
  onImageChange,
  onCategoryHintChange 
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>(fileName || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryHint || 'water');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectCategoryFromName = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('water') || lower.includes('leak') || lower.includes('tap') || lower.includes('pipe') || lower.includes('faucet') || lower.includes('drip') || lower.includes('puddle') || lower.includes('wet') || lower.includes('plumb') || lower.includes('washroom') || lower.includes('drain')) {
      return 'water';
    }
    const hasAc = /\b(ac|a\/c|air\s*con|hvac)\b/i.test(lower);
    if (lower.includes('light') || lower.includes('fan') || hasAc || lower.includes('power') || lower.includes('switch') || lower.includes('energy')) {
      return 'energy';
    }
    if (lower.includes('plastic') || lower.includes('bottle') || lower.includes('waste') || lower.includes('trash') || lower.includes('garbage') || lower.includes('bin') || lower.includes('litter')) {
      return 'waste';
    }
    if (lower.includes('plant') || lower.includes('tree') || lower.includes('garden') || lower.includes('grass') || lower.includes('sprinkler')) {
      return 'green_cover';
    }
    return 'water'; // Default to water when user uploads environmental photo
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const detected = detectCategoryFromName(file.name);
    setCurrentFileName(file.name);
    setSelectedCategory(detected);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onImageChange(e.target.result, file.name, detected);
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

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (onCategoryHintChange) {
      onCategoryHintChange(cat);
    }
    if (image) {
      onImageChange(image, currentFileName, cat);
    }
  };

  const categories = [
    { id: 'water', label: 'Water Leak / Plumbing', icon: Droplet, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'energy', label: 'Energy Waste / Lighting', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'waste', label: 'Plastic / Solid Waste', icon: Trash2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'green_cover', label: 'Green Cover / Plants', icon: Sprout, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Upload Environmental Image <span className="text-gray-500 font-normal lowercase">(optional, AI multimodal)</span>
      </label>

      {image ? (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-[#E5EBE5] bg-white p-2 group shadow-xs">
            <div className="relative h-60 w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Uploaded environmental issue"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold flex items-center gap-1 border border-gray-200 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  Attached for AI
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentFileName('');
                    onImageChange(null, '', '');
                  }}
                  className="p-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-md transition-transform hover:scale-110"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Image Subject Context Selection (Ensures AI never misidentifies water leaks as plastic) */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                Photo Subject Verification:
              </span>
              {currentFileName && (
                <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
                  {currentFileName}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Confirm photo subject so AI synthesizes both your photo and description properly:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCategory(c.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? `${c.color} border-current shadow-xs ring-1 ring-current`
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
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
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#16A34A] bg-emerald-50 scale-[1.01]'
              : 'border-gray-200 hover:border-[#16A34A] bg-[#F8FAF8] hover:bg-[#EFF6EF]'
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
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#16A34A]">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Upload Environmental Image
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Drag & drop or click to browse (JPG, PNG or WEBP)
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Multimodal image & description analysis enabled
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
