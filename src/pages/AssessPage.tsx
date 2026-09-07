import { ArrowRight, Smartphone, Bot, TrendingUp, Target, Trophy, Zap, Rocket, RefreshCw, Sparkles } from 'lucide-react';
import type { PageName } from '@/data/mockData';
import { ASSESSMENT_TYPES } from '@/data/mockData';

interface AssessPageProps {
  onNavigate: (page: PageName) => void;
}

const STEPS = [
  { num: '01', icon: Smartphone, title: 'Record', desc: "Smartphone records the athlete's trial.", color: 'from-royal-500 to-sky-400' },
  { num: '02', icon: Bot, title: 'AI Detects', desc: 'Computer vision detects body movement.', color: 'from-purple-500 to-pink-400' },
  { num: '03', icon: TrendingUp, title: 'Measure', desc: 'Extract speed, jump and agility metrics.', color: 'from-green-500 to-emerald-400' },
  { num: '04', icon: Target, title: 'Score', desc: 'Compare performance with benchmarks.', color: 'from-orange-500 to-amber-400' },
  { num: '05', icon: Trophy, title: 'Scout', desc: 'Promising athletes become visible to scouts.', color: 'from-pink-500 to-rose-400' },
];

const ASSESSMENT_ICONS: Record<string, typeof Zap> = {
  sprint: Zap,
  jump: Rocket,
  agility: RefreshCw,
};

export default function AssessPage({ onNavigate }: AssessPageProps) {
  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-10">
      <div className="section-padding">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="badge bg-royal-50 text-royal-700 mb-4 inline-flex">
            <Trophy className="w-4 h-4" />
            AI-Powered Assessment
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-3">
            Assess an Athlete
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Record a trial on your smartphone, let AI analyze the movement, and get an instant performance score.
          </p>
          <div className="mt-6">
            <button onClick={() => onNavigate('register')} className="btn-primary text-base">
              <Smartphone className="w-5 h-5" />
              Start Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="card p-8 lg:p-10 mb-10 animate-fade-in-up animate-delay-100">
          <h2 className="font-display text-2xl font-bold text-navy-900 text-center mb-8">
            From Village Trial to Scout
          </h2>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-2">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center flex-1 min-w-0">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-3`}>
                    <Icon className="w-7 h-7 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-navy-900">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm sm:text-base">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-[140px]">{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center w-full mt-4">
                      <ArrowRight className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment types */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-bold text-navy-900 text-center mb-8 animate-fade-in-up">
            Choose Your Assessment
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ASSESSMENT_TYPES.map((assessment, i) => {
              const Icon = ASSESSMENT_ICONS[assessment.id];
              return (
                <div
                  key={assessment.id}
                  className={`card card-hover p-6 relative animate-fade-in-up ${assessment.recommended ? 'ring-2 ring-purple-300' : ''} ${['animate-delay-100', 'animate-delay-200', 'animate-delay-300'][i]}`}
                >
                  {assessment.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md whitespace-nowrap">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Demo
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl ${assessment.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${assessment.text}`} />
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg mb-1">{assessment.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{assessment.description}</p>
                  <button
                    onClick={() => onNavigate('register')}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${assessment.text} hover:gap-2.5 transition-all`}
                  >
                    Try Test <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="card p-8 text-center bg-gradient-to-r from-navy-900 to-navy-800 animate-fade-in-up animate-delay-500">
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Ready to discover talent?
          </h2>
          <p className="text-slate-400 mb-6">Start with a simple smartphone recording.</p>
          <button onClick={() => onNavigate('register')} className="btn-primary text-base">
            <Smartphone className="w-5 h-5" />
            Start Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
