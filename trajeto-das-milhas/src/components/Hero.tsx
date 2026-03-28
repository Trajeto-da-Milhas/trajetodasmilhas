import React from 'react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { content } = useContent();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-12 md:pt-16 overflow-hidden">
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
          <span className="inline-block px-4 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold mb-4 animate-pulse">
            {content.hero.badge}
          </span>
          <h1 className="text-3xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">
              {content.hero.title}
            </span>
          </h1>
          <p className="text-[#8BA3C0] text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed">
            {content.hero.subtitle}
          </p>
          
          {/* Video Embed - Optimized Size */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border-2 border-[#00D4FF]/20 shadow-[0_0_50px_rgba(0,212,255,0.1)] mb-8"
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

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <a 
              href={content.hero.ctaLink}
              className="px-10 py-4 bg-[#00D4FF] text-[#050A14] rounded-full font-black text-base hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all transform hover:scale-105"
            >
              {content.hero.ctaText}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
