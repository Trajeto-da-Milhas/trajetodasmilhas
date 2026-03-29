import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Info, 
  Star, 
  CreditCard, 
  Gift, 
  HelpCircle, 
  User, 
  ShieldCheck,
  ChevronRight,
  Video
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const tabs = [
    { id: 'hero', label: 'Hero', icon: Layout },
    { id: 'whatis', label: 'O que é', icon: Info },
    { id: 'benefits', label: 'Benefícios', icon: Star },
    { id: 'testimonials', label: 'Depoimentos', icon: Star },
    { id: 'pricing', label: 'Preços', icon: CreditCard },
    { id: 'bonuses', label: 'Bônus', icon: Gift },
    { id: 'guarantee', label: 'Garantia', icon: ShieldCheck },
    { id: 'about', label: 'Quem é', icon: User },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <aside className="w-72 bg-[#0D1526]/50 border-r border-white/5 p-6 flex flex-col gap-4 backdrop-blur-md">
      <div className="mb-8">
        <h2 className="text-[10px] font-mono text-[#8BA3C0] uppercase tracking-[0.3em] mb-4 opacity-50">SEÇÕES DO SITE</h2>
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 shadow-[0_0_20px_rgba(0,212,255,0.1)]' 
                    : 'text-[#8BA3C0] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-sm font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {tab.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -right-[25px] w-1 h-8 bg-[#00D4FF] rounded-l-full shadow-[0_0_15px_#00D4FF]"
                  />
                )}
                <ChevronRight size={14} className={`transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-50 group-hover:translate-x-0'}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {/* VSL Studio Button */}
        <button
          onClick={() => navigate('/dev/vsl-studio')}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#7B2FFF]/20 border border-[#00D4FF]/30 hover:border-[#00D4FF]/60 text-[#00D4FF] transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00D4FF]/20 group-hover:bg-[#00D4FF]/30 transition-colors">
              <Video size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">VSL Studio</span>
          </div>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Status Box */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0D1526] to-[#050A14] border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse shadow-[0_0_10px_#00FF94]" />
            <span className="text-[10px] font-mono text-[#00FF94] uppercase tracking-widest">SISTEMA ONLINE</span>
          </div>
          <p className="text-[10px] text-[#8BA3C0] leading-relaxed">
            As alterações são refletidas em tempo real no estado global do aplicativo.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
