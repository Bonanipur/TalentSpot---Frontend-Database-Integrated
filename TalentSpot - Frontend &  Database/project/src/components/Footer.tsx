import { Trophy, Heart } from 'lucide-react';
import type { PageName } from '@/data/mockData';

interface FooterProps {
  onNavigate: (page: PageName) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-navy-900 text-slate-300 mt-20">
      <div className="section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-royal-600 to-sky-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg block leading-none">
                  TalentSpot
                </span>
                <span className="text-xs text-slate-400 font-medium block mt-0.5">
                  Grassroots
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-assisted sports talent identification for grassroots athletes across India.
              Smartphone-first, scout-ready.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('assess')} className="hover:text-sky-400 transition-colors">
                  Assess Athlete
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('athletes')} className="hover:text-sky-400 transition-colors">
                  Athletes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-sky-400 transition-colors">
                  Scout Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">About</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>How It Works</li>
              <li>Demo Mode</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <p>© 2026 TalentSpot Grassroots. Hackathon Demo.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for grassroots sports
          </p>
        </div>
      </div>
    </footer>
  );
}
