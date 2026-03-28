import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Pricing: React.FC = () => {
  const { content } = useContent();

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6">{content.pricing.sectionTitle}</h2>
          <p className="text-[#8BA3C0]">Invista hoje e economize milhares de reais em suas próximas viagens.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {content.pricing.plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative p-10 rounded-[2.5rem] flex flex-col ${
                plan.highlighted 
                ? 'bg-[#0D1526] border-2 border-[#00D4FF] shadow-[0_0_40px_rgba(0,212,255,0.15)]' 
                : 'bg-[#0D1526]/40 border border-[#00D4FF]/10'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-[#050A14] px-6 py-1 rounded-full font-black text-sm uppercase tracking-tighter">
                  Mais Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <p className="text-[#8BA3C0] text-sm uppercase tracking-widest font-bold">{plan.period}</p>
              </div>

              <div className="mb-10">
                <div className="text-[#00D4FF] text-4xl font-black mb-1">{plan.installments}</div>
                <div className="text-[#8BA3C0] text-lg">{plan.totalPrice}</div>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#E8F4FD]">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
                      <Check className="text-[#00FF94] w-4 h-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a 
                href={plan.checkoutLink}
                className={`w-full py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl text-center flex items-center justify-center gap-4 transition-all ${
                  plan.highlighted 
                  ? 'bg-[#00D4FF] text-[#050A14] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]' 
                  : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                <Zap className="w-6 h-6 flex-shrink-0" />
                <span className="flex flex-col md:block text-left md:text-center leading-tight md:leading-normal">
                  <span className="md:hidden">Quero Garantir<br />Minha Vaga</span>
                  <span className="hidden md:inline">Quero Garantir Minha Vaga</span>
                </span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
