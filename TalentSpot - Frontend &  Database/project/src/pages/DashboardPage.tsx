import { useState } from 'react';
import {
  Users, Trophy, MapPin, Target, Search, ArrowRight,
  Zap, Rocket, RefreshCw, Navigation,
} from 'lucide-react';
import type { PageName, Potential } from '@/data/mockData';
import { ATHLETES, INDIAN_STATES, SPORTS, DISTRICT_LOCATIONS } from '@/data/mockData';
import { useCountUp, useInView } from '@/hooks/useAnimations';

interface DashboardPageProps {
  onNavigate: (page: PageName) => void;
  onSelectAthlete: (id: string) => void;
}

const POTENTIAL_STYLES: Record<Potential, string> = {
  High: 'bg-green-50 text-green-700',
  Medium: 'bg-orange-50 text-orange-700',
  Low: 'bg-slate-100 text-slate-600',
};

const POTENTIAL_DOT: Record<Potential, string> = {
  High: 'bg-green-500',
  Medium: 'bg-orange-500',
  Low: 'bg-slate-400',
};

function StatCard({ value, label, icon: Icon, color, bg, delay }: { value: number; label: string; icon: typeof Users; color: string; bg: string; delay: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const animated = useCountUp(value, 1500, inView);
  return (
    <div ref={ref} className={`card card-hover p-6 animate-fade-in-up ${delay}`}>
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-3xl font-bold text-navy-900">{animated.toLocaleString()}</p>
      <p className="text-sm text-slate-500 font-medium mt-1">{label}</p>
    </div>
  );
}

function IndiaMap() {
  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden">
      {/* Simplified India outline */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M40,15 Q42,12 45,14 L50,12 L55,15 L60,14 L65,18 L68,16 L72,20 L70,25 L75,28 L78,35 L82,32 L85,38 L80,42 L82,48 L78,52 L75,50 L72,55 L68,52 L65,58 L60,62 L55,60 L50,65 L48,72 L45,78 L42,82 L38,78 L40,72 L35,68 L38,62 L35,58 L40,55 L38,48 L35,42 L38,38 L35,35 L38,28 L36,22 Z"
          fill="#dbeafe"
          stroke="#93c5fd"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>

      {/* Location markers */}
      {DISTRICT_LOCATIONS.map((loc, i) => {
        const athletesHere = ATHLETES.filter((a) => a.district === loc.district).length;
        if (athletesHere === 0) return null;
        const size = athletesHere > 1 ? 'w-4 h-4' : 'w-3 h-3';
        const colors = ['bg-royal-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
        const color = colors[i % colors.length];
        return (
          <div
            key={loc.district}
            className="absolute group"
            style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className={`relative ${size} rounded-full ${color} shadow-lg`}>
              <div className={`absolute inset-0 rounded-full ${color} animate-ping opacity-30`} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-navy-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">
                {loc.district} · {athletesHere}
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2">
        <Navigation className="w-3.5 h-3.5 text-royal-600" />
        <span className="text-xs font-semibold text-slate-600">District markers</span>
      </div>
    </div>
  );
}

export default function DashboardPage({ onNavigate, onSelectAthlete }: DashboardPageProps) {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [potentialFilter, setPotentialFilter] = useState('');

  const filtered = ATHLETES.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (stateFilter && a.state !== stateFilter) return false;
    if (districtFilter && a.district !== districtFilter) return false;
    if (sportFilter && a.sport !== sportFilter) return false;
    if (ageGroup) {
      const [min, max] = ageGroup.split('-').map(Number);
      if (a.age < min || a.age > max) return false;
    }
    if (potentialFilter && a.potential !== potentialFilter) return false;
    return true;
  });

  const districts = stateFilter
    ? [...new Set(ATHLETES.filter((a) => a.state === stateFilter).map((a) => a.district))]
    : [...new Set(ATHLETES.map((a) => a.district))].sort();

  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-10">
      <div className="section-padding">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
            Scout Dashboard
          </h1>
          <p className="text-slate-500 text-lg">Find promising grassroots athletes.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard value={1248} label="Athletes Assessed" icon={Users} color="text-royal-600" bg="bg-royal-50" delay="" />
          <StatCard value={86} label="High Potential" icon={Trophy} color="text-green-600" bg="bg-green-50" delay="animate-delay-100" />
          <StatCard value={24} label="Districts Covered" icon={MapPin} color="text-purple-600" bg="bg-purple-50" delay="animate-delay-200" />
          <StatCard value={3492} label="Trials Completed" icon={Target} color="text-orange-600" bg="bg-orange-50" delay="animate-delay-300" />
        </div>

        {/* Grassroots Coverage Map */}
        <div className="card p-6 sm:p-8 mb-8 animate-fade-in-up animate-delay-300">
          <div className="mb-5">
            <h2 className="font-display text-xl font-bold text-navy-900 mb-1">Talent Across India</h2>
            <p className="text-sm text-slate-500">Connecting grassroots athletes with scouting networks.</p>
          </div>
          <IndiaMap />
        </div>

        {/* Athlete Table */}
        <div className="card p-6 sm:p-8 animate-fade-in-up animate-delay-500">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-navy-900">Athlete Database</h2>
            <span className="text-sm text-slate-400 font-medium">{filtered.length} results</span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search athlete..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-royal-500 focus:bg-white transition-all"
              />
            </div>
            <select value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setDistrictFilter(''); }} className="px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-royal-500 focus:bg-white transition-all">
              <option value="">State</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-royal-500 focus:bg-white transition-all">
              <option value="">District</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-royal-500 focus:bg-white transition-all">
              <option value="">Sport</option>
              {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={potentialFilter} onChange={(e) => setPotentialFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-royal-500 focus:bg-white transition-all">
              <option value="">Potential</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Athlete', 'District', 'Age', 'Sport', 'Speed', 'Power', 'Agility', 'Overall', 'Potential'].map((col) => (
                    <th key={col} className="text-left py-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((athlete, i) => (
                  <tr
                    key={athlete.id}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors animate-fade-in"
                    style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                    onClick={() => {
                      onSelectAthlete(athlete.id);
                      onNavigate('profile');
                    }}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-royal-600 to-sky-500 flex items-center justify-center text-white text-xs font-bold">
                          {athlete.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy-900">{athlete.name}</p>
                          <p className="text-xs text-slate-400 font-mono">#{athlete.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-slate-600">{athlete.district}</td>
                    <td className="py-3 px-2 text-sm text-slate-600">{athlete.age}</td>
                    <td className="py-3 px-2 text-sm text-slate-600">{athlete.sport}</td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-royal-600"><Zap className="w-3.5 h-3.5" />{athlete.speed}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600"><Rocket className="w-3.5 h-3.5" />{athlete.power}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600"><RefreshCw className="w-3.5 h-3.5" />{athlete.agility}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm font-bold text-navy-900">{athlete.overall}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`badge ${POTENTIAL_STYLES[athlete.potential]} text-xs`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${POTENTIAL_DOT[athlete.potential]}`} />
                        {athlete.potential}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((athlete, i) => (
              <div
                key={athlete.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-white hover:shadow-card transition-all animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                onClick={() => {
                  onSelectAthlete(athlete.id);
                  onNavigate('profile');
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-royal-600 to-sky-500 flex items-center justify-center text-white text-xs font-bold">
                      {athlete.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{athlete.name}</p>
                      <p className="text-xs text-slate-400 font-mono">#{athlete.id}</p>
                    </div>
                  </div>
                  <span className={`badge ${POTENTIAL_STYLES[athlete.potential]} text-xs`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${POTENTIAL_DOT[athlete.potential]}`} />
                    {athlete.potential}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>{athlete.district}, {athlete.state}</span>
                  <span>{athlete.age} yrs · {athlete.sport}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white rounded-lg py-1.5">
                    <p className="text-xs text-slate-400">Spd</p>
                    <p className="text-sm font-bold text-royal-600">{athlete.speed}</p>
                  </div>
                  <div className="bg-white rounded-lg py-1.5">
                    <p className="text-xs text-slate-400">Pwr</p>
                    <p className="text-sm font-bold text-purple-600">{athlete.power}</p>
                  </div>
                  <div className="bg-white rounded-lg py-1.5">
                    <p className="text-xs text-slate-400">Agl</p>
                    <p className="text-sm font-bold text-orange-600">{athlete.agility}</p>
                  </div>
                  <div className="bg-white rounded-lg py-1.5">
                    <p className="text-xs text-slate-400">Ovr</p>
                    <p className="text-sm font-bold text-navy-900">{athlete.overall}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No athletes match your filters.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 animate-fade-in-up animate-delay-700">
          <button onClick={() => onNavigate('register')} className="btn-primary text-base">
            <Target className="w-5 h-5" />
            Start New Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
