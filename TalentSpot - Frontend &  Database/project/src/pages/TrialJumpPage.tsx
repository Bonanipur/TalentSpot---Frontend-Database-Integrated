import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Bot, Camera, Video } from 'lucide-react';
import type { PageName } from '@/data/mockData';
import ProgressIndicator from '@/components/ProgressIndicator';

interface TrialJumpPageProps {
  onNavigate: (page: PageName) => void;
}

const READINESS = [
  { label: 'Athlete detected', color: 'text-green-500' },
  { label: 'Full body visible', color: 'text-green-500' },
  { label: 'Camera stable', color: 'text-green-500' },
  { label: 'Lighting good', color: 'text-green-500' },
];

const PROCESSING_STEPS = [
  'Detecting body pose...',
  'Extracting keypoints...',
  'Measuring jump height...',
  'Calculating explosive power...',
  'Comparing with benchmarks...',
];

export default function TrialJumpPage({ onNavigate }: TrialJumpPageProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!analyzing) return;
    const stepInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= PROCESSING_STEPS.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    const percentInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(percentInterval);
          clearInterval(stepInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timeout = setTimeout(() => {
      onNavigate('results');
    }, 2800);

    return () => {
      clearInterval(stepInterval);
      clearInterval(percentInterval);
      clearTimeout(timeout);
    };
  }, [analyzing, onNavigate]);

  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-10">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
              Vertical Jump Assessment
            </h1>
            <p className="text-slate-500 text-lg">AI-powered explosive power measurement</p>
          </div>

          <div className="mb-8 animate-fade-in-up animate-delay-100">
            <ProgressIndicator steps={['Profile', 'Trial', 'Results']} currentStep={1} />
          </div>

          {/* Instruction card */}
          <div className="card p-6 mb-6 animate-fade-in-up animate-delay-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-royal-50 flex items-center justify-center">
                <Camera className="w-4 h-4 text-royal-600" />
              </div>
              <h3 className="font-bold text-navy-900">How to Record</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Place your phone steadily.',
                'Keep your full body visible.',
                'Stand about 3-4 meters from the camera.',
                'Perform one vertical jump.',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-royal-100 text-royal-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Camera + AI readiness */}
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up animate-delay-300">
            {/* Camera preview */}
            <div className="lg:col-span-2">
              <div className="card p-2 overflow-hidden">
                <div className="relative aspect-video bg-gradient-to-b from-navy-900 to-navy-800 rounded-2xl overflow-hidden flex items-end justify-center">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-grid opacity-20" />

                  {/* Scanning effect */}
                  {analyzing && (
                    <div className="absolute inset-0 z-20">
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-scan shadow-glow-blue" />
                    </div>
                  )}

                  {/* Pose visualization */}
                  <svg viewBox="0 0 200 150" className="relative h-full w-auto z-10 pb-4">
                    {/* Body silhouette */}
                    <ellipse cx="100" cy="30" rx="12" ry="14" fill="white" opacity="0.1" />
                    <path
                      d="M100 44 L100 90 M100 54 L82 78 M100 54 L118 78 M100 90 L90 130 M100 90 L110 130"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      opacity="0.1"
                      fill="none"
                    />
                    {/* Pose lines */}
                    <g stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none">
                      <line x1="100" y1="30" x2="100" y2="44" />
                      <line x1="100" y1="44" x2="100" y2="90" />
                      <line x1="100" y1="54" x2="82" y2="78" />
                      <line x1="100" y1="54" x2="118" y2="78" />
                      <line x1="100" y1="90" x2="90" y2="130" />
                      <line x1="100" y1="90" x2="110" y2="130" />
                    </g>
                    {/* Pose dots */}
                    {[[100,30],[100,44],[100,54],[100,90],[82,78],[118,78],[90,130],[110,130]].map(([cx,cy], i) => (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="4" fill="white" />
                        <circle cx={cx} cy={cy} r="2.5" fill="#38BDF8" />
                        {analyzing && (
                          <circle cx={cx} cy={cy} r="2.5" fill="#38BDF8" opacity="0.5">
                            <animate attributeName="r" values="2.5;6;2.5" dur="1.5s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                          </circle>
                        )}
                      </g>
                    ))}
                  </svg>

                  {/* Corner brackets */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-sky-400/50 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-sky-400/50 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-sky-400/50 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-sky-400/50 rounded-br-lg" />

                  {/* Status badge */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <div className={`w-2 h-2 rounded-full ${analyzing ? 'bg-sky-400 animate-pulse' : 'bg-green-400'}`} />
                    <span className="text-white/90 text-xs font-semibold">
                      {analyzing ? 'AI ANALYZING' : 'CAMERA PREVIEW'}
                    </span>
                  </div>

                  {/* Processing overlay */}
                  {analyzing && (
                    <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-fade-in">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-full border-4 border-sky-400/20" />
                        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-sky-400 animate-spin" />
                        <Bot className="absolute inset-0 m-auto w-7 h-7 text-sky-400" />
                      </div>
                      <p className="text-white font-semibold text-sm mb-1">
                        AI is analyzing your movement...
                      </p>
                      <p className="text-sky-400 text-xs font-mono mb-3">
                        {PROCESSING_STEPS[progressStep]}
                      </p>
                      <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-royal-500 rounded-full transition-all duration-100"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-white/60 text-xs mt-1.5">{progressPercent}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Readiness */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-bold text-navy-900">AI Readiness</h3>
              </div>
              <div className="space-y-3 mb-6">
                {READINESS.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full bg-green-500 ${!analyzing ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-3">Demo Mode — simulated analysis</p>
                <button
                  onClick={() => setAnalyzing(true)}
                  disabled={analyzing}
                  className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Bot className="w-4 h-4" />
                  Analyze Trial
                </button>
              </div>
            </div>
          </div>

          {!analyzing && (
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400 animate-fade-in-up animate-delay-500">
              <Video className="w-4 h-4" />
              <span>Ready to analyze — click the button to start</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
