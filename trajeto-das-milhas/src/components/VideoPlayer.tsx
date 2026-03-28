import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title = 'Video' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isBlurred, setIsBlurred] = useState(true); // Começa desfocado
  const [hasStartedByUser, setHasStartedByUser] = useState(false); // Rastreia se o usuário clicou no botão

  // Intersection Observer para autoplay mutado quando entra na viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            // Garante que o vídeo começa mutado e desfocado
            videoRef.current.muted = true;
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch((error) => {
              console.log('Autoplay bloqueado:', error);
            });
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Quando o usuário clica no botão de play central
  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      // Reinicia o vídeo do zero
      videoRef.current.currentTime = 0;
      
      // Remove o desfoque
      setIsBlurred(false);
      
      // Ativa o som
      videoRef.current.muted = false;
      setIsMuted(false);
      
      // Marca que o usuário iniciou
      setHasStartedByUser(true);
      
      // Toca o vídeo
      videoRef.current.play().catch((error) => {
        console.log('Erro ao tocar vídeo:', error);
      });
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Erro ao entrar em tela cheia: ${err.message}`);
        });
      }
    }
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-[#00D4FF]/20 shadow-[0_0_50px_rgba(0,212,255,0.15)] group"
    >
      <video
        ref={videoRef}
        src={src}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isBlurred ? 'blur-lg' : ''
        }`}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        loop={hasStartedByUser}
        playsInline
        muted={isMuted}
        autoPlay
      />

      {/* Botão de Play Central (Aparece quando está desfocado) */}
      {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
          <button
            onClick={handlePlayButtonClick}
            className="p-6 bg-[#00D4FF] text-[#050A14] rounded-full hover:shadow-[0_0_40px_rgba(0,212,255,0.8)] transition-all transform hover:scale-110 animate-pulse"
            aria-label="Tocar Vídeo"
          >
            <Play className="w-12 h-12 fill-current" />
          </button>
        </div>
      )}

      {/* Custom Controls (Aparecem ao passar o mouse quando o vídeo está em foco) */}
      {!isBlurred && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <div className="flex-1" />

            <button
              onClick={toggleMute}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors mr-2"
              aria-label={isMuted ? 'Ativar Som' : 'Mutar'}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Tela Cheia"
            >
              <Maximize className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
