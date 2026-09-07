import { User, MapPin, Calendar, Activity, Zap, Rocket, RefreshCw, Video, TrendingUp, ArrowRight } from 'lucide-react';
import type { PageName, Athlete } from '@/data/mockData';
import { ATHLETES } from '@/data/mockData';
import { useCountUp, useInView } from '@/hooks/useAnimations';

interface ProfilePageProps {
  onNavigate: (page: PageName) => void;
  athleteId?: string;
}

function ScoreCard({ icon: Icon, label, value, bg, text }: { icon: typeof Zap; label: string; value: number; bg: string; text: string }) {
  return (
    <div className="card card-hover p-5">
      <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${text}`} />
      </div>
      <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
      <p className="font-display text-2xl font-bold text-navy-900">{value}</p>
    </div>
  );
}

function HistoryChart({ data }: { data: number[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 70 - 15;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div ref={ref} className="relative h-40">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 100,100`} fill="url(#chartFill)" className="transition-all duration-1000" />
        <polyline
          points={points}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-1000"
          style={{ strokeDasharray: inView ? 'none' : '1000', strokeDashoffset: inView ? 0 : 1000 }}
        />
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((v - min) / range) * 70 - 15;
          return (
            <circle key={i} cx={x} cy={y} r="1.5" fill="#2563EB" vectorEffect="non-scaling-stroke" className="transition-all duration-1000" />
          );
        })}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
        {['Trial 1', 'Trial 2', 'Trial 3'].map((label, i) => (
          <span key={label} className={i === data.length - 1 ? 'text-royal-600 font-bold' : ''}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage({ onNavigate, athleteId }: ProfilePageProps) {
  const athlete: Athlete = ATHLETES.find((a) => a.id === athleteId) || ATHLETES[0];
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const overallAnimated = useCountUp(athlete.overall, 1500, inView);

  const historyData = [
    athlete.overall - 5,
    athlete.overall - 2,
    athlete.overall,
  ];

  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-10">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="card p-6 sm:p-8 mb-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-royal-600 to-sky-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-mono text-slate-400">Athlete #{athlete.id}</span>
                <h1 className="font-display text-2xl font-bold text-navy-900 mb-2">{athlete.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Age: {athlete.age}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {athlete.district}, {athlete.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-slate-400" />
                    {athlete.sport}
                  </span>
                </div>
              </div>
              <div className="text-center bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl px-6 py-4">
                <p className="text-xs text-slate-400 font-medium mb-1">Overall Score</p>
                <p className="font-display text-4xl font-extrabold text-white">{overallAnimated}</p>
                <p className="text-xs text-green-400 font-semibold mt-1">out of 100</p>
              </div>
            </div>
          </div>

          {/* Performance cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="animate-fade-in-up">
              <ScoreCard icon={Zap} label="Speed" value={athlete.speed} bg="bg-royal-50" text="text-royal-600" />
            </div>
            <div className="animate-fade-in-up animate-delay-100">
              <ScoreCard icon={Rocket} label="Power" value={athlete.power} bg="bg-purple-50" text="text-purple-600" />
            </div>
            <div className="animate-fade-in-up animate-delay-200">
              <ScoreCard icon={RefreshCw} label="Agility" value={athlete.agility} bg="bg-orange-50" text="text-orange-600" />
            </div>
          </div>

          {/* Performance history + Trial videos */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="card p-6 animate-fade-in-up animate-delay-200">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl bg-royal-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-royal-600" />
                </div>
                <h3 className="font-bold text-navy-900">Performance History</h3>
              </div>
              <HistoryChart data={historyData} />
            </div>

            <div className="card p-6 animate-fade-in-up animate-delay-300">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Video className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-bold text-navy-900">Trial Videos</h3>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Vertical Jump', date: 'Sep 6, 2026', duration: '0:12' },
                  { title: 'Sprint 30m', date: 'Sep 4, 2026', duration: '0:08' },
                  { title: 'Agility Drill', date: 'Sep 2, 2026', duration: '0:15' },
                ].map((video, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-900 truncate">{video.title}</p>
                      <p className="text-xs text-slate-400">{video.date} · {video.duration}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up animate-delay-500">
            <button onClick={() => onNavigate('dashboard')} className="btn-primary text-base">
              View All Athletes
            </button>
            <button onClick={() => onNavigate('home')} className="btn-secondary text-base">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
