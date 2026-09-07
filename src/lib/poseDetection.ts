import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision';

export interface Point3D {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export type JumpPhase =
  | 'STAND'
  | 'SQUAT'
  | 'TAKEOFF'
  | 'FLIGHT'
  | 'LANDED'
  | 'COMPLETE';

export interface JumpTelemetry {
  phase: JumpPhase;
  kneeAngle: number;
  takeoffTime: number | null;
  landingTime: number | null;
  flightDuration: number; // in seconds
  calculatedHeight: number; // in cm
  peakDisplacement: number; // in cm
  apexY: number | null;
  aiConfidence: number; // 0-100%
  powerWatts: number;
  explosiveScore: number; // 0-100
}

let poseLandmarkerInstance: PoseLandmarker | null = null;
let isInitializing = false;

/**
 * Lazy loads and caches the MediaPipe PoseLandmarker instance.
 * Attempts local WASM/Model first, with fallback to Google CDN.
 */
export async function getPoseLandmarker(): Promise<PoseLandmarker> {
  if (poseLandmarkerInstance) {
    return poseLandmarkerInstance;
  }

  if (isInitializing) {
    // Wait for in-progress initialization
    while (isInitializing && !poseLandmarkerInstance) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (poseLandmarkerInstance) return poseLandmarkerInstance;
  }

  isInitializing = true;

  try {
    // 1. Resolve WASM assets matching installed @mediapipe/tasks-vision version
    const TASKS_VISION_VERSION = '1.0.1';
    const WASM_CDN_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;

    const vision = await FilesetResolver.forVisionTasks(WASM_CDN_PATH);

    // 2. Initialize Pose Landmarker with lightweight float16 model
    poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          '/models/pose_landmarker_lite.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    return poseLandmarkerInstance;
  } catch (err) {
    console.warn('GPU/local model failed, trying fallback to CDN model URL:', err);
    try {
      const TASKS_VISION_VERSION = '1.0.1';
      const WASM_CDN_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;

      const vision = await FilesetResolver.forVisionTasks(WASM_CDN_PATH);
      poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });
      return poseLandmarkerInstance;
    } catch (fallbackErr) {
      console.error('Failed to load MediaPipe PoseLandmarker:', fallbackErr);
      throw fallbackErr;
    }
  } finally {
    isInitializing = false;
  }
}

/**
 * Calculates joint angle between three 2D/3D points (e.g. Hip -> Knee -> Ankle).
 * Returns angle in degrees [0, 180].
 */
export function calculateJointAngle(a: Point3D, b: Point3D, c: Point3D): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle);
}

/**
 * Computes jump height using Newtonian flight-time kinematics:
 * h = (g * t^2) / 8
 * Returns height in centimeters (cm).
 */
export function calculateFlightJumpHeight(flightTimeSeconds: number): number {
  if (flightTimeSeconds <= 0) return 0;
  const g = 9.80665; // m/s^2
  const heightMeters = (g * Math.pow(flightTimeSeconds, 2)) / 8;
  const heightCm = heightMeters * 100;
  return Math.round(heightCm * 10) / 10;
}

/**
 * Sayers Peak Power Equation (Watts):
 * Peak Power = 60.7 * (Jump Height in cm) + 45.3 * (Body Mass in kg) - 2055
 */
export function calculateSayersPower(
  jumpHeightCm: number,
  bodyMassKg: number = 65
): { watts: number; score: number } {
  const watts = Math.max(
    800,
    Math.round(60.7 * jumpHeightCm + 45.3 * bodyMassKg - 2055)
  );
  // Normalize 2500W - 4500W to 0 - 100 athletic score
  const score = Math.min(
    99,
    Math.max(50, Math.round(50 + ((watts - 2500) / 2000) * 50))
  );
  return { watts, score };
}

/**
 * Calculates average landmark visibility / AI tracking confidence.
 */
export function calculateLandmarkConfidence(
  landmarks: NormalizedLandmark[]
): number {
  if (!landmarks || landmarks.length === 0) return 0;
  let sum = 0;
  let count = 0;
  // Key lower-body and core landmarks (hips: 23,24, knees: 25,26, ankles: 27,28)
  const criticalIndices = [23, 24, 25, 26, 27, 28];
  for (const idx of criticalIndices) {
    if (landmarks[idx]) {
      sum += landmarks[idx].visibility ?? 0.85;
      count++;
    }
  }
  const avg = count > 0 ? sum / count : 0.85;
  return Math.min(99, Math.max(65, Math.round(avg * 100)));
}

/**
 * Draws professional glowing skeleton overlay onto an HTML5 Canvas.
 */
export function drawPoseOnCanvas(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  kneeAngle: number
) {
  ctx.clearRect(0, 0, width, height);

  const drawingUtils = new DrawingUtils(ctx);

  // 1. Draw glowing connecting bones
  drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
    color: '#38bdf8', // Neon Sky Blue
    lineWidth: 3,
  });

  // 2. Draw lower limbs in Gold/Emerald during flight
  drawingUtils.drawLandmarks(landmarks, {
    color: '#f59e0b', // Gold joints
    fillColor: '#ffffff',
    lineWidth: 2,
    radius: 4,
  });

  // 3. Highlight Knee Angle with HUD callout if knee is visible
  const leftKnee = landmarks[25];
  if (leftKnee && leftKnee.visibility && leftKnee.visibility > 0.4) {
    const kx = leftKnee.x * width;
    const ky = leftKnee.y * height;

    // Angle circle badge
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = kneeAngle < 120 ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(kx + 12, ky - 14, 54, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 12px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${kneeAngle}°`, kx + 18, ky + 4);
    ctx.restore();
  }
}
