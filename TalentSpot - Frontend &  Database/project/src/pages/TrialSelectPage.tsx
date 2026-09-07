import { ArrowRight, Zap, Rocket, RefreshCw, Star, Sparkles } from 'lucide-react';
import type { PageName, AssessmentType } from '@/data/mockData';
import { ASSESSMENT_TYPES } from '@/data/mockData';
import ProgressIndicator from '@/components/ProgressIndicator';

interface TrialSelectPageProps {
  onNavigate: (page: PageName) => void;
  onSelectTrial: (type: AssessmentType) => void;
}

const ICONS: Record<string, typeof Zap> = {
  sprint: Zap,
  jump: Rocket,
  agility: RefreshCw,
};

export default function TrialSelectPage({ onNavigate, onSelectTrial }: TrialSelectPageProps) {
  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-10">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
              Choose Your Assessment
            </h1>
            <p className="text-slate-500 text-lg">Select a test to measure athletic performance.</p>
          </div>

          <div className="mb-10 animate-fade-in-up animate-delay-100">
            <ProgressIndicator steps={['Profile', 'Trial', 'Results']} currentStep={1} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ASSESSMENT_TYPES.map((assessment, i) => {
              const Icon = ICONS[assessment.id];
              return (
                <div
                  key={assessment.id}
                  className={`card card-hover p-6 cursor-pointer relative animate-fade-in-up ${
                    assessment.recommended ? 'ring-2 ring-purple-400 shadow-glow-purple' : ''
                  } ${['animate-delay-100', 'animate-delay-200', 'animate-delay-300'][i]}`}
                  onClick={() => {
                    onSelectTrial(assessment.id);
                    if (assessment.id === 'jump') {
                      onNavigate('trial-jump');
                    }
                  }}
                >
                  {assessment.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md whitespace-nowrap">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      Recommended for Demo
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl ${assessment.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${assessment.text}`} />
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg mb-1">{assessment.title}</h3>
                  <p className="text-sm text-slate-500 mb-5">{assessment.description}</p>
                  {assessment.recommended ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTrial(assessment.id);
                        onNavigate('trial-jump');
                      }}
                      className="btn-primary w-full text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      Start Vertical Jump Test
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className={`inline-flex items-center gap-1.5 text-sm font-semibold ${assessment.text} hover:gap-2.5 transition-all`}>
                      Select Test <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
