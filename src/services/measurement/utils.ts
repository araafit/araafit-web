/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Measurement Service Utilities
 * Helper functions for image processing, calculations, and data validation
 */

import {
  type Landmark,
  type ImagePreprocessingOptions,
  MeasurementError,
} from "./types";
import { MEASUREMENT_ERROR_CODES, DEFAULT_IMAGE_PREPROCESSING } from "./config";

/**
 * Calculate Euclidean distance between two landmarks
 */
export function calculateDistance(point1: Landmark, point2: Landmark): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  const dz = (point1.z || 0) - (point2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Convert landmark normalized coordinates to pixel coordinates
 */
export function lmToPx(lm: Landmark, imgW: number, imgH: number): { x: number; y: number } {
  return { x: lm.x * imgW, y: lm.y * imgH }; // ignore z for pixel geometry
}

/**
 * Calculate pixel distance between two landmarks
 */
export function distPx(p1: Landmark, p2: Landmark, imgW: number, imgH: number): number {
  const a = lmToPx(p1, imgW, imgH);
  const b = lmToPx(p2, imgW, imgH);
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

/**
 * Compute body pixel height using segmentation mask extents.
 * mask should be ImageData from toBinaryMask where alpha > 0 = person.
 */
export function pixelHeightFromMask(
  maskData: Uint8ClampedArray,
  imgW: number,
  imgH: number,
  threshold = 0.5
): number | null {
  let top = imgH, bottom = -1;
  
  // ImageData has RGBA format, so we check alpha channel (every 4th byte)
  for (let y = 0; y < imgH; y++) {
    for (let x = 0; x < imgW; x++) {
      const pixelIndex = (y * imgW + x) * 4;
      const alpha = maskData[pixelIndex + 3]; // Alpha channel
      
      if (alpha > threshold * 255) { // Alpha is 0-255, threshold is 0-1
        top = Math.min(top, y); 
        break; 
      }
    }
  }
  
  for (let y = imgH - 1; y >= 0; y--) {
    for (let x = 0; x < imgW; x++) {
      const pixelIndex = (y * imgW + x) * 4;
      const alpha = maskData[pixelIndex + 3]; // Alpha channel
      
      if (alpha > threshold * 255) { 
        bottom = Math.max(bottom, y); 
        break; 
      }
    }
  }
  
  const h = bottom - top;
  console.log(`Mask height calculation: top=${top}, bottom=${bottom}, height=${h}`);
  return (h > 0) ? h : null;
}

/**
 * Fallback pixel height using landmarks only (min head landmark y to max foot/heel y).
 */
export function pixelHeightFromLandmarks(
  landmarks: Landmark[],
  imgW: number,
  imgH: number
): number | null {
  const headCandidates = [
    7, // LEFT_EAR
    8, // RIGHT_EAR
    2, // LEFT_EYE
    5, // RIGHT_EYE
    0, // NOSE
  ].map(i => landmarks[i]).filter(Boolean);

  const footCandidates = [
    31, // LEFT_FOOT_INDEX
    32, // RIGHT_FOOT_INDEX
    29, // LEFT_HEEL
    30, // RIGHT_HEEL
    27, // LEFT_ANKLE
    28, // RIGHT_ANKLE
  ].map(i => landmarks[i]).filter(Boolean);

  if (!headCandidates.length || !footCandidates.length) return null;

  const minHeadY = Math.min(...headCandidates.map(lm => lmToPx(lm, imgW, imgH).y));
  const maxFootY = Math.max(...footCandidates.map(lm => lmToPx(lm, imgW, imgH).y));

  // tiny upward offset to approximate crown above eyes/ears (about 3–4% of body height)
  const approxCrownOffset = 0.035 * (maxFootY - minHeadY);
  const pixelHeight = (maxFootY - (minHeadY - approxCrownOffset));

  return (pixelHeight > 0) ? pixelHeight : null;
}

/**
 * Enhanced pixel→cm ratio using user height. Prefer mask extent; fallback to landmarks.
 */
export function calculatePixelToCmRatio(
  actualHeightCm: number,
  imgW: number,
  imgH: number,
  opts: { landmarks?: Landmark[]; maskData?: Uint8ClampedArray }
): number {
  let pixelHeight: number | null = null;

  if (opts.maskData) {
    console.log('Calculating pixel height from mask...');
    pixelHeight = pixelHeightFromMask(opts.maskData, imgW, imgH);
    console.log(`Mask-based pixel height: ${pixelHeight}`);
  }
  
  if (!pixelHeight && opts.landmarks) {
    console.log('Falling back to landmark-based pixel height...');
    pixelHeight = pixelHeightFromLandmarks(opts.landmarks, imgW, imgH);
    console.log(`Landmark-based pixel height: ${pixelHeight}`);
  }
  
  if (!pixelHeight || pixelHeight <= 0) {
    throw new Error("Unable to determine full body pixel height (head/feet likely cropped).");
  }

  const ratio = actualHeightCm / pixelHeight;
  console.log(`Enhanced pixel-to-CM conversion: ${pixelHeight.toFixed(2)}px height -> ${actualHeightCm}cm height, ratio: ${ratio.toFixed(4)}`);
  
  return ratio;
}

/**
 * Calculate the midpoint between two landmarks
 */
export function calculateMidpoint(
  point1: Landmark,
  point2: Landmark
): Landmark {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
    z: ((point1.z || 0) + (point2.z || 0)) / 2,
    visibility: Math.min(point1.visibility || 1, point2.visibility || 1),
  };
}

/**
 * Convert pixel measurements to centimeters using height reference
 */
export function pixelsToCentimeters(
  pixelMeasurement: number,
  pixelHeight: number,
  actualHeightCm: number
): number {
  if (pixelHeight <= 0 || actualHeightCm <= 0) {
    throw new MeasurementError(
      "Invalid height values for pixel conversion",
      MEASUREMENT_ERROR_CODES.CALCULATION_ERROR
    );
  }

  const pixelToCmRatio = actualHeightCm / pixelHeight;
  return pixelMeasurement * pixelToCmRatio;
}

/**
 * Validate landmarks confidence and visibility
 */
export function validateLandmarks(
  landmarks: Landmark[],
  requiredIndices: number[],
  minConfidence: number = 0.5
): boolean {
  return requiredIndices.every((index) => {
    const landmark = landmarks[index];
    if (!landmark) return false;

    const confidence = landmark.visibility || 1;
    return confidence >= minConfidence;
  });
}

/**
 * Smooth measurements using weighted average
 */
export function smoothMeasurement(
  currentValue: number,
  previousValue: number,
  weight: number = 0.7
): number {
  return weight * currentValue + (1 - weight) * previousValue;
}

/**
 * Check if a value is an outlier based on standard deviation
 */
export function isOutlier(
  value: number,
  mean: number,
  standardDeviation: number,
  threshold: number = 2.0
): boolean {
  const zScore = Math.abs(value - mean) / standardDeviation;
  return zScore > threshold;
}

/**
 * Calculate circumference from width and depth measurements
 * Uses ellipse approximation: C ≈ π(3(a+b) - √((3a+b)(a+3b)))
 */
export function calculateCircumference(width: number, depth: number): number {
  const a = width / 2;
  const b = depth / 2;

  // Ramanujan's approximation for ellipse perimeter
  const h = Math.pow((a - b) / (a + b), 2);
  const circumference =
    Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  return circumference;
}

/**
 * Preprocess image for model input
 * Note: Accepts Blob (including File) since browser-image-compression can return either
 */
export async function preprocessImage(
  image: File | Blob | HTMLImageElement | HTMLCanvasElement,
  options: ImagePreprocessingOptions = DEFAULT_IMAGE_PREPROCESSING
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new MeasurementError(
          "Failed to create canvas context",
          MEASUREMENT_ERROR_CODES.IMAGE_PROCESSING_ERROR
        );
      }

      let sourceElement: HTMLImageElement | HTMLCanvasElement;

      // Check for Blob (which includes File since File extends Blob)
      // This handles both File objects and Blob objects from image compression libraries
      if (image instanceof Blob) {
        const img = new Image();
        img.onload = () => {
          processImageElement(img, canvas, ctx, options);
          URL.revokeObjectURL(img.src); // Clean up the object URL
          resolve(canvas);
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src); // Clean up the object URL
          reject(
            new MeasurementError(
              "Failed to load image file",
              MEASUREMENT_ERROR_CODES.IMAGE_PROCESSING_ERROR
            )
          );
        };
        img.src = URL.createObjectURL(image);
      } else {
        sourceElement = image;
        processImageElement(sourceElement, canvas, ctx, options);
        resolve(canvas);
      }
    } catch (error: any) {
      reject(
        new MeasurementError(
          `Image preprocessing failed: ${error.message}`,
          MEASUREMENT_ERROR_CODES.IMAGE_PROCESSING_ERROR,
          error
        )
      );
    }
  });
}

