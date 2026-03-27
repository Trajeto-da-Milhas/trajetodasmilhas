import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../../context/ContentContext';
import { logout } from '../../firebase';
import { LogOut, Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import HeaderDev from './HeaderDev';
import HeroEditor from './HeroEditor';
import WhatIsEditor from './WhatIsEditor';
import BenefitsEditor from './BenefitsEditor';
import TestimonialsEditor from './TestimonialsEditor';
import PricingEditor from './PricingEditor';
import BonusesEditor from './BonusesEditor';
import GuaranteeEditor from './GuaranteeEditor';
import AboutEditor from './AboutEditor';
import FAQEditor from './FAQEditor';

const AdminPanel: React.FC = () => {
  const { content, updateContent, isAuthReady } = useContent();
  const [activeTab, setActiveTab] = useState('hero');

  const handleSave = () => {
    updateContent(content);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#050A14] flex items-center justify-center">
        <Loader2 className="text-[#00D4FF] animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050A14] text-white flex flex-col font-sans selection:bg-[#00D4FF] selection:text-[#050A14]">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <HeaderDev content={content} onSave={handleSave} />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto bg-[#050A14]/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'hero' && <HeroEditor />}
                {activeTab === 'whatis' && <WhatIsEditor />}
                {activeTab === 'benefits' && <BenefitsEditor />}
                {activeTab === 'testimonials' && <TestimonialsEditor />}
                {activeTab === 'pricing' && <PricingEditor />}
                {activeTab === 'bonuses' && <BonusesEditor />}
                {activeTab === 'guarantee' && <GuaranteeEditor />}
                {activeTab === 'about' && <AboutEditor />}
                {activeTab === 'faq' && <FAQEditor />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
