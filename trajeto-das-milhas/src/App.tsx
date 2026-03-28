import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DevPage from './pages/DevPage';
import VSLStudio from './pages/VSLStudio';
import { ContentProvider } from './context/ContentContext';

export default function App() {
  return (
    <ContentProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dev" element={<DevPage />} />
          <Route path="/dev/vsl-studio" element={<VSLStudio />} />
        </Routes>
      </HashRouter>
    </ContentProvider>
  );
}
