/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Main Measurement Service
 * Coordinates all measurement components to extract tailoring measurements from photos
 */

import {
  type PhotoInput,
  type MeasurementResult,
  type MeasurementConfig,
  MeasurementError,
  type ProgressCallback,
  type RawMeasurements,
} from './types';
import {
  DEFAULT_MEASUREMENT_CONFIG,
  MEASUREMENT_ERROR_CODES,
} from './config';
import { validateInput } from './utils';
import { PoseDetectorService } from './pose-detector';
import { BodySegmentationService } from './body-segmentation';
import { MeasurementCalculatorService } from './measurement-calculator';
import { DressSizeCalculatorService } from './dress-size-calculator';

export class MeasurementService {
  private poseDetector: PoseDetectorService;
  private bodySegmentation: BodySegmentationService;
  private measurementCalculator: MeasurementCalculatorService;
  private dressSizeCalculator: DressSizeCalculatorService;
  private isInitialized = false;
  private config: MeasurementConfig;

  constructor(config: Partial<MeasurementConfig> = {}) {
    this.config = { ...DEFAULT_MEASUREMENT_CONFIG, ...config };
    this.poseDetector = new PoseDetectorService();
    this.bodySegmentation = new BodySegmentationService();
    this.measurementCalculator = new MeasurementCalculatorService();
    this.dressSizeCalculator = new DressSizeCalculatorService();
  }

  /**
   * Initialize the measurement service
   */
  async initialize(progressCallback?: ProgressCallback): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      progressCallback?.(0.1, 'Starting initialization...');

      // Initialize pose detection service
      progressCallback?.(0.2, 'Initializing pose detection...');
      await this.poseDetector.initialize(this.config, (progress, stage) => {
        progressCallback?.(0.2 + progress * 0.4, stage);
      });

      // Initialize body segmentation service
      progressCallback?.(0.6, 'Initializing body segmentation...');
      await this.bodySegmentation.initialize(this.config, (progress, stage) => {
        progressCallback?.(0.6 + progress * 0.3, stage);
      });

      progressCallback?.(0.9, 'Finalizing initialization...');