/**
 * Process image element onto canvas with specified options
 */
function processImageElement(
  sourceElement: HTMLImageElement | HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: ImagePreprocessingOptions
): void {
  const { targetWidth, targetHeight, maintainAspectRatio, backgroundColor } =
    options;

  let sourceWidth: number;
  let sourceHeight: number;

  if (sourceElement instanceof HTMLImageElement) {
    sourceWidth = sourceElement.naturalWidth;
    sourceHeight = sourceElement.naturalHeight;
  } else {
    sourceWidth = sourceElement.width;
    sourceHeight = sourceElement.height;
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  let drawWidth = targetWidth;
  let drawHeight = targetHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (maintainAspectRatio) {
    const aspectRatio = sourceWidth / sourceHeight;
    const targetAspectRatio = targetWidth / targetHeight;

    if (aspectRatio > targetAspectRatio) {
      // Image is wider, fit to width
      drawHeight = targetWidth / aspectRatio;
      offsetY = (targetHeight - drawHeight) / 2;
    } else {
      // Image is taller, fit to height
      drawWidth = targetHeight * aspectRatio;
      offsetX = (targetWidth - drawWidth) / 2;
    }
  }

  ctx.drawImage(sourceElement, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * Calculate angle between three points
 */
export function calculateAngle(
  point1: Landmark,
  vertex: Landmark,
  point2: Landmark
): number {
  const vector1 = {
    x: point1.x - vertex.x,
    y: point1.y - vertex.y,
  };

  const vector2 = {
    x: point2.x - vertex.x,
    y: point2.y - vertex.y,
  };

  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

  const cosineAngle = dotProduct / (magnitude1 * magnitude2);
  return Math.acos(Math.max(-1, Math.min(1, cosineAngle)));
}

/**
 * Validate input parameters
 */
export function validateInput(
  frontPhoto: File | Blob | HTMLImageElement | HTMLCanvasElement,
  sidePhoto: File | Blob | HTMLImageElement | HTMLCanvasElement,
  heightInCm: number
): void {
  if (!frontPhoto || !sidePhoto) {
    throw new MeasurementError(
      "Both front and side photos are required",
      MEASUREMENT_ERROR_CODES.INVALID_INPUT
    );
  }

  if (typeof heightInCm !== "number" || heightInCm <= 0 || heightInCm > 300) {
    throw new MeasurementError(
      "Height must be a positive number between 1 and 300 cm",
      MEASUREMENT_ERROR_CODES.INVALID_HEIGHT
    );
  }
}

/**
 * Calculate statistical measures for measurement validation
 */
export function calculateStatistics(values: number[]): {
  mean: number;
  standardDeviation: number;
  median: number;
  min: number;
  max: number;
} {
  if (values.length === 0) {
    throw new MeasurementError(
      "Cannot calculate statistics for empty array",
      MEASUREMENT_ERROR_CODES.CALCULATION_ERROR
    );
  }

  const sortedValues = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const standardDeviation = Math.sqrt(variance);

  const median =
    sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] +
          sortedValues[sortedValues.length / 2]) /
        2
      : sortedValues[Math.floor(sortedValues.length / 2)];

  return {
    mean,
    standardDeviation,
    median,
    min: sortedValues[0],
    max: sortedValues[sortedValues.length - 1],
  };
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
