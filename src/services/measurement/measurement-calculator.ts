/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Measurement Calculator Service
 * Calculates body measurements from pose landmarks and segmentation data
 */

import {
    PoseLandmarks,
  type Landmark,
  type RawMeasurements,
  MeasurementError,
} from "./types";
import {
  //  BODY_PROPORTIONS,
  MEASUREMENT_ERROR_CODES,
} from "./config";
import {
  calculateDistance,
  calculateMidpoint,
  calculateCircumference,
  smoothMeasurement,
  calculatePixelToCmRatio,
  distPx,
} from "./utils";

interface BodyWidthMeasurement {
  width: number;
  depth: number;
  confidence: number;
  pixelCount: number;
}

interface PoseAnalysis {
  frontLandmarks: Landmark[];
  sideLandmarks: Landmark[];
  frontWidthMeasurements: {
    bust: BodyWidthMeasurement;
    waist: BodyWidthMeasurement;
    hip: BodyWidthMeasurement;
  };
  sideWidthMeasurements: {
    bust: BodyWidthMeasurement;
    waist: BodyWidthMeasurement;
    hip: BodyWidthMeasurement;
  };
  frontMaskData?: Uint8ClampedArray;
  sideMaskData?: Uint8ClampedArray;
  imageWidth: number;
  imageHeight: number;
  heightInCm: number;
}

export class MeasurementCalculatorService {
  /**
   * Calculate all body measurements from pose analysis
   */
  calculateMeasurements(analysis: PoseAnalysis): RawMeasurements {
    try {
      // Calculate enhanced pixel-to-centimeter conversion ratio
      const pixelToCmRatio = this._calculatePixelToCmRatio(analysis);

      // Calculate basic body dimensions
      const height = analysis.heightInCm;
      const shoulderWidth = this._calculateShoulderWidth(
        analysis.frontLandmarks,
        analysis.imageWidth,
        analysis.imageHeight,
        pixelToCmRatio
      );
      const armLength = this._calculateArmLength(
        analysis.frontLandmarks,
        pixelToCmRatio
      );
      const torsoLength = this._calculateTorsoLength(
        analysis.frontLandmarks,
        pixelToCmRatio
      );
      const inseam = this._calculateInseam(
        analysis.frontLandmarks,
        analysis.imageWidth,
        analysis.imageHeight,
        pixelToCmRatio
      );

      // Calculate circumference measurements using both pose and segmentation
      const bustCircumference = this._calculateBustCircumference(
        analysis,
        pixelToCmRatio
      );
      const waistCircumference = this._calculateWaistCircumference(
        analysis,
        pixelToCmRatio
      );
      const hipCircumference = this._calculateHipCircumference(
        analysis,
        pixelToCmRatio
      );
      const neckCircumference = this._calculateNeckCircumference(
        analysis.frontLandmarks,
        pixelToCmRatio
      );

      // Calculate simplified measurements for bust, waist, hip
      const bust = bustCircumference;
      const waist = waistCircumference;
      const hip = hipCircumference;

      return {
        neck: neckCircumference,
        bust,
        waist,
        hip,
        height,
        shoulderWidth,
        armLength,
        torsoLength,
        inseam,
        neckCircumference,
        bustCircumference,
        waistCircumference,
        hipCircumference,
      };
    } catch (error: any) {
      throw new MeasurementError(
        `Measurement calculation failed: ${error.message}`,
        MEASUREMENT_ERROR_CODES.CALCULATION_ERROR,
        error
      );
    }
  }

  /**
   * Calculate enhanced pixel to centimeter conversion ratio using height reference
   */
  private _calculatePixelToCmRatio(analysis: PoseAnalysis): number {
    try {
      return calculatePixelToCmRatio(
        analysis.heightInCm,
        analysis.imageWidth,
        analysis.imageHeight,
        {
          landmarks: analysis.frontLandmarks,
          maskData: analysis.frontMaskData,
        }
      );
    } catch (error: any) {
      throw new MeasurementError(
        `Failed to calculate pixel-to-cm ratio: ${error.message}`,
        MEASUREMENT_ERROR_CODES.CALCULATION_ERROR,
        error
      );
    }
  }

