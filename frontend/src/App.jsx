import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  const getLinkClass = (targetPath) => {
    return path === targetPath
      ? "text-hm-black border-b border-hm-black pb-1 transition-colors"
      : "text-hm-gray hover:text-hm-black transition-colors";
  };

  const mobileLinkClass = (targetPath) => {
    return path === targetPath
      ? "block text-hm-black font-bold border-l-2 border-hm-red pl-6 py-3 bg-gray-50 uppercase tracking-widest text-[11px]"
      : "block text-hm-gray hover:text-hm-black pl-6 py-3 uppercase tracking-widest text-[11px] hover:bg-gray-50 transition-colors";
  };

  return (
    <nav className="w-full bg-hm-white border-b border-gray-100 flex flex-col px-0 md:px-12 py-0 md:py-5 sticky top-0 z-50 shadow-sm relative">
      <div className="flex justify-between items-center w-full px-6 md:px-0 py-5 md:py-0 bg-hm-white relative z-10">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" alt="H&M Logo" className="h-10" />
        </Link>
        
        <div className="hidden md:flex gap-10 font-sans text-[11px] uppercase tracking-widest font-medium">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/playground" className={getLinkClass('/playground')}>Engine</Link>
          <Link to="/social" className={getLinkClass('/social')}>Social Pulse</Link>
          <Link to="/blueprint" className={getLinkClass('/blueprint')}>Blueprint</Link>
        </div>

        {/* Mobile Nav Hamburger */}
        <button 
          className="md:hidden text-hm-black p-2 -mr-2 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-hm-white border-t border-gray-100 shadow-lg flex flex-col py-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link to="/" className={mobileLinkClass('/')}>Home</Link>
          <Link to="/playground" className={mobileLinkClass('/playground')}>Engine</Link>
          <Link to="/social" className={mobileLinkClass('/social')}>Social Pulse</Link>
          <Link to="/blueprint" className={mobileLinkClass('/blueprint')}>Blueprint</Link>
        </div>
      )}
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
            <Route path="/social" element={<SocialPulse />} />
            <Route path="/blueprint" element={<Blueprint />} />
          </Routes>
        </main>

        {/* Global System Status Footer Ticker */}
        <div className="fixed bottom-0 left-0 w-full bg-hm-black text-white h-10 px-4 text-center text-[10px] sm:text-[11px] font-mono tracking-widest z-[100] flex items-center justify-center gap-2 md:gap-4 shadow-2xl border-t border-zinc-800 flex-wrap overflow-hidden">
           <span className="flex items-center gap-2 whitespace-nowrap"><span className="text-green-500 animate-pulse text-[8px]">●</span> Engine: Cloud Run</span>
           <span className="text-hm-gray/50 hidden sm:inline">|</span>
           <span className="flex items-center gap-2 whitespace-nowrap"><span className="text-green-500 animate-pulse text-[8px]">●</span> GCS Connectivity: Stable</span>
           <span className="text-hm-gray/50 hidden md:inline">|</span>
           <span className="whitespace-nowrap text-gray-300 hidden sm:inline">Latency: Warm-Start Optimized</span>
           <span className="text-hm-gray/50 hidden md:inline">|</span>
           <span className="whitespace-nowrap text-gray-300">Model Recall: 0.88</span>
        </div>
      </div>
    </BrowserRouter>
  );
}
