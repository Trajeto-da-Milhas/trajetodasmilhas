// Serviço de Analytics com Supabase como backend
// Todos os dados são 100% REAIS - Rastreamento de Alta Precisão

import { 
  trackVideoEvent, 
  trackRetentionEvent,
  updateUserSession,
  getVideoMetrics as getSupabaseMetrics, 
  getRetentionData,
  getDeviceAnalytics,
  getConversionBySecond,
  getSessionId 
} from './supabaseClient';

export interface VideoMetrics {
  videoUrl: string;
  blurViews: number;
  totalViews: number;
  completedViews: number;
  averageWatchTime: number;
  ctaClicks: number;
  ctr: number;
  averageRetention: number;
  lastUpdated: string;
}

export interface RetentionDataPoint {
  second_position: number;
  viewer_count: number;
}

export interface DeviceAnalytic {
  device_type: string;
  total_sessions: number;
  play_clicks: number;
  completed_views: number;
  completion_rate: number;
}

// Registrar evento de visualização desfocada (blur view)
export const trackBlurView = async (videoUrl: string) => {
  if (!videoUrl) return;
  console.log(`[Analytics] Registrando Blur View para: ${videoUrl}`);
  
  await trackVideoEvent({
    video_url: videoUrl,
    event_type: 'blur_view',
    user_session_id: getSessionId(),
  });

  // Atualizar sessão do usuário
  await updateUserSession(getSessionId(), videoUrl, {
    blur_view_count: 1,
  });
};

// Registrar evento de play (quando o usuário clica no botão)
export const trackVideoPlay = async (videoUrl: string) => {
  if (!videoUrl) return;
  console.log(`[Analytics] Registrando Play Real para: ${videoUrl}`);
  
  await trackVideoEvent({
    video_url: videoUrl,
    event_type: 'play',
    user_session_id: getSessionId(),
  });

  // Atualizar sessão do usuário
  await updateUserSession(getSessionId(), videoUrl, {
    play_count: 1,
  });
};

// Registrar evento de retenção (segundo a segundo)
export const trackVideoRetention = async (
  videoUrl: string,
  currentTime: number,
  totalDuration: number
) => {
  if (!videoUrl) return;
  
  // Registrar apenas a cada 5 segundos para não sobrecarregar o banco
  if (Math.round(currentTime) % 5 === 0) {
    console.log(`[Analytics] Registrando Retenção: ${Math.round(currentTime)}s / ${totalDuration}s`);
    
    await trackRetentionEvent({
      video_url: videoUrl,
      user_session_id: getSessionId(),
      video_current_time: currentTime,
      total_duration: totalDuration,
    });
  }
};

// Registrar evento de conclusão REAL
export const trackVideoCompleted = async (
  videoUrl: string,
  watchedSeconds: number,
  totalDuration: number
) => {
  if (!videoUrl) return;
  console.log(`[Analytics] Registrando Conclusão Real para: ${videoUrl}`);
  
  await trackVideoEvent({
    video_url: videoUrl,
    event_type: 'ended',
    watched_seconds: Math.round(watchedSeconds),
    total_duration: Math.round(totalDuration),
    user_session_id: getSessionId(),
  });

  // Atualizar sessão do usuário com tempo total assistido
  await updateUserSession(getSessionId(), videoUrl, {
    total_watch_time: Math.round(watchedSeconds),
    ended_at: new Date().toISOString(),
  });
};

// Registrar clique no CTA REAL
export const trackCTAClick = async (videoUrl: string, currentTime?: number) => {
  if (!videoUrl) return;
  console.log(`[Analytics] Registrando Clique no CTA Real para o vídeo: ${videoUrl}`);
  
  await trackVideoEvent({
    video_url: videoUrl,
    event_type: 'cta_click',
    watched_seconds: currentTime ? Math.round(currentTime) : undefined,
    user_session_id: getSessionId(),
  });

  // Atualizar sessão do usuário
  await updateUserSession(getSessionId(), videoUrl, {
    cta_clicked: true,
  });
};

// Obter métricas 100% REAIS do Supabase
export const getVideoMetrics = async (videoUrl: string): Promise<VideoMetrics> => {
  if (!videoUrl) {
    return {
      videoUrl: '',
      blurViews: 0,
      totalViews: 0,
      completedViews: 0,
      averageWatchTime: 0,
      ctaClicks: 0,
      ctr: 0,
      averageRetention: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  const metrics = await getSupabaseMetrics(videoUrl);
  
  if (!metrics) {
    return {
      videoUrl,
      blurViews: 0,
      totalViews: 0,
      completedViews: 0,
      averageWatchTime: 0,
      ctaClicks: 0,
      ctr: 0,
      averageRetention: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  return metrics;
};

// Obter dados de retenção para gráfico
export const getRetentionChartData = async (videoUrl: string): Promise<RetentionDataPoint[]> => {
  if (!videoUrl) return [];
  
  const data = await getRetentionData(videoUrl);
  return data || [];
};

// Obter análise por dispositivo
export const getDeviceStats = async (videoUrl: string): Promise<DeviceAnalytic[]> => {
  if (!videoUrl) return [];
  
  const data = await getDeviceAnalytics(videoUrl);
  return data || [];
};

// Obter taxa de conversão por segundo
export const getConversionStats = async (videoUrl: string) => {
  if (!videoUrl) return [];
  
  const data = await getConversionBySecond(videoUrl);
  return data || [];
};