  /**
   * Calculate shoulder width using enhanced pixel distance
   */
  private _calculateShoulderWidth(
    landmarks: Landmark[],
    imgW: number,
    imgH: number,
    pixelToCmRatio: number
  ): number {
    const leftShoulder = landmarks[PoseLandmarks.LEFT_SHOULDER];
    const rightShoulder = landmarks[PoseLandmarks.RIGHT_SHOULDER];

    if (!leftShoulder || !rightShoulder) {
      throw new Error("Missing shoulder landmarks");
    }

    const shoulderWidthPx = distPx(leftShoulder, rightShoulder, imgW, imgH);
    const shoulderWidthCm = shoulderWidthPx * pixelToCmRatio;
    
    console.log(`Shoulder width: ${shoulderWidthPx.toFixed(1)}px = ${shoulderWidthCm.toFixed(1)}cm`);
    
    return shoulderWidthCm;
  }

  /**
   * Calculate arm length
   */
  private _calculateArmLength(
    landmarks: Landmark[],
    pixelToCmRatio: number
  ): number {
    const leftShoulder = landmarks[PoseLandmarks.LEFT_SHOULDER];
    const leftElbow = landmarks[PoseLandmarks.LEFT_ELBOW];
    const leftWrist = landmarks[PoseLandmarks.LEFT_WRIST];

    const rightShoulder = landmarks[PoseLandmarks.RIGHT_SHOULDER];
    const rightElbow = landmarks[PoseLandmarks.RIGHT_ELBOW];
    const rightWrist = landmarks[PoseLandmarks.RIGHT_WRIST];

    // Calculate both arms and use the one with better visibility
    let armLength = 0;
    let bestConfidence = 0;

    if (leftShoulder && leftElbow && leftWrist) {
      const upperArm = calculateDistance(leftShoulder, leftElbow);
      const forearm = calculateDistance(leftElbow, leftWrist);
      const leftArmLength = upperArm + forearm;
      const leftConfidence = Math.min(
        leftShoulder.visibility!,
        leftElbow.visibility!,
        leftWrist.visibility!
      );

      if (leftConfidence > bestConfidence) {
        armLength = leftArmLength;
        bestConfidence = leftConfidence;
      }
    }

    if (rightShoulder && rightElbow && rightWrist) {
      const upperArm = calculateDistance(rightShoulder, rightElbow);
      const forearm = calculateDistance(rightElbow, rightWrist);
      const rightArmLength = upperArm + forearm;
      const rightConfidence = Math.min(
        rightShoulder.visibility!,
        rightElbow.visibility!,
        rightWrist.visibility!
      );

      if (rightConfidence > bestConfidence) {
        armLength = rightArmLength;
        bestConfidence = rightConfidence;
      }
    }

    if (armLength === 0) {
      throw new Error("Could not calculate arm length from landmarks");
    }

    return armLength * pixelToCmRatio;
  }

  /**
   * Calculate torso length
   */
  private _calculateTorsoLength(
    landmarks: Landmark[],
    pixelToCmRatio: number
  ): number {
    const leftShoulder = landmarks[PoseLandmarks.LEFT_SHOULDER];
    const rightShoulder = landmarks[PoseLandmarks.RIGHT_SHOULDER];
    const leftHip = landmarks[PoseLandmarks.LEFT_HIP];
    const rightHip = landmarks[PoseLandmarks.RIGHT_HIP];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      throw new Error("Missing torso landmarks");
    }

    const shoulderMidpoint = calculateMidpoint(leftShoulder, rightShoulder);
    const hipMidpoint = calculateMidpoint(leftHip, rightHip);

