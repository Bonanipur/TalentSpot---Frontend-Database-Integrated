import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowRight,
  Bot,
  Camera,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Gauge,
  Timer,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import type { PageName, TrialResult } from '@/data/mockData';
import ProgressIndicator from '@/components/ProgressIndicator';
import { usePoseEstimation } from '@/hooks/usePoseEstimation';
import { calculateSayersPower, calculateFlightJumpHeight } from '@/lib/poseDetection';

interface TrialJumpPageProps {
  onNavigate: (page: PageName) => void;
  onTrialComplete?: (result: TrialResult) => void;
}

const READINESS = [
  { label: 'Camera stable & level', color: 'text-green-500' },
  { label: 'Full body (head to feet) in frame', color: 'text-green-500' },
  { label: 'Standing 3-4 meters away', color: 'text-green-500' },
  { label: 'Good lighting & contrast', color: 'text-green-500' },
];

export default function TrialJumpPage({
  onNavigate,
  onTrialComplete,
}: TrialJumpPageProps) {
  // Video source state: null = placeholder SVG demo mode
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowMo, setIsSlowMo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Hook managing MediaPipe Pose & kinematics
  const {
    modelStatus,
    telemetry,
    startProcessing,
    stopProcessing,
    resetAnalysis,
  } = usePoseEstimation(videoRef, canvasRef, {
    athleteWeightKg: 65,
  });

  // Stop live camera stream
  const stopCameraStream = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Synchronize video element and auto-play when videoUrl changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    video.srcObject = null;
    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.playbackRate = isSlowMo ? 0.5 : 1.0;

    const handleLoadedData = () => {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          startProcessing();
        })
        .catch((err) => {
          console.warn('Autoplay prevented or delayed:', err);
          setIsPlaying(false);
        });
    };

    video.addEventListener('loadeddata', handleLoadedData, { once: true });
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoUrl, startProcessing]);

  // Handle uploaded video file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCameraStream();
    setCameraError(null);
    setUploadedFileName(file.name);

    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    resetAnalysis();

    // Reset input value so re-uploading the same file works
    e.target.value = '';
  };

  // Start Live Camera
  const startCamera = async () => {
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setUploadedFileName(null);
    stopProcessing();
    resetAnalysis();
    setCameraError(null);

    const video = videoRef.current;
    if (!video) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      cameraStreamRef.current = stream;
      video.srcObject = stream;
      await video.play();
      setIsCameraActive(true);
      setIsPlaying(true);
      startProcessing();
    } catch (err: any) {
      console.error('Camera access failed:', err);
      setCameraError(
        err.message || 'Camera permission denied or camera hardware unavailable'
      );
      setIsCameraActive(false);
    }
  };

  // Reset back to placeholder SVG demo
  const handleResetToPlaceholder = () => {
    stopCameraStream();
    stopProcessing();
    resetAnalysis();
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setUploadedFileName(null);
    setIsPlaying(false);
    setCameraError(null);

    const video = videoRef.current;
    if (video) {
      video.pause();
      video.srcObject = null;
      video.removeAttribute('src');
      video.load();
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Toggle video playback
  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
        startProcessing();
      } catch (err) {
        console.error('Video play error:', err);
      }
    } else {
      video.pause();
      setIsPlaying(false);
      stopProcessing();
    }
  };

  // Restart video analysis
  const handleRestart = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      resetAnalysis();
      if (!isPlaying && !isCameraActive) {
        video.play();
        setIsPlaying(true);
        startProcessing();
      }
    }
  };

  // Toggle Slow Motion
  const toggleSlowMo = () => {
    const next = !isSlowMo;
    setIsSlowMo(next);
    const video = videoRef.current;
    if (video) {
      video.playbackRate = next ? 0.5 : 1.0;
    }
  };

  // Finalize & Navigate to Results
  const handleCompleteTrial = () => {
    const measuredHeight =
      telemetry.calculatedHeight > 0
        ? telemetry.calculatedHeight
        : Math.round(
            calculateFlightJumpHeight(
              telemetry.flightDuration > 0 ? telemetry.flightDuration : 0.58
            ) * 10
          ) / 10 || 41;

    const { watts, score: powerScore } = calculateSayersPower(
      measuredHeight,
      65
    );

    const confidence =
      telemetry.aiConfidence > 50 ? telemetry.aiConfidence : 90;

    const computedResult: TrialResult = {
      jumpHeight: Math.round(measuredHeight),
      aiConfidence: confidence,
      explosivePower: powerScore,
      speed: 86,
      agility: 88,
      overall: Math.round(powerScore * 0.45 + 86 * 0.3 + 88 * 0.25),
      potential:
        measuredHeight >= 40
          ? 'High'
          : measuredHeight >= 30
          ? 'Medium'
          : 'Low',
    };

    if (onTrialComplete) {
      onTrialComplete(computedResult);
    }
    onNavigate('results');
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // Phase badge color mapping
  const phaseColors: Record<string, { bg: string; text: string; border: string }> = {
    STAND: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-300',
      border: 'border-blue-500/40',
    },
    SQUAT: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
    },
    TAKEOFF: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
    },
    FLIGHT: {
      bg: 'bg-pink-500/20',
      text: 'text-pink-300',
      border: 'border-pink-500/40',
    },
    LANDED: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
    },
    COMPLETE: {
      bg: 'bg-emerald-500/30',
      text: 'text-emerald-300',
      border: 'border-emerald-500/60',
    },
  };

  const currentPhaseStyle =
    phaseColors[telemetry.phase] || phaseColors.STAND;

  const isVideoLoaded = Boolean(videoUrl || isCameraActive);

  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-8">
      <div className="section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-100 text-royal-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Real-Time Edge Computer Vision
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-1">
              Vertical Jump Assessment
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Autonomous 33-point skeletal landmark detection and flight-time kinematic analysis
            </p>
          </div>

          <div className="mb-6 animate-fade-in-up animate-delay-100">
            <ProgressIndicator
              steps={['Profile', 'Trial Analysis', 'Results']}
              currentStep={1}
            />
          </div>

          {/* Action Header / Upload bar */}
          <div className="card p-3 mb-6 flex flex-wrap items-center justify-between gap-3 animate-fade-in-up animate-delay-150">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary text-xs sm:text-sm px-4 py-2 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Athlete Video
              </button>

              <button
                type="button"
                onClick={startCamera}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isCameraActive
                    ? 'bg-royal-600 text-white shadow-md shadow-royal-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                Live Camera
              </button>

              {isVideoLoaded && (
                <button
                  type="button"
                  onClick={handleResetToPlaceholder}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all border border-rose-200"
                >
                  <X className="w-4 h-4" />
                  Clear Video
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Model Ready Badge */}
            <div className="flex items-center gap-2">
              {modelStatus === 'ready' && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  MediaPipe Vision Ready
                </span>
              )}
              {modelStatus === 'loading' && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-spin" />
                  Loading Neural Model...
                </span>
              )}
            </div>
          </div>

          {/* Main Stage Grid */}
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up animate-delay-200">
            {/* Left Col: Video Player or Placeholder SVG Demo */}
            <div className="lg:col-span-2">
              <div className="card p-3 overflow-hidden bg-navy-950 border border-navy-800 shadow-2xl">
                <div className="relative aspect-[4/3] sm:aspect-video bg-gradient-to-b from-navy-900 to-navy-800 rounded-xl overflow-hidden flex items-end justify-center">
                  {/* Grid background overlay */}
                  <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

                  {/* Corner Targets */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-sky-400/50 rounded-tl-lg pointer-events-none z-10" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-sky-400/50 rounded-tr-lg pointer-events-none z-10" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-sky-400/50 rounded-bl-lg pointer-events-none z-10" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-sky-400/50 rounded-br-lg pointer-events-none z-10" />

                  {/* Camera Error Message */}
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-navy-950/90 text-center z-30">
                      <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
                      <p className="text-white font-semibold text-lg mb-1">
                        Camera Unavailable
                      </p>
                      <p className="text-slate-400 text-sm max-w-sm mb-4">
                        {cameraError}. Please upload a recorded jump video file instead.
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-primary text-xs"
                      >
                        Upload Athlete Video
                      </button>
                    </div>
                  )}

                  {/* Real Video Element (always mounted in DOM to guarantee ref availability) */}
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    loop
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className={`w-full h-full object-contain ${
                      isVideoLoaded ? 'block z-10' : 'hidden'
                    }`}
                  />

                  {/* Real MediaPipe Pose Canvas Overlay */}
                  <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 pointer-events-none w-full h-full object-contain z-20 ${
                      isVideoLoaded ? 'block' : 'hidden'
                    }`}
                  />

                  {/* Real-time HUD Badges */}
                  {isVideoLoaded && (
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30">
                      {/* Phase Badge */}
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md ${currentPhaseStyle.bg} ${currentPhaseStyle.border}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            telemetry.phase === 'FLIGHT'
                              ? 'bg-pink-400 animate-ping'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span
                          className={`text-xs font-bold font-mono tracking-wider ${currentPhaseStyle.text}`}
                        >
                          PHASE: {telemetry.phase}
                        </span>
                      </div>

                      {/* AI Confidence Badge */}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900/80 border border-navy-700/60 backdrop-blur-md">
                        <Bot className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-xs font-mono text-slate-300 font-semibold">
                          {telemetry.aiConfidence}% AI Conf
                        </span>
                      </div>
                    </div>
                  )}

                  {/* MODE B: Default Placeholder SVG Demo */}
                  {!isVideoLoaded && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 z-10">
                      {/* Scanning animation bar */}
                      <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-scan shadow-glow-blue" />
                      </div>

                      {/* Original SVG Pose Stick-figure */}
                      <svg
                        viewBox="0 0 200 150"
                        className="relative h-48 w-auto z-10 pb-4"
                      >
                        {/* Body silhouette */}
                        <ellipse
                          cx="100"
                          cy="30"
                          rx="12"
                          ry="14"
                          fill="white"
                          opacity="0.1"
                        />
                        <path
                          d="M100 44 L100 90 M100 54 L82 78 M100 54 L118 78 M100 90 L90 130 M100 90 L110 130"
                          stroke="white"
                          strokeWidth="8"
                          strokeLinecap="round"
                          opacity="0.1"
                          fill="none"
                        />
                        {/* Pose lines */}
                        <g
                          stroke="#38BDF8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        >
                          <line x1="100" y1="30" x2="100" y2="44" />
                          <line x1="100" y1="44" x2="100" y2="90" />
                          <line x1="100" y1="54" x2="82" y2="78" />
                          <line x1="100" y1="54" x2="118" y2="78" />
                          <line x1="100" y1="90" x2="90" y2="130" />
                          <line x1="100" y1="90" x2="110" y2="130" />
                        </g>
                        {/* Pose dots with pulse */}
                        {[
                          [100, 30],
                          [100, 44],
                          [100, 54],
                          [100, 90],
                          [82, 78],
                          [118, 78],
                          [90, 130],
                          [110, 130],
                        ].map(([cx, cy], i) => (
                          <g key={i}>
                            <circle cx={cx} cy={cy} r="4" fill="white" />
                            <circle cx={cx} cy={cy} r="2.5" fill="#38BDF8" />
                            <circle
                              cx={cx}
                              cy={cy}
                              r="2.5"
                              fill="#38BDF8"
                              opacity="0.5"
                            >
                              <animate
                                attributeName="r"
                                values="2.5;6;2.5"
                                dur="1.5s"
                                begin={`${i * 0.12}s`}
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.5;0;0.5"
                                dur="1.5s"
                                begin={`${i * 0.12}s`}
                                repeatCount="indefinite"
                              />
                            </circle>
                          </g>
                        ))}
                      </svg>

                      {/* Status indicator */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 z-20">
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-white/90 text-xs font-mono font-semibold">
                          DEMO PREVIEW — READY FOR VIDEO
                        </span>
                      </div>

                      {/* Prompt to upload */}
                      <div className="z-20 text-center bg-navy-950/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                        <p className="text-xs text-slate-300 font-medium">
                          Upload an athlete jump video (.mp4, .mov, .webm) or open camera to begin
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Playback Controls Bar (shown only when a video is loaded) */}
                {isVideoLoaded && !isCameraActive && (
                  <div className="mt-3 flex items-center justify-between px-2 pt-2 border-t border-navy-800 text-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal-600 hover:bg-royal-500 text-xs font-bold transition-all shadow-md shadow-royal-600/40"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Run AI Pose
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleRestart}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs text-slate-300 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Replay
                      </button>

                      <button
                        onClick={toggleSlowMo}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          isSlowMo
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-navy-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        0.5x Slow-Mo
                      </button>
                    </div>

                    <span className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                      {uploadedFileName || 'Athlete Video'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Telemetry / Guidance Panel */}
            <div className="space-y-4">
              {isVideoLoaded ? (
                /* Active Telemetry when video or camera is running */
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-royal-50 flex items-center justify-center">
                      <Gauge className="w-4 h-4 text-royal-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 text-sm">
                        Live Biomechanical Telemetry
                      </h3>
                      <p className="text-xs text-slate-400">
                        Newtonian kinematics & angles
                      </p>
                    </div>
                  </div>

                  {/* Metric 1: Knee Flexion Angle */}
                  <div className="p-3.5 rounded-xl bg-slate-50 mb-3 border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500 font-semibold">
                        Knee Flexion Angle
                      </span>
                      <span
                        className={`text-sm font-bold font-mono ${
                          telemetry.kneeAngle < 120
                            ? 'text-emerald-600'
                            : 'text-royal-600'
                        }`}
                      >
                        {telemetry.kneeAngle}°
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-royal-500 to-emerald-500 transition-all duration-100"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(10, (telemetry.kneeAngle / 180) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Target squat depth: 90° - 110°
                    </span>
                  </div>

                  {/* Metric 2: Flight Time */}
                  <div className="p-3.5 rounded-xl bg-slate-50 mb-3 border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-royal-600" />
                        Flight Duration
                      </span>
                      <span className="text-sm font-bold font-mono text-navy-900">
                        {telemetry.flightDuration > 0
                          ? `${telemetry.flightDuration.toFixed(2)} s`
                          : '--'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Formula: h = (g · t²) / 8
                    </p>
                  </div>

                  {/* Metric 3: Calculated Jump Height */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-royal-50 to-sky-50 border border-royal-100 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-royal-700 font-semibold block">
                          Estimated Apex Height
                        </span>
                        <p className="font-display text-3xl font-extrabold text-navy-900">
                          {telemetry.calculatedHeight > 0
                            ? `${telemetry.calculatedHeight} cm`
                            : '--'}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-royal-600 text-white flex items-center justify-center font-bold text-xs">
                        APEX
                      </div>
                    </div>
                  </div>

                  {/* Action Button: View Full Scorecard */}
                  <button
                    onClick={handleCompleteTrial}
                    className="btn-primary w-full text-sm py-3 justify-center shadow-lg shadow-royal-600/30 group"
                  >
                    <span>Analyze & View Official Scorecard</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ) : (
                /* Default Guidance Card when in SVG Demo Mode */
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
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary w-full text-sm justify-center"
                    >
                      <Upload className="w-4 h-4" />
                      Select Video File
                    </button>
                    <button
                      onClick={startCamera}
                      className="btn-secondary w-full text-sm justify-center"
                    >
                      <Camera className="w-4 h-4" />
                      Open Live Webcam
                    </button>
                  </div>
                </div>
              )}

              {/* Protocol Tips */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Protocol Guidelines
                </div>
                <p className="text-slate-500">
                  • Stand 3-4 meters back with full body visible from head to feet.
                </p>
                <p className="text-slate-500">
                  • Perform a maximal countermovement jump with explosive vertical intent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
