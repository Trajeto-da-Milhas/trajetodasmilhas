import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  trackBlurView,
  trackVideoPlay,
  trackVideoRetention,
  trackVideoCompleted,
} from '../services/videoAnalytics';

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
  const retentionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blurViewTrackedRef = useRef(false);

  // Registrar blur view uma única vez quando o componente monta
  useEffect(() => {
    if (!blurViewTrackedRef.current && src) {
      trackBlurView(src);
      blurViewTrackedRef.current = true;
    }
  }, [src]);

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
      
      // Registra o evento de play
      trackVideoPlay(src);
      
      // Toca o vídeo
      videoRef.current.play().catch((error) => {
        console.log('Erro ao tocar vídeo:', error);
      });
    }
  };

  // Iniciar rastreamento de retenção quando o vídeo começa a tocar
  useEffect(() => {
    if (isPlaying && videoRef.current && !isBlurred) {
      // Limpar intervalo anterior se existir
      if (retentionIntervalRef.current) {
        clearInterval(retentionIntervalRef.current);
      }

      // Rastrear retenção a cada segundo
      retentionIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          trackVideoRetention(
            src,
            videoRef.current.currentTime,
            videoRef.current.duration
          );
        }
      }, 1000);
    } else {
      // Limpar intervalo quando pausa
      if (retentionIntervalRef.current) {
        clearInterval(retentionIntervalRef.current);
        retentionIntervalRef.current = null;
      }
    }

    return () => {
      if (retentionIntervalRef.current) {
        clearInterval(retentionIntervalRef.current);
      }
    };
  }, [isPlaying, isBlurred, src]);

  // Quando o vídeo chega ao final
  const handleVideoEnded = () => {
    if (videoRef.current) {
      // Registrar conclusão
      trackVideoCompleted(src, videoRef.current.currentTime, videoRef.current.duration);

      // Volta ao estado inicial
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      setIsMuted(true);
      setIsBlurred(true);
      setIsPlaying(false);
      
      // Inicia o autoplay novamente (mutado e desfocado)
      videoRef.current.play().catch((error) => {
        console.log('Erro ao reiniciar vídeo:', error);
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
        onEnded={handleVideoEnded}
        playsInline
        muted={isMuted}
        autoPlay
      />

      {/* Botão de Play Central (Aparece quando está desfocado) */}
      {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
          <div className="relative flex items-center justify-center">
            {/* Círculos de Pulso Estilo Ripple (CodePen) - Corrigido Fade Out */}
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="absolute rounded-full border border-[#00D4FF] bg-[#00D4FF]/20"
                initial={{ width: 96, height: 96, opacity: 0, scale: 1 }}
                animate={{
                  scale: [1, 3],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.8,
                  ease: "easeOut",
                }}
              />
            ))}
            
            <button
              onClick={handlePlayButtonClick}
              className="relative p-6 bg-[#00D4FF] text-[#050A14] rounded-full hover:shadow-[0_0_40px_rgba(0,212,255,0.8)] transition-all transform hover:scale-110 z-20"
              aria-label="Tocar Vídeo"
            >
              <Play className="w-12 h-12 fill-current" />
            </button>
          </div>
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
