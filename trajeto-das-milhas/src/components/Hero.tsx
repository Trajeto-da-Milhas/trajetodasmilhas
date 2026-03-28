import React from 'react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';

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

      <section className="relative flex flex-col items-center pt-[50px] pb-0 overflow-hidden">
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
            <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">
                {content.hero.title}
              </span>
            </h1>
            <p className="text-[#8BA3C0] text-xl md:text-2xl max-w-4xl mx-auto mb-10 leading-relaxed">
              {content.hero.subtitle}
            </p>
            
            {/* Video Embed */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden border-2 border-[#00D4FF]/20 shadow-[0_0_50px_rgba(0,212,255,0.1)] mb-12"
            >
              <iframe 
                width="100%" 
                height="100%" 
                src={content.hero.videoUrl} 
                title="Trajeto das Milhas Video"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-0">
              <a 
                href={content.hero.ctaLink}
                className="px-10 py-4 bg-[#00D4FF] text-[#050A14] rounded-full font-black text-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all transform hover:scale-105"
              >
                {content.hero.ctaText}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
