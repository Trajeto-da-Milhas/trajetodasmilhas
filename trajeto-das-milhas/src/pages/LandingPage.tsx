import React from 'react';
import { useContent } from '../context/ContentContext';
import { Loader2 } from 'lucide-react';
import Hero from '../components/Hero';
import WhatIs from '../components/WhatIs';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Bonuses from '../components/Bonuses';
import Guarantee from '../components/Guarantee';
import About from '../components/About';
import FAQ from '../components/FAQ';

const LandingPage: React.FC = () => {
  const { isContentReady } = useContent();

  if (!isContentReady) {
    return (
      <div className="min-h-screen bg-[#050A14] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] animate-pulse shadow-[0_0_30px_rgba(0,212,255,0.3)]" />
          <Loader2 className="absolute inset-0 m-auto text-[#050A14] animate-spin" size={32} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-sm font-black tracking-[0.2em] uppercase text-white">
            Carregando <span className="text-[#00D4FF]">Trajeto</span>
          </h2>
          <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="bg-[#050A14] text-[#E8F4FD] min-h-screen font-sans selection:bg-[#00D4FF] selection:text-[#050A14]">
      <Hero />
      <WhatIs />
      <Benefits />
      <Testimonials />
      <Pricing />
      <Bonuses />
      <Guarantee />
      <About />
      <FAQ />
    </main>
  );
};

export default LandingPage;
