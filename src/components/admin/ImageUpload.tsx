import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, CheckCircle2 } from 'lucide-react';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  label: string;
  className?: string;
}

export function ImageUpload({ name, defaultValue, label, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultValue || '');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    setUploadStatus('processing');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions for storage optimization
        const MAX_SIZE = 800;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to quality-compressed WebP or JPEG
        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        setPreview(base64);
        setUploadStatus('done');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">{label}</label>
      
      <div className="flex flex-col gap-4">
        {/* Preview Area */}
        <div className="relative group w-full aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
          {preview ? (
            <>
              <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-md transition-all"
                >
                  <Upload size={20} />
                </button>
                <button 
                  type="button" 
                  onClick={() => setPreview('')}
                  className="bg-red-500/20 hover:bg-red-500/40 p-3 rounded-full backdrop-blur-md transition-all text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            </>
          ) : (
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <span className="text-sm font-medium">Upload from Device</span>
            </button>
          )}
          
          {uploadStatus === 'processing' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="space-y-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
              <LinkIcon size={16} />
            </div>
            <input 
              name={name}
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              placeholder="Or paste a direct image URL..."
              className="w-full glass rounded-xl pl-12 pr-4 py-3 text-xs outline-none focus:ring-2 ring-brand-500 transition-all placeholder:text-white/10"
            />
            {uploadStatus === 'done' && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                <CheckCircle2 size={16} />
              </div>
            )}
          </div>
          <p className="text-[9px] text-[var(--text-muted)] italic leading-relaxed">
            Note: For performance, images are automatically resized and compressed.
          </p>
        </div>
      </div>
    </div>
  );
}
