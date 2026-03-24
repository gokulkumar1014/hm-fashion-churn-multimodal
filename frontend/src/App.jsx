import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Hero from './components/Hero';
import Playground from './pages/Playground';
import Blueprint from './pages/Blueprint';
import SocialPulse from './pages/SocialPulse';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (targetPath) => {
    return path === targetPath
      ? "text-hm-black border-b border-hm-black pb-1 transition-colors"
      : "text-hm-gray hover:text-hm-black transition-colors";
  };

  return (
    <nav className="w-full bg-hm-white border-b border-gray-100 flex justify-between items-center px-6 md:px-12 py-5 sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" alt="H&M Logo" className="h-10" />
      </Link>
      <div className="hidden md:flex gap-10 font-sans text-[11px] uppercase tracking-widest font-medium">
        <Link to="/" className={getLinkClass('/')}>Home</Link>
        <Link to="/playground" className={getLinkClass('/playground')}>Engine</Link>
        <Link to="/blueprint" className={getLinkClass('/blueprint')}>Blueprint</Link>
        <Link to="/social" className={getLinkClass('/social')}>Social Pulse</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen relative pb-10">
        <Navbar />
        <main className="flex-1 w-full bg-hm-light relative">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/blueprint" element={<Blueprint />} />
            <Route path="/social" element={<SocialPulse />} />
          </Routes>
        </main>

        {/* Global System Status Footer Ticker */}
        <div className="fixed bottom-0 left-0 w-full bg-hm-black text-white h-10 px-4 text-center text-xs font-mono tracking-widest z-[100] flex items-center justify-center gap-2 md:gap-4 shadow-2xl border-t border-zinc-800 flex-wrap">
          <span className="flex items-center gap-2 whitespace-nowrap"><span className="text-green-500 animate-pulse text-[10px]">🟢</span> Engine Status: Active</span>
          <span className="text-hm-gray/50 hidden md:inline">|</span>
          <span className="whitespace-nowrap text-gray-300">Inference Latency: &lt;200ms</span>
          <span className="text-hm-gray/50 hidden md:inline">|</span>
          <span className="whitespace-nowrap text-gray-300">Training Recall: 0.88</span>
          <span className="text-hm-gray/50 hidden md:inline">|</span>
          <span className="whitespace-nowrap text-gray-300">Environment: GCP Cloud Run</span>
        </div>
      </div>
    </BrowserRouter>
  );
}
