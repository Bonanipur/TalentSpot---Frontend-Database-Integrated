import { useState } from 'react';
import { Search, MapPin, ArrowRight, Zap, Rocket, RefreshCw, User } from 'lucide-react';
import type { PageName, Potential } from '@/data/mockData';
import { ATHLETES, INDIAN_STATES, SPORTS } from '@/data/mockData';

interface AthletesPageProps {
  onNavigate: (page: PageName) => void;
  onSelectAthlete: (id: string) => void;
}

const POTENTIAL_STYLES: Record<Potential, string> = {
  High: 'bg-green-50 text-green-700',
  Medium: 'bg-orange-50 text-orange-700',
  Low: 'bg-slate-100 text-slate-600',
};

export default function AthletesPage({ onNavigate, onSelectAthlete }: AthletesPageProps) {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [potentialFilter, setPotentialFilter] = useState('');

  const filtered = ATHLETES.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (stateFilter && a.state !== stateFilter) return false;
    if (sportFilter && a.sport !== sportFilter) return false;
    if (potentialFilter && a.potential !== potentialFilter) return false;
    return true;
  });

  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-10">
      <div className="section-padding">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
            Athletes
          </h1>
          <p className="text-slate-500 text-lg">Browse assessed grassroots athletes</p>
        </div>

        {/* Filters */}
        <div className="card p-4 sm:p-5 mb-6 animate-fade-in-up animate-delay-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search athlete..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-royal-500 focus:bg-white transition-all"
              />
            </div>
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-royal-500 focus:bg-white transition-all">
              <option value="">All States</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-royal-500 focus:bg-white transition-all">
              <option value="">All Sports</option>
              {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={potentialFilter} onChange={(e) => setPotentialFilter(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-royal-500 focus:bg-white transition-all">
              <option value="">All Potential</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4 font-medium">
          {filtered.length} athlete{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Athlete cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((athlete, i) => (
            <div
              key={athlete.id}
              className="card card-hover p-5 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
              onClick={() => {
                onSelectAthlete(athlete.id);
                onNavigate('profile');
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal-600 to-sky-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-slate-400">#{athlete.id}</p>
                  <h3 className="font-bold text-navy-900 truncate">{athlete.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {athlete.district}, {athlete.state}
                  </p>
                </div>
                <span className={`badge ${POTENTIAL_STYLES[athlete.potential]} text-xs`}>
                  {athlete.potential}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: Zap, label: 'Speed', value: athlete.speed, color: 'text-royal-600' },
                  { icon: Rocket, label: 'Power', value: athlete.power, color: 'text-purple-600' },
                  { icon: RefreshCw, label: 'Agility', value: athlete.agility, color: 'text-orange-600' },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="text-center bg-slate-50 rounded-xl py-2.5">
                      <Icon className={`w-4 h-4 ${m.color} mx-auto mb-1`} />
                      <p className="text-lg font-bold text-navy-900">{m.value}</p>
                      <p className="text-xs text-slate-400">{m.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Overall</p>
                  <p className="font-display text-lg font-bold text-navy-900">{athlete.overall}<span className="text-sm text-slate-400">/100</span></p>
                </div>
                <span className="text-sm font-semibold text-royal-600 flex items-center gap-1 hover:gap-2 transition-all">
                  View Profile <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-slate-400 text-lg">No athletes match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
