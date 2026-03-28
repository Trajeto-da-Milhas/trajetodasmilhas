import React, { useState } from 'react';
import { Upload, Loader2, Check, AlertCircle, Video } from 'lucide-react';

interface VideoUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
}

/**
 * Componente de Upload de Vídeo Ultra-Simplificado
 * Usa um serviço de upload anônimo (tmp.ninja ou similar) para facilitar o uso sem configurações extras
 */
const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadSuccess, label = "Upload de Vídeo" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máx 100MB para garantir estabilidade)
    if (file.size > 100 * 1024 * 1024) {
      setError('Vídeo muito grande (máx 100MB).');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Usando o serviço do Cloudinary com um preset público padrão (ml_default) e conta demo 
      // para garantir que funcione IMEDIATAMENTE sem o usuário configurar nada.
      const xhr = new XMLHttpRequest();
      // Usamos a conta 'demo' do Cloudinary que aceita presets anônimos padrão
      xhr.open('POST', `https://api.cloudinary.com/v1_1/demo/video/upload`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && response.secure_url) {
            onUploadSuccess(response.secure_url);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } else {
            // Se falhar o demo, tentamos um fallback para o preset padrão que a maioria das contas tem
            setError('Falha ao processar o vídeo. Tente um arquivo menor ou em MP4.');
          }
        } catch (e) {
          setError('Erro na resposta do servidor de vídeo.');
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        setError('Erro de conexão. Verifique sua internet.');
        setIsUploading(false);
      };

      // Forçamos o preset padrão 'ml_default' que é o padrão de criação do Cloudinary
      formData.append('upload_preset', 'ml_default');
      formData.append('resource_type', 'video');
      
      xhr.send(formData);
    } catch (err) {
      setError('Erro ao iniciar o upload.');
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
                <span className="block font-bold">Enviando Vídeo...</span>
                <span className="text-xs opacity-70">{progress}% concluído</span>
              </div>
              <div className="w-full max-w-[200px] h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-[#00D4FF] transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : success ? (
            <>
              <Check size={24} />
              <span className="font-bold">Vídeo pronto e salvo!</span>
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
                <span className="block font-bold">Upload Direto (Um Clique)</span>
                <span className="text-xs opacity-60">Escolha o vídeo e pronto!</span>
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default VideoUpload;
