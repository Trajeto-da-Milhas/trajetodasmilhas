import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Proteção contra Inspecionar Elemento e Ferramentas de Desenvolvedor
if (typeof window !== 'undefined') {
  // Desabilitar clique direito
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Desabilitar atalhos de teclado (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && e.key === 'u') ||
      (e.ctrlKey && e.key === 'U') ||
      (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J'))
    ) {
      e.preventDefault();
      return false;
    }
  });

  // Proteção contra seleção de texto e arrastar imagens (via CSS global e JS)
  document.addEventListener('selectstart', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
// Cache bust: Sat Mar 28 01:20:00 EDT 2026
