/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pose Detection Service
 * Handles pose landmark detection using MediaPipe
 */

import { PoseLandmarker, FilesetResolver, type NormalizedLandmark, MPMask } from "@mediapipe/tasks-vision";

import {
  type Landmark,
  MeasurementError,
  type ProgressCallback,
  type MeasurementConfig,
} from "./types";
import {
  MEDIAPIPE_MODELS,
  MEASUREMENT_ERROR_CODES,
  CRITICAL_LANDMARKS,
  CONFIDENCE_THRESHOLDS,
} from "./config";
import { validateLandmarks, preprocessImage } from "./utils";

declare class PoseLandmarkerResult {
  /**
   * Pose landmarks of detected poses.
   * @export
   */
  readonly landmarks: NormalizedLandmark[][];
  /**
   * Pose landmarks in world coordinates of detected poses.
   * @export
   */
  readonly worldLandmarks: Landmark[][];
  /**
   * Segmentation mask for the detected pose.
   * @export
   */
  readonly segmentationMasks?: MPMask[] | undefined;
  constructor(
    /**
     * Pose landmarks of detected poses.
     * @export
     */
    landmarks: NormalizedLandmark[][],
    /**
     * Pose landmarks in world coordinates of detected poses.
     * @export
     */
    worldLandmarks: Landmark[][],
    /**
     * Segmentation mask for the detected pose.
     * @export
     */
    segmentationMasks?: MPMask[] | undefined
  );
  /**
   * Frees the resources held by the segmentation masks.
   * @export
   */
  close(): void;
}

