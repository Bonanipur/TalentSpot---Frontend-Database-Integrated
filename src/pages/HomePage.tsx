import {
  Smartphone,
  Bot,
  TrendingUp,
  Target,
  Trophy,
  ArrowRight,
  Zap,
  Rocket,
  RefreshCw,
  Sparkles,
  BarChart3,
  Users,
  MapPin,
  Award,
} from 'lucide-react';
import type { PageName } from '@/data/mockData';
import { ASSESSMENT_TYPES } from '@/data/mockData';
import AthleteViz from '@/components/AthleteViz';
import { useCountUp, useInView } from '@/hooks/useAnimations';

interface HomePageProps {
  onNavigate: (page: PageName) => void;
}

const IMPACT_STATS = [
  { value: '10K+', label: 'Athletes Potentially Reachable', icon: Users, color: 'text-royal-600', bg: 'bg-royal-50' },
  { value: '₹0', label: 'Specialized Equipment Required', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
  { value: '1', label: 'Smartphone Needed', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  { value: '∞', label: 'Grassroots Potential', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const STEPS = [
  { num: '01', icon: Smartphone, title: 'Record', desc: "Smartphone records the athlete's trial.", color: 'from-royal-500 to-sky-400', bg: 'bg-royal-50', text: 'text-royal-700' },
  { num: '02', icon: Bot, title: 'AI Detects', desc: 'Computer vision detects body movement.', color: 'from-purple-500 to-pink-400', bg: 'bg-purple-50', text: 'text-purple-700' },
  { num: '03', icon: TrendingUp, title: 'Measure', desc: 'Extract speed, jump and agility metrics.', color: 'from-green-500 to-emerald-400', bg: 'bg-green-50', text: 'text-green-700' },
  { num: '04', icon: Target, title: 'Score', desc: 'Compare performance with benchmarks.', color: 'from-orange-500 to-amber-400', bg: 'bg-orange-50', text: 'text-orange-700' },
  { num: '05', icon: Trophy, title: 'Scout', desc: 'Promising athletes become visible to scouts.', color: 'from-pink-500 to-rose-400', bg: 'bg-pink-50', text: 'text-pink-700' },
];

const ASSESSMENT_ICONS: Record<string, typeof Zap> = {
  sprint: Zap,
  jump: Rocket,
  agility: RefreshCw,
};

function ImpactStatCard({ stat, delay }: { stat: typeof IMPACT_STATS[0]; delay: string }) {
  const Icon = stat.icon;
  return (
    <div className={`card card-hover p-5 flex items-center gap-4 animate-fade-in-up ${delay}`}>
      <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${stat.color}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy-900 leading-none">{stat.value}</p>
        <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
      </div>
    </div>
  );
}

function StepCard({ step, isLast }: { step: typeof STEPS[0]; isLast: boolean }) {
  const Icon = step.icon;
  return (
    <div className="flex flex-col items-center text-center flex-1 min-w-0">
      <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-3`}>
        <Icon className="w-7 h-7 text-white" />
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-navy-900">
          {step.num}
        </span>
      </div>
      <h3 className="font-bold text-navy-900 text-sm sm:text-base">{step.title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-[140px]">{step.desc}</p>
      {!isLast && (
        <div className="hidden lg:flex items-center justify-center w-full mt-4">
          <ArrowRight className="w-5 h-5 text-slate-300" />
        </div>
      )}
    </div>
  );
}

function AssessmentCard({ assessment, onNavigate }: { assessment: typeof ASSESSMENT_TYPES[0]; onNavigate: (page: PageName) => void }) {
  const Icon = ASSESSMENT_ICONS[assessment.id];
  return (
    <div
      className={`card card-hover p-6 ${assessment.recommended ? 'ring-2 ring-purple-300 relative' : ''}`}
    >
      {assessment.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md">
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
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>(0.2);
  const athletesCount = useCountUp(1248, 1500, statsInView);
  const highPotential = useCountUp(86, 1500, statsInView);
  const districtsCount = useCountUp(24, 1500, statsInView);
  const trialsCount = useCountUp(3492, 1500, statsInView);

  return (
    <div className="bg-mesh">
      {/* Hero */}
      <section className="section-padding pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="animate-fade-in-up">
            <div className="badge bg-royal-50 text-royal-700 mb-5">
              <Trophy className="w-4 h-4" />
              AI-Powered Grassroots Sports
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 leading-[1.1] mb-5">
              Discover India's Next{' '}
              <span className="text-gradient-blue">Sports Stars.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              Turn an ordinary smartphone into an AI-powered sports assessment tool.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => onNavigate('register')} className="btn-primary text-base">
                <Smartphone className="w-5 h-5" />
                Start Assessment
              </button>
              <button onClick={() => onNavigate('dashboard')} className="btn-secondary text-base">
                <BarChart3 className="w-5 h-5" />
                View Dashboard
              </button>
            </div>
          </div>
          <div className="animate-fade-in-up animate-delay-200">
            <AthleteViz />
          </div>
        </div>
      </section>

      {/* Impact Strip */}
      <section className="section-padding pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {IMPACT_STATS.map((stat, i) => (
            <ImpactStatCard
              key={stat.label}
              stat={stat}
              delay={['', 'animate-delay-100', 'animate-delay-200', 'animate-delay-300'][i]}
            />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
            From Village Trial to Scout
          </h2>
          <p className="text-slate-500">Five simple steps from recording to discovery</p>
        </div>
        <div className="card p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-2">
            {STEPS.map((step, i) => (
              <StepCard key={step.num} step={step} isLast={i === STEPS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Sports Assessment */}
      <section className="section-padding py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
            Sports Assessments
          </h2>
          <p className="text-slate-500">Choose what to measure — all from a single smartphone</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {ASSESSMENT_TYPES.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Scout Dashboard Preview */}
      <section ref={statsRef} className="section-padding py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
            Built for Scouts
          </h2>
          <p className="text-slate-500">Real-time visibility into grassroots talent across India</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: athletesCount, label: 'Athletes Assessed', icon: Users, color: 'text-royal-600', bg: 'bg-royal-50' },
            { value: highPotential, label: 'High Potential', icon: Trophy, color: 'text-green-600', bg: 'bg-green-50' },
            { value: districtsCount, label: 'Districts Covered', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
            { value: trialsCount, label: 'Trials Completed', icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`card card-hover p-6 animate-fade-in-up ${['', 'animate-delay-100', 'animate-delay-200', 'animate-delay-300'][i]}`}>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-navy-900">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => onNavigate('dashboard')} className="btn-primary">
            Explore Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