    const pixelDistance = calculateDistance(shoulderMidpoint, hipMidpoint);
    return pixelDistance * pixelToCmRatio;
  }

  /**
   * Calculate inseam (leg length)
   */
  private _calculateInseam(
    landmarks: Landmark[],
    imgW: number,
    imgH: number,
    pixelToCmRatio: number
  ): number {
    const leftHip = landmarks[PoseLandmarks.LEFT_HIP];
    const leftAnkle = landmarks[PoseLandmarks.LEFT_ANKLE];
    const rightHip = landmarks[PoseLandmarks.RIGHT_HIP];
    const rightAnkle = landmarks[PoseLandmarks.RIGHT_ANKLE];

    // Calculate both legs and use the one with better visibility
    let legLengthPx = 0;
    let bestConfidence = 0;

    if (leftHip && leftAnkle) {
      const leftLegPx = distPx(leftHip, leftAnkle, imgW, imgH);
      const leftConfidence = Math.min(
        leftHip.visibility ?? 1,
        leftAnkle.visibility ?? 1
      );

      if (leftConfidence > bestConfidence) {
        legLengthPx = leftLegPx;
        bestConfidence = leftConfidence;
      }
    }

    if (rightHip && rightAnkle) {
      const rightLegPx = distPx(rightHip, rightAnkle, imgW, imgH);
      const rightConfidence = Math.min(
        rightHip.visibility ?? 1,
        rightAnkle.visibility ?? 1
      );

      if (rightConfidence > bestConfidence) {
        legLengthPx = rightLegPx;
        bestConfidence = rightConfidence;
      }
    }

    if (legLengthPx === 0) {
      throw new Error("Could not calculate leg length from landmarks");
    }

    return legLengthPx * pixelToCmRatio;
  }

  /**
   * Calculate bust circumference
   */
  private _calculateBustCircumference(
    analysis: PoseAnalysis,
    pixelToCmRatio: number
  ): number {
    // Combine front and side measurements for better accuracy
    const frontWidthPx = analysis.frontWidthMeasurements.bust.width;
    const sideDepthPx = analysis.sideWidthMeasurements.bust.depth;
    
    const frontWidth = frontWidthPx * pixelToCmRatio;
    const sideDepth = sideDepthPx * pixelToCmRatio;

    console.log(`Bust calculation: frontWidth=${frontWidthPx}px (${frontWidth.toFixed(1)}cm), sideDepth=${sideDepthPx}px (${sideDepth.toFixed(1)}cm), ratio=${pixelToCmRatio.toFixed(4)}`);

    // Use anthropometric proportions to estimate depth if side view is unreliable
    const frontDepth = frontWidth * 0.4; // Typical torso depth ratio

    // Weight the measurements based on confidence
    const frontConfidence = analysis.frontWidthMeasurements.bust.confidence;
    const sideConfidence = analysis.sideWidthMeasurements.bust.confidence;

    const totalConfidence = frontConfidence + sideConfidence;
    const weightedDepth =
      totalConfidence > 0
        ? (frontDepth * frontConfidence + sideDepth * sideConfidence) /
          totalConfidence
        : frontDepth;

    const circumference = calculateCircumference(frontWidth, weightedDepth);
    console.log(`Bust circumference: width=${frontWidth.toFixed(1)}cm, depth=${weightedDepth.toFixed(1)}cm, circumference=${circumference.toFixed(1)}cm`);

    return circumference;
  }

  /**
   * Calculate waist circumference
   */
  private _calculateWaistCircumference(
    analysis: PoseAnalysis,
    pixelToCmRatio: number
  ): number {
    const frontWidth =
      analysis.frontWidthMeasurements.waist.width * pixelToCmRatio;
    const sideDepth =
      analysis.sideWidthMeasurements.waist.depth * pixelToCmRatio;

    // Waist is typically narrower in depth relative to width
    const frontDepth = frontWidth * 0.35;

    const frontConfidence = analysis.frontWidthMeasurements.waist.confidence;
    const sideConfidence = analysis.sideWidthMeasurements.waist.confidence;

    const totalConfidence = frontConfidence + sideConfidence;
    const weightedDepth =
      totalConfidence > 0
        ? (frontDepth * frontConfidence + sideDepth * sideConfidence) /
          totalConfidence
        : frontDepth;

    return calculateCircumference(frontWidth, weightedDepth);
  }

  /**
   * Calculate hip circumference
   */
  private _calculateHipCircumference(
    analysis: PoseAnalysis,
    pixelToCmRatio: number
  ): number {
    const frontWidth =
      analysis.frontWidthMeasurements.hip.width * pixelToCmRatio;
    const sideDepth = analysis.sideWidthMeasurements.hip.depth * pixelToCmRatio;

    // Hips have a more rounded profile
    const frontDepth = frontWidth * 0.45;

    const frontConfidence = analysis.frontWidthMeasurements.hip.confidence;
    const sideConfidence = analysis.sideWidthMeasurements.hip.confidence;

    const totalConfidence = frontConfidence + sideConfidence;
    const weightedDepth =
      totalConfidence > 0
        ? (frontDepth * frontConfidence + sideDepth * sideConfidence) /
          totalConfidence
        : frontDepth;

    return calculateCircumference(frontWidth, weightedDepth);
  }

  /**
   * Calculate neck circumference
   */
  private _calculateNeckCircumference(
    landmarks: Landmark[],
    pixelToCmRatio: number
  ): number {
    // Estimate neck circumference from shoulder width and head position
    const leftShoulder = landmarks[PoseLandmarks.LEFT_SHOULDER];
    const rightShoulder = landmarks[PoseLandmarks.RIGHT_SHOULDER];
    const nose = landmarks[PoseLandmarks.NOSE];

    if (!leftShoulder || !rightShoulder || !nose) {
      throw new Error("Missing landmarks for neck measurement");
    }

    const shoulderWidth =
      calculateDistance(leftShoulder, rightShoulder) * pixelToCmRatio;

    // Neck circumference is typically 15-20% of shoulder width + head width estimation
    const estimatedNeckCircumference = shoulderWidth * 0.18 + 35; // 35cm baseline

    return Math.max(30, Math.min(50, estimatedNeckCircumference)); // Reasonable bounds
  }

  /**
   * Validate measurements for reasonableness
   */
  validateMeasurements(measurements: RawMeasurements): boolean {
    const validationRules = [
      { field: "height", min: 120, max: 220 },
      { field: "bust", min: 60, max: 160 },
      { field: "waist", min: 50, max: 150 },
      { field: "hip", min: 70, max: 170 },
      { field: "shoulderWidth", min: 25, max: 70 },
      { field: "armLength", min: 45, max: 90 },
      { field: "torsoLength", min: 35, max: 75 },
      { field: "inseam", min: 60, max: 110 },
    ];

    for (const rule of validationRules) {
      const value = measurements[rule.field as keyof RawMeasurements];
      if (typeof value === "number" && (value < rule.min || value > rule.max)) {
        console.warn(
          `Measurement validation warning: ${rule.field} = ${value}cm is outside normal range [${rule.min}, ${rule.max}]`
        );
        return false;
      }
    }

    // Check proportional relationships
    const proportionChecks = [
      // Bust should be larger than waist
      measurements.bustCircumference > measurements.waistCircumference,
      // Hip should be larger than waist
      measurements.hipCircumference > measurements.waistCircumference,
      // Torso + legs should approximate height
      measurements.torsoLength + measurements.inseam <
        measurements.height * 1.2,
      measurements.torsoLength + measurements.inseam >
        measurements.height * 0.8,
    ];

    return proportionChecks.every((check) => check);
  }

  /**
   * Apply smoothing to measurements
   */
  smoothMeasurements(
    currentMeasurements: RawMeasurements,
    previousMeasurements?: RawMeasurements,
    smoothingFactor = 0.7
  ): RawMeasurements {
    if (!previousMeasurements) {
      return currentMeasurements;
    }

    const smoothedMeasurements: RawMeasurements = { ...currentMeasurements };

    // Apply smoothing to each measurement
    Object.keys(currentMeasurements).forEach((key) => {
      const current = currentMeasurements[key as keyof RawMeasurements];
      const previous = previousMeasurements[key as keyof RawMeasurements];

      if (typeof current === "number" && typeof previous === "number") {
        (smoothedMeasurements as any)[key] = smoothMeasurement(
          current,
          previous,
          smoothingFactor
        );
      }
    });

    return smoothedMeasurements;
  }
}
