import { ArrowRight, Zap, Target, Trophy, User, BarChart3, TrendingUp, Info } from 'lucide-react';
import type { PageName, TrialResult } from '@/data/mockData';
import { DEMO_RESULT } from '@/data/mockData';
import { useCountUp, useInView } from '@/hooks/useAnimations';
import ProgressIndicator from '@/components/ProgressIndicator';

interface ResultsPageProps {
  onNavigate: (page: PageName) => void;
  trialResult?: TrialResult | null;
}

function CircularScore({ score }: { score: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const animatedScore = useCountUp(score, 1500, inView);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div ref={ref} className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-extrabold text-navy-900">{animatedScore}</span>
        <span className="text-sm text-slate-400 font-medium">out of 100</span>
      </div>
    </div>
  );
}

function MetricBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const animatedValue = useCountUp(value, 1200, inView);

  return (
    <div ref={ref} className={`animate-fade-in-up ${delay}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-navy-900">{animatedValue}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultsPage({ onNavigate, trialResult }: ResultsPageProps) {
  const result = trialResult || DEMO_RESULT;

  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-10">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
              Your AI Performance Report 🎉
            </h1>
            <p className="text-slate-500 text-lg">Vertical Jump Assessment Results</p>
          </div>

          <div className="mb-8 animate-fade-in-up animate-delay-100">
            <ProgressIndicator steps={['Profile', 'Trial', 'Results']} currentStep={2} />
          </div>

          {/* Athlete card */}
          <div className="card p-6 sm:p-8 mb-6 animate-fade-in-up animate-delay-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-royal-600 to-sky-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-sm font-mono text-slate-400">Athlete #TS-1024</span>
                  <span className="badge bg-green-50 text-green-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {result.potential === 'High' ? 'Elite Potential' : 'Above Average'}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Vertical Jump</h2>
                <p className="text-slate-500 text-sm">Computer Vision Biomechanical Assessment</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm text-slate-400 font-medium">Jump Height</p>
                <p className="font-display text-4xl font-extrabold text-gradient-blue">
                  {result.jumpHeight} cm
                </p>
              </div>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: Zap, label: 'Explosive Power', value: `${result.explosivePower}/100`, bg: 'bg-royal-50', text: 'text-royal-600', delay: 'animate-delay-100' },
              { icon: Target, label: 'AI Confidence', value: `${result.aiConfidence}%`, bg: 'bg-green-50', text: 'text-green-600', delay: 'animate-delay-200' },
              { icon: Trophy, label: 'Potential', value: result.potential, bg: 'bg-purple-50', text: 'text-purple-600', delay: 'animate-delay-300' },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className={`card card-hover p-6 animate-fade-in-up ${metric.delay}`}>
                  <div className={`w-12 h-12 rounded-2xl ${metric.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${metric.text}`} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">{metric.label}</p>
                  <p className="font-display text-2xl font-bold text-navy-900">{metric.value}</p>
                </div>
              );
            })}
          </div>

          {/* Overall score */}
          <div className="card p-8 mb-6 animate-fade-in-up animate-delay-300">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <CircularScore score={result.overall} />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">
                  Overall Screening Score
                </h3>
                <p className="text-lg font-semibold text-green-600 mb-4">
                  Strong Candidate for Further Evaluation
                </p>
                <div className="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 rounded-2xl p-4">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p>
                    AI-assisted first-level screening. Final athlete selection requires professional evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance breakdown */}
          <div className="card p-6 sm:p-8 mb-6 animate-fade-in-up animate-delay-500">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-royal-50 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-royal-600" />
              </div>
              <h3 className="font-bold text-navy-900 text-lg">Performance Breakdown</h3>
            </div>
            <div className="space-y-5">
              <MetricBar label="Explosive Power" value={result.explosivePower} color="bg-gradient-to-r from-royal-500 to-sky-400" delay="" />
              <MetricBar label="Speed" value={result.speed} color="bg-gradient-to-r from-green-500 to-emerald-400" delay="animate-delay-100" />
              <MetricBar label="Agility" value={result.agility} color="bg-gradient-to-r from-orange-500 to-amber-400" delay="animate-delay-200" />
              <MetricBar label="Overall" value={result.overall} color="bg-gradient-to-r from-purple-500 to-pink-400" delay="animate-delay-300" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up animate-delay-700">
            <button onClick={() => onNavigate('profile')} className="btn-primary text-base">
              <TrendingUp className="w-5 h-5" />
              View Athlete Profile
            </button>
            <button onClick={() => onNavigate('dashboard')} className="btn-secondary text-base">
              <BarChart3 className="w-5 h-5" />
              Go to Scout Dashboard
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            This is demo data for hackathon demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
