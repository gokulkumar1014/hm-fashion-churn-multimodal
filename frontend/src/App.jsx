import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import Playground from './pages/Playground';
import Blueprint from './pages/Blueprint';
import SocialPulse from './pages/SocialPulse';

function Navbar() {
  return (
    <nav className="w-full bg-hm-white border-b border-gray-100 flex justify-between items-center px-6 md:px-12 py-5 sticky top-0 z-50 shadow-sm">
      <div className="font-serif text-2xl tracking-widest text-hm-red font-bold">H&M</div>
      <div className="hidden md:flex gap-10 font-sans text-[11px] uppercase tracking-widest text-hm-gray font-medium">
        <Link to="/" className="hover:text-hm-black transition-colors">Home</Link>
        <Link to="/playground" className="text-hm-black border-b border-hm-black pb-1 hover:text-hm-red transition-colors">Engine</Link>
        <Link to="/blueprint" className="hover:text-hm-black transition-colors">Blueprint</Link>
        <Link to="/social" className="hover:text-hm-black transition-colors">Social Pulse</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/blueprint" element={<Blueprint />} />
        <Route path="/social" element={<SocialPulse />} />
      </Routes>
    </BrowserRouter>
  );
}
