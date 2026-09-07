import { useState, useEffect, useRef, useCallback } from 'react';
import { PoseLandmarker } from '@mediapipe/tasks-vision';
import {
  getPoseLandmarker,
  calculateJointAngle,
  calculateFlightJumpHeight,
  calculateSayersPower,
  calculateLandmarkConfidence,
  drawPoseOnCanvas,
  JumpTelemetry,
  JumpPhase,
} from '../lib/poseDetection';

export interface UsePoseEstimationOptions {
  athleteWeightKg?: number;
  onJumpComplete?: (result: {
    jumpHeight: number;
    flightTime: number;
    aiConfidence: number;
    powerWatts: number;
    explosiveScore: number;
  }) => void;
}

export function usePoseEstimation(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: UsePoseEstimationOptions = {}
) {
  const { athleteWeightKg = 65, onJumpComplete } = options;

  const [modelStatus, setModelStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');
  const [modelError, setModelError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Jump Telemetry State
  const [telemetry, setTelemetry] = useState<JumpTelemetry>({
    phase: 'STAND',
    kneeAngle: 172,
    takeoffTime: null,
    landingTime: null,
    flightDuration: 0,
    calculatedHeight: 0,
    peakDisplacement: 0,
    apexY: null,
    aiConfidence: 88,
    powerWatts: 2850,
    explosiveScore: 89,
  });

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  // Internal kinematic tracking refs to avoid render lag
  const baselineAnkleYRef = useRef<number | null>(null);
  const baselineHipYRef = useRef<number | null>(null);
  const minHipYRef = useRef<number>(9999);
  const phaseRef = useRef<JumpPhase>('STAND');
  const takeoffTimeRef = useRef<number | null>(null);
  const landingTimeRef = useRef<number | null>(null);
  const confidenceSumRef = useRef<number>(0);
  const confidenceFramesRef = useRef<number>(0);

  // 1. Initialize MediaPipe PoseLandmarker
  useEffect(() => {
    let isMounted = true;
    setModelStatus('loading');

    getPoseLandmarker()
      .then((landmarker) => {
        if (isMounted) {
          poseLandmarkerRef.current = landmarker;
          setModelStatus('ready');
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Pose model loading error:', err);
          setModelError(err.message || 'Failed to load pose model');
          setModelStatus('error');
        }
      });

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // 2. Reset jump state for new trial
  const resetAnalysis = useCallback(() => {
    baselineAnkleYRef.current = null;
    baselineHipYRef.current = null;
    minHipYRef.current = 9999;
    phaseRef.current = 'STAND';
    takeoffTimeRef.current = null;
    landingTimeRef.current = null;
    confidenceSumRef.current = 0;
    confidenceFramesRef.current = 0;

    setTelemetry({
      phase: 'STAND',
      kneeAngle: 175,
      takeoffTime: null,
      landingTime: null,
      flightDuration: 0,
      calculatedHeight: 0,
      peakDisplacement: 0,
      apexY: null,
      aiConfidence: 88,
      powerWatts: 2850,
      explosiveScore: 89,
    });
  }, []);

  // 3. Process each frame
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = poseLandmarkerRef.current;

    if (!video || !canvas || video.paused || video.ended) {
      if (isAnalyzing) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas matches video display dimensions
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    }

    const currentTime = video.currentTime;

    // Only run MediaPipe if a new frame is presented
    if (currentTime !== lastVideoTimeRef.current && landmarker) {
      lastVideoTimeRef.current = currentTime;

      try {
        const startTimeMs = performance.now();
        const results = landmarker.detectForVideo(video, startTimeMs);

        if (results && results.landmarks && results.landmarks[0]) {
          const landmarks = results.landmarks[0];

          // Compute confidence
          const frameConf = calculateLandmarkConfidence(landmarks);
          confidenceSumRef.current += frameConf;
          confidenceFramesRef.current += 1;
          const avgConfidence = Math.round(
            confidenceSumRef.current / confidenceFramesRef.current
          );

          // Key landmarks
          // Left: Hip=23, Knee=25, Ankle=27
          // Right: Hip=24, Knee=26, Ankle=28
          const leftHip = landmarks[23];
          const leftKnee = landmarks[25];
          const leftAnkle = landmarks[27];
          const rightHip = landmarks[24];
          const rightKnee = landmarks[26];
          const rightAnkle = landmarks[28];

          // Knee Flexion Angle (in degrees)
          let kneeAngle = 175;
          if (leftHip && leftKnee && leftAnkle) {
            kneeAngle = calculateJointAngle(leftHip, leftKnee, leftAnkle);
          } else if (rightHip && rightKnee && rightAnkle) {
            kneeAngle = calculateJointAngle(rightHip, rightKnee, rightAnkle);
          }

          // Ankle & Hip positions (normalized Y: 0 at top, 1 at bottom)
          const midAnkleY =
            leftAnkle && rightAnkle
              ? (leftAnkle.y + rightAnkle.y) / 2
              : leftAnkle?.y ?? rightAnkle?.y ?? 0.85;

          const midHipY =
            leftHip && rightHip
              ? (leftHip.y + rightHip.y) / 2
              : leftHip?.y ?? rightHip?.y ?? 0.55;

          // Draw landmarks on canvas
          drawPoseOnCanvas(ctx, landmarks, canvas.width, canvas.height, kneeAngle);

          // Kinematic State Machine
          const currentPhase = phaseRef.current;

          // Phase 1: STANDING (Calibration)
          if (currentPhase === 'STAND') {
            if (
              baselineAnkleYRef.current === null ||
              midAnkleY > baselineAnkleYRef.current
            ) {
              baselineAnkleYRef.current = midAnkleY;
            }
            if (
              baselineHipYRef.current === null ||
              midHipY > baselineHipYRef.current
            ) {
              baselineHipYRef.current = midHipY;
            }

            // Squat initiation: knee bends below 140° or hip descends
            if (kneeAngle < 140 && baselineHipYRef.current !== null) {
              phaseRef.current = 'SQUAT';
            }
          }
          // Phase 2: SQUAT (Preparation)
          else if (currentPhase === 'SQUAT') {
            // Check for Takeoff: ankles lift above baseline by at least 2.5% of height
            const baseline = baselineAnkleYRef.current ?? 0.85;
            if (baseline - midAnkleY > 0.025) {
              phaseRef.current = 'FLIGHT';
              takeoffTimeRef.current = currentTime;
            }
          }
          // Phase 3: FLIGHT (In the air)
          else if (currentPhase === 'FLIGHT') {
            // Track highest elevation (minimum Y)
            if (midHipY < minHipYRef.current) {
              minHipYRef.current = midHipY;
            }

            // Check for Landing: ankles return near baseline
            const baseline = baselineAnkleYRef.current ?? 0.85;
            if (
              takeoffTimeRef.current !== null &&
              currentTime - takeoffTimeRef.current > 0.15 &&
              midAnkleY >= baseline - 0.015
            ) {
              phaseRef.current = 'LANDED';
              landingTimeRef.current = currentTime;

              const flightDuration = Math.max(
                0.2,
                landingTimeRef.current - takeoffTimeRef.current
              );
              const heightCm = calculateFlightJumpHeight(flightDuration);
              const { watts, score } = calculateSayersPower(
                heightCm,
                athleteWeightKg
              );

              setTelemetry({
                phase: 'COMPLETE',
                kneeAngle,
                takeoffTime: takeoffTimeRef.current,
                landingTime: landingTimeRef.current,
                flightDuration: Math.round(flightDuration * 100) / 100,
                calculatedHeight: heightCm,
                peakDisplacement: heightCm,
                apexY: minHipYRef.current,
                aiConfidence: avgConfidence,
                powerWatts: watts,
                explosiveScore: score,
              });

              if (onJumpComplete) {
                onJumpComplete({
                  jumpHeight: heightCm,
                  flightTime: flightDuration,
                  aiConfidence: avgConfidence,
                  powerWatts: watts,
                  explosiveScore: score,
                });
              }
              return;
            }
          }

          // Update real-time telemetry display
          setTelemetry((prev) => ({
            ...prev,
            phase: phaseRef.current,
            kneeAngle,
            aiConfidence: avgConfidence,
            flightDuration:
              phaseRef.current === 'FLIGHT' && takeoffTimeRef.current !== null
                ? Math.round((currentTime - takeoffTimeRef.current) * 100) / 100
                : prev.flightDuration,
          }));
        } else {
          // Clear canvas if no person in frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      } catch (err) {
        console.warn('Frame detection warning:', err);
      }
    }

    if (isAnalyzing) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
    }
  }, [isAnalyzing, athleteWeightKg, onJumpComplete, videoRef, canvasRef]);

  // 4. Start & Stop Processing loop
  const startProcessing = useCallback(() => {
    setIsAnalyzing(true);
  }, []);

  const stopProcessing = useCallback(() => {
    setIsAnalyzing(false);
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
    } else {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    }
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isAnalyzing, processFrame]);

  return {
    modelStatus,
    modelError,
    isAnalyzing,
    telemetry,
    startProcessing,
    stopProcessing,
    resetAnalysis,
  };
}
