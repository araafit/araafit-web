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
        bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
        {
          runtime: "mediapipe", 
          modelType: "general", // "landscape" exists too, but general is good default
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation", 
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
        segmentBodyParts: false, // First pass: person mask (fast)
        segmentationThreshold: 0.9, // Use lower threshold during segmentation
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
        0.9 // foregroundThreshold - use higher threshold
      );

      // Debug: Check a sample of mask pixels to verify it's working correctly
      const samplePixels: any[] = [];
      for (let i = 0; i < Math.min(10, mask.data.length); i += 4) {
        samplePixels.push({
          r: mask.data[i],
          g: mask.data[i + 1], 
          b: mask.data[i + 2],
          a: mask.data[i + 3]
        });
      }
      console.log("Sample mask pixels:", samplePixels);

      // Optionally remove arms/hands using body-part segmentation
      // This helps ensure torso-only width at bust/waist/hip is not inflated by arms
      const finalMask = mask;
      //try {
      //  const partSegs = await this.segmenter.segmentPeople(processedImage, {
      //    multiSegmentation: false,
      //    segmentBodyParts: true,
      //    segmentationThreshold: 0.1,
      //  });
      //  console.log("Part segments:", partSegs);
      //  if (partSegs && partSegs.length > 0) {
      //    const partSeg: any = partSegs[0] as any;
      //    // Some implementations expose ImageData at partSeg.mask. If unavailable, skip.
      //    const partMask: ImageData | undefined = (partSeg && (partSeg.mask as ImageData)) || undefined;
      //    if (partMask) {
      //      finalMask = this._removeArmsFromMask(mask, partMask);
      //    } else {
      //      // Fallback: try to create a part mask image via toColoredMask with transparent arms
      //      try {
      //        const ARMS_AND_HANDS = new Set<number>([12,13,14,15,16,17,18,19,20,21]);
      //        const colored = await (bodySegmentation as any).toColoredMask(
      //          [partSeg],
      //          (maskValue: number) => {
      //            // Transparent for arms/hands, opaque white for others
      //            if (ARMS_AND_HANDS.has(maskValue)) return { r: 0, g: 0, b: 0, a: 0 };
      //            return { r: 255, g: 255, b: 255, a: 255 };
      //          },
      //          { r: 0, g: 0, b: 0, a: 0 },
      //          false,
      //          0.5
      //        );
      //        if (colored) {
      //          finalMask = this._combineMaskWithPartAlpha(mask, colored as ImageData);
      //        }
      //      } catch (e) {
      //        console.warn("Body-part colored mask not available:", e);
      //      }
      //    }
      //  }
      //} catch (e) {
      //  console.warn("Body-part segmentation pass failed (arms not removed):", e);
      //}

      // Calculate confidence based on segmentation quality
      const confidence = this._calculateSegmentationConfidence(finalMask);

      if (confidence < CONFIDENCE_THRESHOLDS.SEGMENTATION) {
        throw new MeasurementError(
          `Body segmentation confidence too low: ${confidence.toFixed(2)}`,
          MEASUREMENT_ERROR_CODES.SEGMENTATION_FAILED,
          { confidence, threshold: CONFIDENCE_THRESHOLDS.SEGMENTATION }
        );
      }

      return {
        mask: finalMask,
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
   * Now excludes arm/hand regions using pose landmarks
   */
  measureBodyWidthAtHeight(
    mask: ImageData,
    heightRatio: number, // 0.0 = top, 1.0 = bottom
    landmarks?: Landmark[] // Optional landmarks to exclude arms
  ): BodyWidthMeasurement {
    const { width, height, data } = mask;
    const centerY = Math.floor(heightRatio * height);
    
    // Sample multiple lines around the target height for better accuracy
    const sampleRange = Math.max(3, Math.floor(height * 0.02)); // 2% of image height or minimum 3 pixels
    const startY = Math.max(0, centerY - sampleRange);
    const endY = Math.min(height - 1, centerY + sampleRange);

    console.log(`Measuring body width at height ratio ${heightRatio}, center Y: ${centerY}, sampling Y: ${startY}-${endY}, image size: ${width}x${height}`);

    // Calculate torso boundaries if landmarks are available
    let torsoLeftBound = 0;
    let torsoRightBound = width;
    
    if (landmarks && landmarks.length > 33) {
      const { leftBound, rightBound } = this._calculateTorsoBounds(landmarks, width, height, heightRatio);
      torsoLeftBound = leftBound;
      torsoRightBound = rightBound;
      console.log(`Using torso bounds: left=${torsoLeftBound}, right=${torsoRightBound} (excluding arms)`);
    } else {
        console.log("No landmarks available, using full width", landmarks, landmarks?.length);
    }

    let totalLeftX = 0;
    let totalRightX = 0;
    let validLines = 0;
    let totalPixelCount = 0;

    // Sample multiple horizontal lines for more robust measurement
    for (let y = startY; y <= endY; y++) {
      let leftMostX = width;
      let rightMostX = 0;
      let linePixelCount = 0;

      // Scan the horizontal line, but only within torso bounds
      const scanStartX = Math.max(0, torsoLeftBound);
      const scanEndX = Math.min(width, torsoRightBound);
      
      for (let x = scanStartX; x < scanEndX; x++) {
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

      const bust = this.measureBodyWidthAtHeight(mask, bustRatio, landmarks);
      const waist = this.measureBodyWidthAtHeight(mask, waistRatio, landmarks);
      const hip = this.measureBodyWidthAtHeight(mask, hipRatio, landmarks);

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
   * Remove arms/hands pixels from a person mask using a body-part mask
   * personMask: binary person ImageData (alpha>0 = person)
   * partMask: colored ImageData where red-channel encodes part ids
   */
  //private _removeArmsFromMask(personMask: ImageData, partMask: ImageData): ImageData {
  //  try {
  //    const width = personMask.width;
  //    const height = personMask.height;
  //    const out = new ImageData(width, height);

  //    // IDs commonly used by BodyPix for arms/hands (may vary by version)
  //    const ARMS_AND_HANDS = new Set<number>([12,13,14,15,16,17,18,19,20,21]);

  //    for (let i = 0; i < personMask.data.length; i += 4) {
  //      const a = personMask.data[i + 3];
  //      if (a === 0) {
  //        // background
  //        out.data[i] = 0; out.data[i+1] = 0; out.data[i+2] = 0; out.data[i+3] = 0;
  //        continue;
  //      }

  //      // part id in red channel (0..n)
  //      const partId = partMask.data[i];
  //      if (ARMS_AND_HANDS.has(partId)) {
  //        // remove arms/hands
  //        out.data[i] = 0; out.data[i+1] = 0; out.data[i+2] = 0; out.data[i+3] = 0;
  //      } else {
  //        // keep
  //        out.data[i] = 255; out.data[i+1] = 255; out.data[i+2] = 255; out.data[i+3] = 255;
  //      }
  //    }

  //    return out;
  //  } catch (e) {
  //    console.warn("Failed to remove arms from mask, using original person mask:", e);
  //    return personMask;
  //  }
  //}

  /**
   * Combine person mask with a colored body-part mask (where non-arms are opaque)
   */
  //private _combineMaskWithPartAlpha(personMask: ImageData, coloredPartMask: ImageData): ImageData {
  //  const width = personMask.width;
  //  const height = personMask.height;
  //  const out = new ImageData(width, height);
  //  for (let i = 0; i < personMask.data.length; i += 4) {
  //    const personA = personMask.data[i + 3];
  //    const partA = coloredPartMask.data[i + 3];
  //    const a = personA > 0 && partA > 0 ? 255 : 0;
  //    out.data[i] = a > 0 ? 255 : 0;
  //    out.data[i + 1] = a > 0 ? 255 : 0;
  //    out.data[i + 2] = a > 0 ? 255 : 0;
  //    out.data[i + 3] = a;
  //  }
  //  return out;
  //}

  /**
   * Calculate torso boundaries to exclude arms from width measurements
   * Uses pose landmarks to determine where arms are positioned
   */
  private _calculateTorsoBounds(
    landmarks: Landmark[], 
    imgW: number, 
    _imgH: number, 
    heightRatio: number
  ): { leftBound: number; rightBound: number } {
    // MediaPipe landmark indices
    const LEFT_SHOULDER = 11;
    const RIGHT_SHOULDER = 12;
    const LEFT_ELBOW = 13;
    const RIGHT_ELBOW = 14;
    const LEFT_WRIST = 15;
    const RIGHT_WRIST = 16;
    const LEFT_HIP = 23;
    const RIGHT_HIP = 24;

    // Get key landmarks
    const leftShoulder = landmarks[LEFT_SHOULDER];
    const rightShoulder = landmarks[RIGHT_SHOULDER];
    const leftElbow = landmarks[LEFT_ELBOW];
    const rightElbow = landmarks[RIGHT_ELBOW];
    const leftWrist = landmarks[LEFT_WRIST];
    const rightWrist = landmarks[RIGHT_WRIST];
    const leftHip = landmarks[LEFT_HIP];
    const rightHip = landmarks[RIGHT_HIP];

    // Default to full width if landmarks not available
    let leftBound = 0;
    let rightBound = imgW;

    // Calculate torso bounds based on pose landmarks
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      // Get shoulder and hip positions
      const leftShoulderX = leftShoulder.x * imgW;
      const rightShoulderX = rightShoulder.x * imgW;
      const leftHipX = leftHip.x * imgW;
      const rightHipX = rightHip.x * imgW;

      // Interpolate between shoulder and hip width based on height ratio
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      
      // Calculate where we are relative to shoulder-hip line
      let interpFactor = 0.5; // Default to middle
      if (Math.abs(hipY - shoulderY) > 0.01) {
        const currentY = heightRatio;
        interpFactor = Math.max(0, Math.min(1, (currentY - shoulderY) / (hipY - shoulderY)));
      }

      // Interpolate left and right bounds
      const interpolatedLeftX = leftShoulderX + (leftHipX - leftShoulderX) * interpFactor;
      const interpolatedRightX = rightShoulderX + (rightHipX - rightShoulderX) * interpFactor;

      // Add some margin to account for torso width, but exclude arms
      const torsoMargin = Math.min(50, imgW * 0.1); // 10% of image width or 50px max
      leftBound = Math.max(0, interpolatedLeftX - torsoMargin);
      rightBound = Math.min(imgW, interpolatedRightX + torsoMargin);

      // Additional check: if arms are visible and extended, use elbow/wrist to refine bounds
      if (leftElbow && leftWrist && rightElbow && rightWrist) {
        const leftElbowX = leftElbow.x * imgW;
        const rightElbowX = rightElbow.x * imgW;
        const leftWristX = leftWrist.x * imgW;
        const rightWristX = rightWrist.x * imgW;

        // If arms are extended horizontally, use elbow position as outer bound
        const leftArmExtended = leftWristX < leftElbowX && leftElbowX < leftShoulderX;
        const rightArmExtended = rightWristX > rightElbowX && rightElbowX > rightShoulderX;

        if (leftArmExtended) {
          leftBound = Math.max(leftBound, leftElbowX - 20); // Stay inside of elbow
        }
        if (rightArmExtended) {
          rightBound = Math.min(rightBound, rightElbowX + 20); // Stay inside of elbow
        }
      }

      console.log(`Torso bounds calculation: shoulders(${leftShoulderX.toFixed(1)}-${rightShoulderX.toFixed(1)}), hips(${leftHipX.toFixed(1)}-${rightHipX.toFixed(1)}), interpolated(${interpolatedLeftX.toFixed(1)}-${interpolatedRightX.toFixed(1)}), final bounds(${leftBound.toFixed(1)}-${rightBound.toFixed(1)})`);
    }

    return { leftBound: Math.round(leftBound), rightBound: Math.round(rightBound) };
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
