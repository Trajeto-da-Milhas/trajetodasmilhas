import React, { useState } from 'react';
import { Upload, Loader2, Check, AlertCircle, Video } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface VideoUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
}

/**
 * Componente de Upload de Vídeo via Supabase Storage
 * Solução definitiva que não depende de presets ou serviços externos instáveis.
 */
const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadSuccess, label = "Upload de Vídeo" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máx 200MB no Supabase Free Tier)
    if (file.size > 200 * 1024 * 1024) {
      setError('Vídeo muito grande (máx 200MB).');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    try {
      // 1. Criar um nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // 2. Upload para o Supabase Storage (Bucket 'media')
      // Nota: O usuário precisa criar o bucket 'media' no painel do Supabase e torná-lo público
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('bucket not found')) {
          setError('Erro: Bucket "media" não encontrado no Supabase. Crie-o no painel.');
        } else {
          setError(`Erro no upload: ${uploadError.message}`);
        }
        setIsUploading(false);
        return;
      }

      // 3. Obter a URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      if (publicUrl) {
        onUploadSuccess(publicUrl);
        setSuccess(true);
        setProgress(100);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Falha ao gerar link do vídeo.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4 p-4 bg-[#0A1221] border border-[#00D4FF]/10 rounded-xl">
      <div className="flex items-center gap-2 text-[#00D4FF] mb-1">
        <Video size={16} />
        <label className="text-sm font-bold uppercase tracking-wider">{label}</label>
      </div>
      
      <div className="relative">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload-input"
          disabled={isUploading}
        />
        <label
          htmlFor="video-upload-input"
          className={`flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl border-2 border-dashed transition-all cursor-pointer
            ${isUploading ? 'bg-gray-800/50 border-gray-700 cursor-not-allowed' : 
              success ? 'bg-green-500/10 border-green-500 text-green-500' :
              error ? 'bg-red-500/10 border-red-500 text-red-500' :
              'bg-[#0D1526] border-[#00D4FF]/20 hover:border-[#00D4FF]/50 text-[#00D4FF] hover:bg-[#00D4FF]/5'}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <div className="text-center">
                <span className="block font-bold">Enviando para o Servidor...</span>
                <span className="text-xs opacity-70">Processando arquivo...</span>
              </div>
            </>
          ) : success ? (
            <>
              <Check size={24} />
              <span className="font-bold">Vídeo salvo no seu banco!</span>
            </>
          ) : error ? (
            <>
              <AlertCircle size={24} />
              <div className="text-center px-4">
                <span className="block font-bold leading-tight">{error}</span>
                <span className="text-[10px] opacity-70 mt-1 block">Clique para tentar novamente</span>
              </div>
            </>
          ) : (
            <>
              <Upload size={24} />
              <div className="text-center">
                <span className="block font-bold">Upload Direto (Supabase)</span>
                <span className="text-xs opacity-60">Mais rápido e sem erros externos!</span>
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default VideoUpload;
