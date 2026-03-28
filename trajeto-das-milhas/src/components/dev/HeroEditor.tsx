import React, { useState, useEffect } from 'react';
import { useDraft } from './AdminPanel';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import VideoUpload from './VideoUpload';
import EditorSection from './EditorSection';
import { Play, Link, Award, BarChart3, Eye, Clock, Zap, TrendingUp, Percent, AlertCircle } from 'lucide-react';
import { getVideoMetrics } from '../../services/videoAnalytics';
import type { VideoMetrics } from '../../services/videoAnalytics';

const HeroEditor: React.FC = () => {
  const { draft, updateDraft } = useDraft();
  const { hero } = draft;
  const [metrics, setMetrics] = useState<VideoMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar métricas REAIS quando o vídeo mudar
  useEffect(() => {
    if (hero.videoUrl) {
      setIsLoadingMetrics(true);
      setError(null);
      
      getVideoMetrics(hero.videoUrl)
        .then((data) => {
          setMetrics(data);
          setIsLoadingMetrics(false);
        })
        .catch((err) => {
          console.error('Erro ao carregar métricas:', err);
          setError('Não foi possível carregar as métricas. Verifique se o Supabase está configurado.');
          setIsLoadingMetrics(false);
        });
    }
  }, [hero.videoUrl]);

  const handleChange = (field: string, value: any) => {
    updateDraft({
      ...draft,
      hero: { ...hero, [field]: value }
    });
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const newStats = [...hero.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    handleChange('stats', newStats);
  };

  return (
    <EditorSection 
      title="Hero" 
      description="A primeira impressão do seu site. Configure o título, vídeo e CTA principal."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputField 
          label="Badge (Texto Pequeno)" 
          value={hero.badge} 
          onChange={(val) => handleChange('badge', val)}
          placeholder="Ex: 🔥 Vagas Limitadas"
        />
        <InputField 
          label="Texto do Botão (CTA)" 
          value={hero.ctaText} 
          onChange={(val) => handleChange('ctaText', val)}
          placeholder="Ex: Entrar no Grupo VIP"
        />
      </div>

      <TextAreaField 
        label="Título Principal" 
        value={hero.title} 
        onChange={(val) => handleChange('title', val)}
        placeholder="O título de impacto da sua página"
      />

      <TextAreaField 
        label="Título Principal (Mobile)" 
        value={hero.titleMobile || hero.title} 
        onChange={(val) => handleChange('titleMobile', val)}
        placeholder="Título otimizado para dispositivos móveis (deixe em branco para usar o título principal)"
      />

      <TextAreaField 
        label="Subtítulo" 
        value={hero.subtitle} 
        onChange={(val) => handleChange('subtitle', val)}
        placeholder="Uma breve descrição persuasiva"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Coluna da Esquerda: URL e Upload Direto ocupando o espaço vazio */}
        <div className="flex flex-col gap-6">
          <InputField 
            label="URL do Vídeo (YouTube Embed ou Link Direto)" 
            value={hero.videoUrl} 
            onChange={(val) => handleChange('videoUrl', val)}
            placeholder="https://www.youtube.com/embed/..."
            icon={<Play size={14} />}
            preview={
              <div className="w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {hero.videoUrl.includes('youtube.com') || hero.videoUrl.includes('youtu.be') ? (
                  <iframe 
                    src={hero.videoUrl} 
                    className="w-full h-full" 
                    title="Preview"
                  />
                ) : (
                  <video src={hero.videoUrl} controls className="w-full h-full object-contain" />
                )}
              </div>
            }
          />
          
          {/* O VideoUpload agora está explicitamente dentro da mesma coluna da URL */}
          <div className="w-full">
            <VideoUpload 
              onUploadSuccess={(url) => handleChange('videoUrl', url)} 
              label="Fazer Upload de Vídeo Direto" 
            />
          </div>
        </div>
        
        {/* Coluna da Direita: Link CTA e Métricas */}
        <div className="flex flex-col gap-6">
          <InputField 
            label="Link do Botão (CTA)" 
            value={hero.ctaLink} 
            onChange={(val) => handleChange('ctaLink', val)}
            placeholder="#pricing"
            icon={<Link size={14} />}
          />

          {/* Video Metrics Section */}
          <div className="p-6 bg-[#0A1221] border border-[#00D4FF]/20 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-[#00D4FF] font-black text-xs uppercase tracking-widest">
                <BarChart3 size={16} /> MÉTRICAS REAIS DO VÍDEO
              </div>
              {isLoadingMetrics && (
                <div className="text-[10px] text-[#8BA3C0] animate-pulse">Consultando Banco...</div>
              )}
            </div>
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 mb-4">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}
            
            {metrics ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0D1526] rounded-xl border border-white/5 hover:border-[#00D4FF]/30 transition-colors">
                  <div className="flex items-center gap-2 text-[#8BA3C0] text-[10px] uppercase font-bold mb-1">
                    <Eye size={12} /> Visualizações
                  </div>
                  <div className="text-xl font-black text-white">{metrics.totalViews.toLocaleString()}</div>
                  <div className="text-[10px] text-green-500 font-bold">Plays Reais</div>
                </div>
                
                <div className="p-4 bg-[#0D1526] rounded-xl border border-white/5 hover:border-[#00D4FF]/30 transition-colors">
                  <div className="flex items-center gap-2 text-[#8BA3C0] text-[10px] uppercase font-bold mb-1">
                    <Percent size={12} /> Retenção Média
                  </div>
                  <div className="text-xl font-black text-white">{metrics.averageRetention}%</div>
                  <div className="text-[10px] text-[#00D4FF] font-bold">{metrics.completedViews} Terminaram</div>
                </div>

                <div className="p-4 bg-[#0D1526] rounded-xl border border-white/5 hover:border-[#00D4FF]/30 transition-colors">
                  <div className="flex items-center gap-2 text-[#8BA3C0] text-[10px] uppercase font-bold mb-1">
                    <Clock size={12} /> Tempo Médio
                  </div>
                  <div className="text-xl font-black text-white">{Math.floor(metrics.averageWatchTime / 60)}:{String(metrics.averageWatchTime % 60).padStart(2, '0')}</div>
                  <div className="text-[10px] text-[#8BA3C0] font-bold">Duração Média</div>
                </div>

                <div className="p-4 bg-[#0D1526] rounded-xl border border-white/5 hover:border-[#00D4FF]/30 transition-colors">
                  <div className="flex items-center gap-2 text-[#8BA3C0] text-[10px] uppercase font-bold mb-1">
                    <Zap size={12} /> Cliques no CTA
                  </div>
                  <div className="text-xl font-black text-[#00FF94]">{metrics.ctaClicks}</div>
                  <div className="text-[10px] text-[#00FF94] font-bold">{metrics.ctr.toFixed(1)}% Conversão</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[#8BA3C0]">
                <p className="text-sm">Aguardando dados reais do banco de dados...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00D4FF] font-bold">
          <Award size={14} /> ESTATÍSTICAS (STATS)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hero.stats.map((stat, index) => (
            <div key={index} className="p-4 bg-[#0D1526] border border-white/5 rounded-xl space-y-4">
              <InputField 
                label={`Valor ${index + 1}`} 
                value={stat.value} 
                onChange={(val) => handleStatChange(index, 'value', val)}
                placeholder="Ex: 10.000+"
              />
              <InputField 
                label={`Rótulo ${index + 1}`} 
                value={stat.label} 
                onChange={(val) => handleStatChange(index, 'label', val)}
                placeholder="Ex: Membros"
              />
            </div>
          ))}
        </div>
      </div>
    </EditorSection>
  );
};

export default HeroEditor;