export class PoseDetectorService {
  private poseLandmarker: PoseLandmarker | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * Initialize the pose detection service
   */
  async initialize(
    config: MeasurementConfig,
    progressCallback?: ProgressCallback
  ): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization(
      config,
      progressCallback
    );
    await this.initializationPromise;
  }

  private async _performInitialization(
    config: MeasurementConfig,
    progressCallback?: ProgressCallback
  ): Promise<void> {
    try {
      progressCallback?.(0.1, "Loading MediaPipe vision models...");

      // Initialize the MediaPipe FilesetResolver
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm"
      );

      progressCallback?.(0.3, "Creating pose landmarker...");

      // Create pose landmarker with optimal settings
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MEDIAPIPE_MODELS.POSE_LANDMARKER_FULL,
          delegate: "GPU", // Use GPU acceleration if available
        },
        runningMode: "IMAGE",
        numPoses: 1, // We expect only one person in the image
        minPoseDetectionConfidence: config.poseDetectionThreshold,
        minPosePresenceConfidence: config.poseDetectionThreshold,
        minTrackingConfidence: config.poseDetectionThreshold,
        outputSegmentationMasks: false, // We'll use TensorFlow for segmentation
      });

      progressCallback?.(0.8, "Warming up pose detection...");

      // Warm up the model with a dummy image
      await this._warmupModel();

      progressCallback?.(1.0, "Pose detection ready");

      this.isInitialized = true;
    } catch (error: any) {
      this.initializationPromise = null;
      throw new MeasurementError(
        `Failed to initialize pose detection: ${error.message}`,
        MEASUREMENT_ERROR_CODES.MODEL_LOAD_FAILED,
        error
      );
    }
  }

  /**
   * Warm up the model with a dummy image to reduce first-run latency
   */
  private async _warmupModel(): Promise<void> {
    if (!this.poseLandmarker) return;

    try {
      // Create a small dummy canvas
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 224, 224);

        // Run detection on dummy image
        await this.poseLandmarker.detect(canvas);
      }
    } catch (error) {
      // Warmup failure is not critical, just log it
      console.warn(
        "Pose detector warmup failed:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Detect pose landmarks in an image
   */
  async detectPose(
    image: File | HTMLImageElement | HTMLCanvasElement,
    validateCriticalLandmarks = true
  ): Promise<{
    landmarks: Landmark[];
    confidence: number;
    detectionTime: number;
  }> {
    if (!this.isInitialized || !this.poseLandmarker) {
      throw new MeasurementError(
        "Pose detector not initialized",
        MEASUREMENT_ERROR_CODES.MODEL_LOAD_FAILED
      );
    }

    const startTime = performance.now();

    try {
      // Preprocess the image
      const processedImage = await preprocessImage(image, {
        targetWidth: 512,
        targetHeight: 512,
        maintainAspectRatio: true,
        backgroundColor: "#FFFFFF",
      });

      // Detect poses
      const result: PoseLandmarkerResult = await this.poseLandmarker.detect(
        processedImage
      );

      const detectionTime = performance.now() - startTime;

      if (!result.landmarks || result.landmarks.length === 0) {
        throw new MeasurementError(
          "No pose detected in the image",
          MEASUREMENT_ERROR_CODES.POSE_DETECTION_FAILED
        );
      }

      // Get the first (and hopefully only) detected pose
      const poseLandmarks = result.landmarks[0];

      // Convert MediaPipe landmarks to our format
      const landmarks: Landmark[] = poseLandmarks.map((landmark) => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.visibility,
      }));

      // Calculate average confidence
      const confidence = this._calculateAverageConfidence(landmarks);

      // Validate critical landmarks if required
      if (validateCriticalLandmarks) {
        const criticalLandmarksValid = validateLandmarks(
          landmarks,
          CRITICAL_LANDMARKS,
          CONFIDENCE_THRESHOLDS.CRITICAL_LANDMARKS
        );

        if (!criticalLandmarksValid) {
          throw new MeasurementError(
            "Critical landmarks not detected with sufficient confidence",
            MEASUREMENT_ERROR_CODES.INSUFFICIENT_LANDMARKS,
            {
              detectedLandmarks: landmarks.length,
              criticalLandmarks: CRITICAL_LANDMARKS,
              confidence,
            }
          );
        }
      }

      return {
        landmarks,
        confidence,
        detectionTime,
      };
    } catch (error: any) {
      if (error instanceof MeasurementError) {
        throw error;
      }

      throw new MeasurementError(
        `Pose detection failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        MEASUREMENT_ERROR_CODES.POSE_DETECTION_FAILED,
        error
      );
    }
  }

  /**
   * Detect poses in both front and side photos
   */
  async detectPosesInPhotos(
    frontPhoto: File | HTMLImageElement | HTMLCanvasElement,
    sidePhoto: File | HTMLImageElement | HTMLCanvasElement,
    progressCallback?: ProgressCallback
  ): Promise<{
    frontPose: {
      landmarks: Landmark[];
      confidence: number;
      detectionTime: number;
    };
    sidePose: {
      landmarks: Landmark[];
      confidence: number;
      detectionTime: number;
    };
  }> {
    progressCallback?.(0.1, "Detecting pose in front photo...");

    const frontPose = await this.detectPose(frontPhoto, true);

    progressCallback?.(0.6, "Detecting pose in side photo...");

    const sidePose = await this.detectPose(sidePhoto, true);

    progressCallback?.(1.0, "Pose detection completed");

    // Validate that both poses have sufficient quality
    const minConfidence = CONFIDENCE_THRESHOLDS.OVERALL_MEASUREMENT;
    if (
      frontPose.confidence < minConfidence ||
      sidePose.confidence < minConfidence
    ) {
      throw new MeasurementError(
        `Pose detection confidence too low. Front: ${frontPose.confidence.toFixed(
          2
        )}, Side: ${sidePose.confidence.toFixed(2)}`,
        MEASUREMENT_ERROR_CODES.POSE_DETECTION_FAILED,
        {
          frontConfidence: frontPose.confidence,
          sideConfidence: sidePose.confidence,
          requiredConfidence: minConfidence,
        }
      );
    }

    return {
      frontPose,
      sidePose,
    };
  }

  /**
   * Calculate average confidence from landmarks
   */
  private _calculateAverageConfidence(landmarks: Landmark[]): number {
    if (landmarks.length === 0) return 0;

    const totalConfidence = landmarks.reduce(
      (sum, landmark) => sum + (landmark.visibility || 0),
      0
    );

    return totalConfidence / landmarks.length;
  }

  /**
   * Get specific landmark by index with validation
   */
  getLandmark(landmarks: Landmark[], index: number): Landmark {
    if (index < 0 || index >= landmarks.length) {
      throw new MeasurementError(
        `Landmark index ${index} out of bounds`,
        MEASUREMENT_ERROR_CODES.CALCULATION_ERROR
      );
    }

    const landmark = landmarks[index];
    if (
      !landmark ||
      (landmark.visibility || 0) < CONFIDENCE_THRESHOLDS.POSE_LANDMARK
    ) {
      throw new MeasurementError(
        `Landmark at index ${index} has insufficient confidence`,
        MEASUREMENT_ERROR_CODES.INSUFFICIENT_LANDMARKS,
        { index, landmark }
      );
    }

    return landmark;
  }

  /**
   * Check if the service is ready for use
   */
  isReady(): boolean {
    return this.isInitialized && this.poseLandmarker !== null;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.poseLandmarker) {
      this.poseLandmarker.close();
      this.poseLandmarker = null;
    }
    this.isInitialized = false;
    this.initializationPromise = null;
  }
}
