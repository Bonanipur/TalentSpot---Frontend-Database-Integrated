import { useCountUp, useInView } from '@/hooks/useAnimations';

export default function AthleteViz() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const jumpHeight = useCountUp(41, 1500, inView);
  const confidence = useCountUp(88, 1500, inView);

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-royal-500/20 via-purple-500/15 to-sky-500/20 rounded-[2.5rem] blur-2xl" />

      {/* Main card */}
      <div className="relative bg-white rounded-[2rem] shadow-card-hover border border-slate-100 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-navy-900 to-navy-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">AI POSE TRACKING</span>
          </div>
          <span className="text-sky-400 text-xs font-mono">LIVE</span>
        </div>

        {/* Visualization area */}
        <div className="relative h-80 bg-gradient-to-b from-slate-50 to-slate-100 flex items-end justify-center overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid opacity-50" />

          {/* Scanning line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-scan shadow-glow-blue" />

          {/* Athlete silhouette with pose dots */}
          <svg viewBox="0 0 200 280" className="relative h-full w-auto z-10">
            {/* Body silhouette */}
            <ellipse cx="100" cy="40" rx="20" ry="24" fill="#172554" opacity="0.08" />
            <path
              d="M100 64 L100 160 M100 80 L70 130 M100 80 L130 130 M100 160 L80 260 M100 160 L120 260"
              stroke="#172554"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.08"
              fill="none"
            />

            {/* Pose estimation lines */}
            <g stroke="url(#poseGradient)" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <line x1="100" y1="40" x2="100" y2="64" />
              <line x1="100" y1="64" x2="100" y2="160" />
              <line x1="100" y1="80" x2="70" y2="130" />
              <line x1="100" y1="80" x2="130" y2="130" />
              <line x1="70" y1="130" x2="65" y2="170" />
              <line x1="130" y1="130" x2="135" y2="170" />
              <line x1="100" y1="160" x2="85" y2="220" />
              <line x1="100" y1="160" x2="115" y2="220" />
              <line x1="85" y1="220" x2="80" y2="265" />
              <line x1="115" y1="220" x2="120" y2="265" />
            </g>

            {/* Pose dots */}
            {[
              [100, 40], [100, 64], [100, 80], [100, 160],
              [70, 130], [130, 130], [65, 170], [135, 170],
              [85, 220], [115, 220], [80, 265], [120, 265],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="6" fill="white" />
                <circle cx={cx} cy={cy} r="4" fill="#2563EB" />
                <circle cx={cx} cy={cy} r="4" fill="#38BDF8" opacity="0.5">
                  <animate attributeName="r" values="4;8;4" dur="2s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}

            <defs>
              <linearGradient id="poseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-royal-500/40 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-royal-500/40 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-royal-500/40 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-royal-500/40 rounded-br-lg" />
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -left-4 sm:-left-8 top-20 bg-white rounded-2xl shadow-card-hover border border-slate-100 px-4 py-3 animate-float">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-xs text-slate-500 font-medium">Jump Height</p>
            <p className="text-lg font-bold text-navy-900">{jumpHeight} cm</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 sm:-right-8 top-36 bg-white rounded-2xl shadow-card-hover border border-slate-100 px-4 py-3 animate-float-delayed">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <div>
            <p className="text-xs text-slate-500 font-medium">AI Confidence</p>
            <p className="text-lg font-bold text-green-600">{confidence}%</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 sm:-right-4 bottom-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-glow-purple px-4 py-3 animate-float">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <div>
            <p className="text-xs text-white/80 font-medium">Potential</p>
            <p className="text-lg font-bold text-white">High</p>
          </div>
        </div>
      </div>
    </div>
  );
}
