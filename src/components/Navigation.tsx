import { TrendingUp } from 'lucide-react';

interface NavigationProps {
  onLoginClick: () => void;
}

export default function Navigation({ onLoginClick }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Fantastic Financial
            </span>
          </div>
          <div className="hidden md:flex gap-8">

            <a href="/markets" className="text-slate-700 hover:text-blue-600 transition">Indian Markets</a>
            <a href="/wallstreet" className="text-slate-700 hover:text-blue-600 transition">Wall Street</a>
            <a href="/crypto" className="text-slate-700 hover:text-blue-600 transition">Crypto</a>
            <a href="#about" className="text-slate-700 hover:text-blue-600 transition">About</a>
            <a href="#contact" className="text-slate-700 hover:text-blue-600 transition">Contact</a>
          </div>
          <button
            onClick={onLoginClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}