      this.isInitialized = true;
      progressCallback?.(1.0, 'Measurement service ready');
    } catch (error: any) {
      throw new MeasurementError(
        `Failed to initialize measurement service: ${error.message}`,
        MEASUREMENT_ERROR_CODES.MODEL_LOAD_FAILED,
        error
      );
    }
  }

  /**
   * Extract measurements from photos
   */
  async extractMeasurements(
    input: PhotoInput,
    progressCallback?: ProgressCallback
  ): Promise<MeasurementResult> {
    if (!this.isInitialized) {
      throw new MeasurementError(
        'Measurement service not initialized',
        MEASUREMENT_ERROR_CODES.MODEL_LOAD_FAILED
      );
    }

    const startTime = performance.now();

    try {
      // Validate input
      validateInput(input.frontPhoto, input.sidePhoto, input.heightInCm);

      progressCallback?.(0.05, 'Starting measurement extraction...');

      // Step 1: Detect poses in both photos
      progressCallback?.(0.1, 'Detecting poses...');
      const poseResults = await this.poseDetector.detectPosesInPhotos(
        input.frontPhoto,
        input.sidePhoto,
        (progress, stage) => {
          progressCallback?.(0.1 + progress * 0.3, stage);
        }
      );

      // Step 2: Perform body segmentation on both photos
      progressCallback?.(0.4, 'Performing body segmentation...');
      
      const [frontSegmentation, sideSegmentation] = await Promise.all([
        this.bodySegmentation.segmentBody(input.frontPhoto),
        this.bodySegmentation.segmentBody(input.sidePhoto),
      ]);

      progressCallback?.(0.6, 'Analyzing body measurements...');

      // Step 3: Extract width measurements from segmentation
      const frontWidthMeasurements = this.bodySegmentation.measureBodyWidthAtMultipleHeights(
        frontSegmentation.mask,
        poseResults.frontPose.landmarks
      );

      const sideWidthMeasurements = this.bodySegmentation.measureBodyWidthAtMultipleHeights(
        sideSegmentation.mask,
        poseResults.sidePose.landmarks
      );

      progressCallback?.(0.7, 'Calculating measurements...');

      // Step 4: Calculate final measurements
      const rawMeasurements = this.measurementCalculator.calculateMeasurements({
        frontLandmarks: poseResults.frontPose.landmarks,
        sideLandmarks: poseResults.sidePose.landmarks,
        frontWidthMeasurements,
        sideWidthMeasurements,
        frontMaskData: frontSegmentation.mask.data,
        sideMaskData: sideSegmentation.mask.data,
        imageWidth: frontSegmentation.mask.width,
        imageHeight: frontSegmentation.mask.height,
        heightInCm: input.heightInCm,
      });

      // Step 5: Validate measurements
      const measurementsValid = this.measurementCalculator.validateMeasurements(rawMeasurements);
      if (!measurementsValid) {
        console.warn('Measurements may be inaccurate - validation failed');
      }

      progressCallback?.(0.85, 'Calculating dress size...');

      // Step 6: Calculate dress size
      const dressSize = this.dressSizeCalculator.calculateDressSize(rawMeasurements);

      progressCallback?.(0.95, 'Finalizing results...');

      // Step 7: Calculate overall confidence
      const overallConfidence = this._calculateOverallConfidence(
        poseResults.frontPose.confidence,
        poseResults.sidePose.confidence,
        frontSegmentation.confidence,
        sideSegmentation.confidence,
        measurementsValid
      );

      const processingTime = performance.now() - startTime;

      const result: MeasurementResult = {
        measurements: rawMeasurements,
        dressSize,
        confidence: overallConfidence,
        metadata: {
          processedAt: new Date(),
          frontPhotoLandmarks: poseResults.frontPose.landmarks.length,
          sidePhotoLandmarks: poseResults.sidePose.landmarks.length,
          processingTimeMs: processingTime,
        },
      };

      progressCallback?.(1.0, 'Measurement extraction completed');

      return result;
    } catch (error: any) {
      if (error instanceof MeasurementError) {
        throw error;
      }

      throw new MeasurementError(
        `Measurement extraction failed: ${error.message}`,
        MEASUREMENT_ERROR_CODES.CALCULATION_ERROR,
        error
      );
    }
  }

  /**
   * Extract measurements with enhanced error handling and retry logic
   */
  async extractMeasurementsWithRetry(
    input: PhotoInput,
    maxRetries = 2,
    progressCallback?: ProgressCallback
  ): Promise<MeasurementResult> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const attemptProgress = (progress: number, stage: string) => {
          const adjustedProgress = (progress + attempt) / (maxRetries + 1);
          const attemptInfo = attempt > 0 ? ` (Attempt ${attempt + 1})` : '';
          progressCallback?.(adjustedProgress, `${stage}${attemptInfo}`);
        };

        return await this.extractMeasurements(input, attemptProgress);
      } catch (error: any) {
        lastError = error as Error;
        
        // Don't retry for certain types of errors
        if (error instanceof MeasurementError) {
          const nonRetryableCodes = [
            MEASUREMENT_ERROR_CODES.INVALID_INPUT,
            MEASUREMENT_ERROR_CODES.INVALID_HEIGHT,
            MEASUREMENT_ERROR_CODES.MODEL_LOAD_FAILED,
          ];
          
          if (nonRetryableCodes.includes(error.code as any)) {
            throw error;
          }
        }

        if (attempt < maxRetries) {
          progressCallback?.(
            (attempt + 1) / (maxRetries + 1),
            `Retrying measurement extraction... (${attempt + 1}/${maxRetries})`
          );
          
          // Brief delay before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw lastError || new MeasurementError(
      'Measurement extraction failed after retries',
      MEASUREMENT_ERROR_CODES.CALCULATION_ERROR
    );
  }

  /**
   * Calculate overall confidence score
   */
  private _calculateOverallConfidence(
    frontPoseConfidence: number,
    sidePoseConfidence: number,
    frontSegmentationConfidence: number,
    sideSegmentationConfidence: number,
    measurementsValid: boolean
  ): number {
    // Weight different confidence scores
    const weights = {
      frontPose: 0.25,
      sidePose: 0.25,
      frontSegmentation: 0.2,
      sideSegmentation: 0.2,
      validation: 0.1,
    };

    const validationScore = measurementsValid ? 1.0 : 0.5;

    const weightedConfidence = 
      frontPoseConfidence * weights.frontPose +
      sidePoseConfidence * weights.sidePose +
      frontSegmentationConfidence * weights.frontSegmentation +
      sideSegmentationConfidence * weights.sideSegmentation +
      validationScore * weights.validation;

    return Math.max(0, Math.min(1, weightedConfidence));
  }

  /**
   * Get measurement service status
   */
  getStatus(): {
    isInitialized: boolean;
    poseDetectorReady: boolean;
    bodySegmentationReady: boolean;
    config: MeasurementConfig;
  } {
    return {
      isInitialized: this.isInitialized,
      poseDetectorReady: this.poseDetector.isReady(),
      bodySegmentationReady: this.bodySegmentation.isReady(),
      config: this.config,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<MeasurementConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get size recommendations for measurements
   */
  getSizeRecommendations(measurements: RawMeasurements) {
    return this.dressSizeCalculator.getSizeRecommendations(measurements);
  }

  /**
   * Analyze fit for a specific size
   */
  analyzeFit(
    measurements: RawMeasurements,
    size: string,
    region: 'US' | 'UK' | 'EU' = 'US'
  ) {
    return this.dressSizeCalculator.analyzeFit(measurements, size, region);
  }

  /**
   * Convert between size systems
   */
  convertSize(size: string, fromRegion: 'US' | 'UK' | 'EU', toRegion: 'US' | 'UK' | 'EU') {
    return this.dressSizeCalculator.convertSize(size, fromRegion, toRegion);
  }

  /**
   * Check if measurements are between sizes
   */
  isBetweenSizes(measurements: RawMeasurements, region: 'US' | 'UK' | 'EU' = 'US') {
    return this.dressSizeCalculator.isBetweenSizes(measurements, region);
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.poseDetector.dispose();
    this.bodySegmentation.dispose();
    this.isInitialized = false;
  }

  /**
   * Create a new measurement service instance
   */
  static create(config?: Partial<MeasurementConfig>): MeasurementService {
    return new MeasurementService(config);
  }

  /**
   * Get version information
   */
  static getVersion(): string {
    return '1.0.0';
  }
}
