import { Trophy } from 'lucide-react';
import type { PageName } from '@/data/mockData';

interface NavbarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
}

const NAV_ITEMS: { label: string; page: PageName }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Assess Athlete', page: 'assess' },
  { label: 'Athletes', page: 'athletes' },
  { label: 'Scout Dashboard', page: 'dashboard' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="section-padding flex items-center justify-between h-16 lg:h-18">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-royal-600 to-sky-500 flex items-center justify-center shadow-lg shadow-royal-500/25 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="font-display font-bold text-navy-900 text-lg leading-none block">
              TalentSpot
            </span>
            <span className="text-xs text-slate-500 font-medium leading-none block mt-0.5">
              Grassroots
            </span>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                currentPage === item.page
                  ? 'text-royal-700 bg-royal-50'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('register')}
            className="hidden sm:inline-flex btn-primary text-sm px-5 py-2.5"
          >
            Start Assessment
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="sm:hidden btn-primary text-sm px-4 py-2.5"
          >
            Start
          </button>
        </div>
      </div>
    </header>
  );
}
