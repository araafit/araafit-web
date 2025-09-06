/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Body Segmentation Service
 * Handles body segmentation using TensorFlow.js BodyPix
 */

import * as tf from "@tensorflow/tfjs";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";

import {
  type Landmark,
  MeasurementError,
  type ProgressCallback,
  type MeasurementConfig,
} from "./types";
import { MEASUREMENT_ERROR_CODES, CONFIDENCE_THRESHOLDS } from "./config";
import {
  preprocessImage,
} from "./utils";

interface SegmentationResult {
  mask: ImageData;
  confidence: number;
  segmentationTime: number;
}

interface BodyWidthMeasurement {
  width: number;
  depth: number;
  confidence: number;
  pixelCount: number;
}

export class BodySegmentationService {
  private segmenter: bodySegmentation.BodySegmenter | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * Initialize the body segmentation service
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
    console.log("Performing initialization...", config);
    try {
      progressCallback?.(0.1, "Loading TensorFlow.js...");

      // Ensure TensorFlow.js is ready
      await tf.ready();

      progressCallback?.(0.3, "Loading body segmentation model...");

      // Create segmenter with optimal configuration
      this.segmenter = await bodySegmentation.createSegmenter(
        bodySegmentation.SupportedModels.BodyPix,
        {
          architecture: "ResNet50", // Better accuracy than MobileNetV1
          outputStride: 16, // Balance between accuracy and performance
          multiplier: 1.0, // Full model capacity
          quantBytes: 4, // Higher precision
        }
      );

      progressCallback?.(0.8, "Warming up segmentation model...");

      // Warm up the model
      await this._warmupModel();

      progressCallback?.(1.0, "Body segmentation ready");

      this.isInitialized = true;
    } catch (error: any) {
      this.initializationPromise = null;
      throw new MeasurementError(
        `Failed to initialize body segmentation: ${error.message}`,
        MEASUREMENT_ERROR_CODES.MODEL_LOAD_FAILED,
        error
      );
    }
  }

  /**
   * Warm up the model with a dummy image
   */
  private async _warmupModel(): Promise<void> {
    if (!this.segmenter) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#808080";
        ctx.fillRect(0, 0, 224, 224);

        // Run segmentation on dummy image
        await this.segmenter.segmentPeople(canvas, {
          multiSegmentation: false,
          segmentBodyParts: true,
        });
      }
    } catch (error) {
      console.warn("Body segmentation warmup failed:", error);
    }
  }

  /**
   * Segment body in an image
   */
  async segmentBody(
    image: File | HTMLImageElement | HTMLCanvasElement
  ): Promise<SegmentationResult> {
    if (!this.isInitialized || !this.segmenter) {
      throw new MeasurementError(
        "Body segmentation not initialized",
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

      // Perform segmentation with lower threshold for better detection
      console.log("Starting body segmentation...");
      const segmentations = await this.segmenter.segmentPeople(processedImage, {
        multiSegmentation: false,
        segmentBodyParts: false, // Disable body parts for better basic segmentation
        segmentationThreshold: 0.1, // Use lower threshold during segmentation
      });

      const segmentationTime = performance.now() - startTime;
      console.log(`Segmentation completed in ${segmentationTime.toFixed(0)}ms`);

      if (!segmentations || segmentations.length === 0) {
        console.error("No segmentations returned from BodyPix");
        throw new MeasurementError(
          "No body detected in segmentation",
          MEASUREMENT_ERROR_CODES.SEGMENTATION_FAILED
        );
      }

      console.log(`Found ${segmentations.length} segmentation(s)`);
      const segmentation = segmentations[0];

      // Convert segmentation to binary mask using the built-in function
      console.log("Converting segmentation to binary mask...");
      const mask = await bodySegmentation.toBinaryMask(
        [segmentation],
        { r: 255, g: 255, b: 255, a: 255 }, // foreground color (person)
        { r: 0, g: 0, b: 0, a: 0 }, // background color
        false, // drawContour - disable for cleaner mask
        0.5 // foregroundThreshold - use higher threshold
      );

      // Debug: Check a sample of mask pixels to verify it's working correctly
      const samplePixels = [];
      for (let i = 0; i < Math.min(10, mask.data.length); i += 4) {
        samplePixels.push({
          r: mask.data[i],
          g: mask.data[i + 1], 
          b: mask.data[i + 2],
          a: mask.data[i + 3]
        });
      }
      console.log("Sample mask pixels:", samplePixels);

      // Calculate confidence based on segmentation quality
      const confidence = this._calculateSegmentationConfidence(mask);

      if (confidence < CONFIDENCE_THRESHOLDS.SEGMENTATION) {
        throw new MeasurementError(
          `Body segmentation confidence too low: ${confidence.toFixed(2)}`,
          MEASUREMENT_ERROR_CODES.SEGMENTATION_FAILED,
          { confidence, threshold: CONFIDENCE_THRESHOLDS.SEGMENTATION }
        );
      }

      return {
        mask,
        confidence,
        segmentationTime,
      };
    } catch (error: any) {
      if (error instanceof MeasurementError) {
        throw error;
      }

      throw new MeasurementError(
        `Body segmentation failed: ${error.message}`,
        MEASUREMENT_ERROR_CODES.SEGMENTATION_FAILED,
        error
      );
    }
  }

  /**
   * Measure body width at specific height using segmentation mask with multi-line sampling
   */
  measureBodyWidthAtHeight(
    mask: ImageData,
    heightRatio: number // 0.0 = top, 1.0 = bottom
  ): BodyWidthMeasurement {
    const { width, height, data } = mask;
    const centerY = Math.floor(heightRatio * height);
    
    // Sample multiple lines around the target height for better accuracy
    const sampleRange = Math.max(3, Math.floor(height * 0.02)); // 2% of image height or minimum 3 pixels
    const startY = Math.max(0, centerY - sampleRange);
    const endY = Math.min(height - 1, centerY + sampleRange);

    console.log(`Measuring body width at height ratio ${heightRatio}, center Y: ${centerY}, sampling Y: ${startY}-${endY}, image size: ${width}x${height}`);

    let totalLeftX = 0;
    let totalRightX = 0;
    let validLines = 0;
    let totalPixelCount = 0;

    // Sample multiple horizontal lines for more robust measurement
    for (let y = startY; y <= endY; y++) {
      let leftMostX = width;
      let rightMostX = 0;
      let linePixelCount = 0;

      // Scan the horizontal line
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        const alpha = data[pixelIndex + 3];

        // If pixel is part of the body (alpha > 0)
        if (alpha > 0) {
          leftMostX = Math.min(leftMostX, x);
          rightMostX = Math.max(rightMostX, x);
          linePixelCount++;
        }
      }

      // Only include lines that have body pixels
      if (linePixelCount > 0) {
        totalLeftX += leftMostX;
        totalRightX += rightMostX;
        totalPixelCount += linePixelCount;
        validLines++;
      }
    }

    if (validLines === 0) {
      throw new MeasurementError(
        `No body pixels found at height ratio ${heightRatio}`,
        MEASUREMENT_ERROR_CODES.CALCULATION_ERROR
      );
    }

    // Average the measurements across all valid lines
    const avgLeftX = totalLeftX / validLines;
    const avgRightX = totalRightX / validLines;
    const bodyWidth = avgRightX - avgLeftX;

    // Estimate depth based on body width (empirical ratio)
    // Different ratios for different body parts
    let depthRatio = 0.4; // Default torso depth ratio
    if (heightRatio < 0.4) {
      depthRatio = 0.35; // Bust area - slightly less depth
    } else if (heightRatio > 0.7) {
      depthRatio = 0.45; // Hip area - slightly more depth
    } else {
      depthRatio = 0.3; // Waist area - narrower depth
    }
    
    const bodyDepth = bodyWidth * depthRatio;

    // Calculate confidence based on pixel density and consistency
    const avgPixelsPerLine = totalPixelCount / validLines;
    const maxPossiblePixels = width;
    const densityConfidence = Math.min(avgPixelsPerLine / maxPossiblePixels, 1.0);
    const consistencyConfidence = validLines / (endY - startY + 1);
    const confidence = (densityConfidence + consistencyConfidence) / 2;

    console.log(`Body width measurement: width=${bodyWidth.toFixed(1)}px, depth=${bodyDepth.toFixed(1)}px, confidence=${confidence.toFixed(2)}, avgPixels=${avgPixelsPerLine.toFixed(1)}, validLines=${validLines}`);

    return {
      width: bodyWidth,
      depth: bodyDepth,
      confidence,
      pixelCount: Math.round(avgPixelsPerLine),
    };
  }

  /**
   * Measure body width at multiple heights using landmark-based positioning
   */
  measureBodyWidthAtMultipleHeights(
    mask: ImageData,
    landmarks: Landmark[]
  ): {
    bust: BodyWidthMeasurement;
    waist: BodyWidthMeasurement;
    hip: BodyWidthMeasurement;
  } {
    try {
      const { width: imgW, height: imgH } = mask;
      console.log("Image dimensions:", imgW, imgH);
      
      // Calculate landmark-based positions
      const bustRatio = this._calculateBustPosition(landmarks, imgH);
      const waistRatio = this._calculateWaistPosition(landmarks, imgH);
      const hipRatio = this._calculateHipPosition(landmarks, imgH);

      console.log(`Measurement positions - Bust: ${(bustRatio * 100).toFixed(1)}%, Waist: ${(waistRatio * 100).toFixed(1)}%, Hip: ${(hipRatio * 100).toFixed(1)}%`);

      const bust = this.measureBodyWidthAtHeight(mask, bustRatio);
      const waist = this.measureBodyWidthAtHeight(mask, waistRatio);
      const hip = this.measureBodyWidthAtHeight(mask, hipRatio);

      return { bust, waist, hip };
    } catch (error: any) {
      throw new MeasurementError(
        `Failed to measure body widths: ${error.message}`,
        MEASUREMENT_ERROR_CODES.CALCULATION_ERROR,
        error
      );
    }
  }

  /**
   * Calculate bust measurement position based on shoulder landmarks
   */
  private _calculateBustPosition(landmarks: Landmark[], imgH: number): number {
    console.log("Calculating bust position...", landmarks, imgH);
    const leftShoulder = landmarks[11]; // LEFT_SHOULDER
    const rightShoulder = landmarks[12]; // RIGHT_SHOULDER
    const leftHip = landmarks[23]; // LEFT_HIP
    const rightHip = landmarks[24]; // RIGHT_HIP

    console.log("Shoulder width:", leftShoulder.x - rightShoulder.x);
    console.log("Hip width:", leftHip.x - rightHip.x);

    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      // Calculate shoulder and hip Y positions
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      
      // Bust is typically 25-35% down from shoulders to hips
      const bustY = shoulderY + (hipY - shoulderY) * 0.3;
      return Math.max(0.1, Math.min(0.9, bustY));
    }
    
    console.log("No bust landmarks found, falling back to fixed ratio");
    // Fallback to fixed ratio
    return 0.3;
  }

  /**
   * Calculate waist measurement position based on torso landmarks
   */
  private _calculateWaistPosition(landmarks: Landmark[], imgH: number): number {
    console.log("Calculating waist position...", landmarks, imgH);
    const leftShoulder = landmarks[11]; // LEFT_SHOULDER
    const rightShoulder = landmarks[12]; // RIGHT_SHOULDER
    const leftHip = landmarks[23]; // LEFT_HIP
    const rightHip = landmarks[24]; // RIGHT_HIP

    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      // Calculate shoulder and hip Y positions
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      
      // Waist is typically 60-70% down from shoulders to hips (natural waist)
      const waistY = shoulderY + (hipY - shoulderY) * 0.65;
      return Math.max(0.2, Math.min(0.8, waistY));
    }
    
    console.log("No waist landmarks found, falling back to fixed ratio");
    // Fallback to fixed ratio
    return 0.6;
  }

  /**
   * Calculate hip measurement position based on hip landmarks
   */
  private _calculateHipPosition(landmarks: Landmark[], imgH: number): number {
    console.log("Calculating hip position...", landmarks, imgH);
    const leftHip = landmarks[23]; // LEFT_HIP
    const rightHip = landmarks[24]; // RIGHT_HIP

    if (leftHip && rightHip) {
      // Use the actual hip landmark position
      const hipY = (leftHip.y + rightHip.y) / 2;
      return Math.max(0.3, Math.min(0.95, hipY));
    }
    
    // Fallback to fixed ratio
    return 0.85;
  }


  /**
   * Calculate confidence score for segmentation quality
   */
  private _calculateSegmentationConfidence(mask: ImageData): number {
    const { data } = mask;
    let bodyPixels = 0;
    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        // Alpha channel
        bodyPixels++;
      }
    }

    // Body should occupy reasonable portion of the image
    const bodyRatio = bodyPixels / totalPixels;

    // Debug logging
    console.log(
      `Body segmentation debug: ${bodyPixels} body pixels out of ${totalPixels} total pixels (${(
        bodyRatio * 100
      ).toFixed(2)}%)`
    );

    // More lenient confidence calculation
    if (bodyPixels === 0) {
      return 0; // No body detected at all
    }

    // Accept a wider range of body ratios (2% to 80% of image)
    if (bodyRatio < 0.02) {
      return Math.max(0.1, bodyRatio * 50); // Give some confidence even for small detections
    }

    if (bodyRatio > 0.8) {
      return Math.max(0.3, 1 - (bodyRatio - 0.8) * 2); // Penalize very large detections but not too harshly
    }

    // Normal range: scale confidence based on how reasonable the body ratio is
    // Optimal range is 10-60% of image
    if (bodyRatio >= 0.1 && bodyRatio <= 0.6) {
      return Math.min(1.0, bodyRatio * 2 + 0.5); // High confidence for good ratios
    }

    // Sub-optimal but acceptable range
    return Math.max(0.4, Math.min(0.8, bodyRatio * 1.5 + 0.2));
  }

  /**
   * Check if the service is ready for use
   */
  isReady(): boolean {
    return this.isInitialized && this.segmenter !== null;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.segmenter) {
      // TensorFlow models don't have explicit cleanup methods
      this.segmenter = null;
    }
    this.isInitialized = false;
    this.initializationPromise = null;
  }
}
