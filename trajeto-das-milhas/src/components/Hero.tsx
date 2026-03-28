import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import VideoPlayer from './VideoPlayer';

const Hero: React.FC = () => {
  const { content } = useContent();

  return (
    <>
      {/* Animated Banner at Top */}
      <div className="w-full bg-[#0A1128] overflow-hidden py-3 border-b border-[#00D4FF]/20">
        <div className="relative flex whitespace-nowrap">
          <style>{`
            @keyframes scroll-left {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .marquee-content {
              animation: scroll-left 20s linear infinite;
            }
            .marquee-content:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="marquee-content flex">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="text-[#00D4FF] font-bold text-sm md:text-base tracking-widest mx-4">
                  Vagas Limitadas!
                </span>
                <span className="text-[#00D4FF]">•</span>
                <span className="text-[#00D4FF] font-bold text-sm md:text-base tracking-widest mx-4">
                  Garanta Já Seu Acesso!
                </span>
                <span className="text-[#00D4FF]">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="relative flex flex-col items-center pt-[50px] pb-[50px] overflow-hidden">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #00D4FF 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-7xl font-black mb-6 leading-tight tracking-tight whitespace-pre-line">
              <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">
                <span className="md:hidden">{content.hero.titleMobile || content.hero.title}</span>
                <span className="hidden md:inline">{content.hero.title}</span>
              </span>
            </h1>
            <p className="text-base md:text-2xl text-[#8BA3C0] max-w-4xl mx-auto mb-10 leading-relaxed">
              {content.hero.subtitle}
            </p>
            
            {/* Video Player */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <VideoPlayer src={content.hero.videoUrl} title="Trajeto das Milhas Video" />
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href={content.hero.ctaLink}
                className="w-full md:w-auto px-6 md:px-10 py-4 bg-[#00D4FF] text-[#050A14] rounded-full font-black text-sm sm:text-base md:text-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all transform hover:scale-105 text-center flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap"
              >
                <Zap className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                <span>
                  <span className="md:hidden">Entrar no Grupo VIP</span>
                  <span className="hidden md:inline">{content.hero.ctaText}</span>
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
