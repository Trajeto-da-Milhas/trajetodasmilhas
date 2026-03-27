import React, { useState } from 'react';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
}

const IMGBB_API_KEY = '245fe5f5660abb4791b1878cf268e555';

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, label = "Upload de Imagem" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setIsUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url;
        onUploadSuccess(imageUrl);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Erro no upload. Tente novamente.');
      }
    } catch (err) {
      setError('Erro de conexão. Verifique sua internet.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          disabled={isUploading}
        />
        <label
          htmlFor={`image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed transition-all cursor-pointer
            ${isUploading ? 'bg-gray-800 border-gray-700 cursor-not-allowed' : 
              success ? 'bg-green-500/10 border-green-500 text-green-500' :
              error ? 'bg-red-500/10 border-red-500 text-red-500' :
              'bg-[#0A1221] border-[#00D4FF]/30 hover:border-[#00D4FF] text-[#00D4FF]'}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Enviando...</span>
            </>
          ) : success ? (
            <>
              <Check size={18} />
              <span>Upload concluído!</span>
            </>
          ) : error ? (
            <>
              <AlertCircle size={18} />
              <span>{error}</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>Escolher Arquivo</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
