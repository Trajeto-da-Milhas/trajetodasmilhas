import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../../context/ContentContext';
import { Loader2 } from 'lucide-react';
import { SiteContent } from '../../types';
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

// Contexto local de draft para que os editores trabalhem com estado local
// e o Firebase só seja atualizado ao clicar em "SALVAR NO SITE"
interface DraftContextType {
  draft: SiteContent;
  updateDraft: (newContent: SiteContent) => void;
}

export const DraftContext = React.createContext<DraftContextType | undefined>(undefined);

export const useDraft = () => {
  const context = React.useContext(DraftContext);
  if (!context) {
    throw new Error('useDraft must be used within AdminPanel');
  }
  return context;
};

const AdminPanel: React.FC = () => {
  const { content, updateContent, isAuthReady } = useContent();
  const [activeTab, setActiveTab] = useState('hero');
  const [draft, setDraft] = useState<SiteContent>(content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sincronizar o draft quando o conteúdo do Firestore for atualizado
  // (mas apenas se não houver alterações não salvas para não sobrescrever o trabalho do usuário)
  useEffect(() => {
    if (!hasUnsavedChanges) {
      setDraft(content);
    }
  }, [content]);

  const updateDraft = (newContent: SiteContent) => {
    setDraft(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    await updateContent(draft);
    setHasUnsavedChanges(false);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#050A14] flex items-center justify-center">
        <Loader2 className="text-[#00D4FF] animate-spin" size={48} />
      </div>
    );
  }

  return (
    <DraftContext.Provider value={{ draft, updateDraft }}>
      <div className="h-screen bg-[#050A14] text-white flex flex-col font-sans selection:bg-[#00D4FF] selection:text-[#050A14] overflow-hidden">
        {/* Background Grid */}
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>

        {/* Header Fixo */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <HeaderDev content={draft} onSave={handleSave} hasUnsavedChanges={hasUnsavedChanges} />
        </div>

        {/* Container Principal */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Sidebar Fixa - Ocupa toda a altura e não tem sobra superior */}
          <div className="w-72 h-full">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Conteúdo Principal Rolável - Tem padding superior para compensar o header fixo */}
          <main className="flex-1 h-full overflow-y-auto bg-[#050A14]/50 backdrop-blur-sm pt-20">
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
    </DraftContext.Provider>
  );
};

export default AdminPanel;
