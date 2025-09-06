/**
 * Example Usage of Measurement Service
 * This file demonstrates how to use the measurement service to extract body measurements
 */

import {
  MeasurementService,
  createMeasurementService,
  quickMeasurementExtraction,
  validateDependencies,
  type PhotoInput,
  type MeasurementResult,
} from './index';

/**
 * Example 1: Basic usage with manual service management
 */
export async function basicMeasurementExample(
  frontPhotoFile: File,
  sidePhotoFile: File,
  heightInCm: number
): Promise<MeasurementResult> {
  // Validate dependencies first
  const validation = validateDependencies();
  if (!validation.isValid) {
    throw new Error(`Missing dependencies: ${validation.missing.join(', ')}`);
  }

  // Create measurement service with custom configuration
  const measurementService = createMeasurementService({
    poseDetectionThreshold: 0.7,
    segmentationThreshold: 0.8,
    smoothingFactor: 0.8,
  });

  try {
    // Initialize the service with progress tracking
    await measurementService.initialize((progress, stage) => {
      console.log(`Initialization: ${stage} - ${Math.round(progress * 100)}%`);
    });

    // Prepare input
    const input: PhotoInput = {
      frontPhoto: frontPhotoFile,
      sidePhoto: sidePhotoFile,
      heightInCm,
    };

    // Extract measurements with progress tracking
    const result = await measurementService.extractMeasurements(
      input,
      (progress, stage) => {
        console.log(`Processing: ${stage} - ${Math.round(progress * 100)}%`);
      }
    );

    console.log('Measurement Results:', {
      bust: `${result.measurements.bust.toFixed(1)}cm`,
      waist: `${result.measurements.waist.toFixed(1)}cm`,
      hip: `${result.measurements.hip.toFixed(1)}cm`,
      height: `${result.measurements.height.toFixed(1)}cm`,
      dressSize: result.dressSize,
      confidence: `${(result.confidence * 100).toFixed(1)}%`,
    });

    return result;
  } finally {
    // Always dispose of resources
    measurementService.dispose();
  }
}

/**
 * Example 2: Quick measurement extraction (recommended for one-time use)
 */
export async function quickMeasurementExample(
  frontPhotoFile: File,
  sidePhotoFile: File,
  heightInCm: number
): Promise<MeasurementResult> {
  const input: PhotoInput = {
    frontPhoto: frontPhotoFile,
    sidePhoto: sidePhotoFile,
    heightInCm,
  };

  // One-liner for quick measurements
  return await quickMeasurementExtraction(
    input,
    (progress, stage) => {
      console.log(`${stage}: ${Math.round(progress * 100)}%`);
    },
    {
      poseDetectionThreshold: 0.6,
      segmentationThreshold: 0.7,
    }
  );
}

/**
 * Example 3: Advanced usage with error handling and retries
 */
export async function advancedMeasurementExample(
  frontPhotoFile: File,
  sidePhotoFile: File,
  heightInCm: number
): Promise<MeasurementResult> {
  const measurementService = createMeasurementService();

  try {
    await measurementService.initialize();

    const input: PhotoInput = {
      frontPhoto: frontPhotoFile,
      sidePhoto: sidePhotoFile,
      heightInCm,
    };

    // Use retry logic for better reliability
    const result = await measurementService.extractMeasurementsWithRetry(
      input,
      3, // max retries
      (progress, stage) => {
        console.log(`${stage}: ${Math.round(progress * 100)}%`);
      }
    );

    // Get additional size recommendations
    const sizeRecommendations = measurementService.getSizeRecommendations(
      result.measurements
    );

    // Check if measurements are between sizes
    const betweenSizes = measurementService.isBetweenSizes(
      result.measurements,
      'US'
    );

    console.log('Advanced Results:', {
      basicMeasurements: result.measurements,
      dressSize: result.dressSize,
      sizeRecommendations: sizeRecommendations.us.slice(0, 3),
      betweenSizes,
      confidence: result.confidence,
    });

    return result;
  } finally {
    measurementService.dispose();
  }
}

/**
 * Example 4: Using with HTML Canvas elements
 */
export async function canvasMeasurementExample(
  frontCanvas: HTMLCanvasElement,
  sideCanvas: HTMLCanvasElement,
  heightInCm: number
): Promise<MeasurementResult> {
  const input: PhotoInput = {
    frontPhoto: frontCanvas,
    sidePhoto: sideCanvas,
    heightInCm,
  };

  return await quickMeasurementExtraction(input);
}

/**
 * Example 5: Processing images from URLs
 */
export async function urlMeasurementExample(
  frontImageUrl: string,
  sideImageUrl: string,
  heightInCm: number
): Promise<MeasurementResult> {
  // Helper function to load image from URL
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle CORS
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  try {
    // Load both images
    const [frontImage, sideImage] = await Promise.all([
      loadImage(frontImageUrl),
      loadImage(sideImageUrl),
    ]);

    const input: PhotoInput = {
      frontPhoto: frontImage,
      sidePhoto: sideImage,
      heightInCm,
    };

    return await quickMeasurementExtraction(input);
  } catch (error) {
    throw new Error(`Failed to load images: ${error}`);
  }
}

/**
 * Example 6: Batch processing multiple measurements
 */
export async function batchMeasurementExample(
  measurements: Array<{
    frontPhoto: File;
    sidePhoto: File;
    heightInCm: number;
    id: string;
  }>
): Promise<Array<{ id: string; result: MeasurementResult | Error }>> {
  const measurementService = createMeasurementService();
  
  try {
    await measurementService.initialize();

    const results = [];

    for (const measurement of measurements) {
      try {
        const result = await measurementService.extractMeasurements({
          frontPhoto: measurement.frontPhoto,
          sidePhoto: measurement.sidePhoto,
          heightInCm: measurement.heightInCm,
        });
        
        results.push({ id: measurement.id, result });
      } catch (error) {
        results.push({ id: measurement.id, result: error as Error });
      }
    }

    return results;
  } finally {
    measurementService.dispose();
  }
}

/**
 * Example 7: Real-time camera measurement (conceptual)
 */
export async function realTimeMeasurementExample(): Promise<void> {
  const measurementService = createMeasurementService();
  
  try {
    await measurementService.initialize();

    // Get camera stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });

    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();

    // Capture function
    const captureFrame = (): HTMLCanvasElement => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0);
      return canvas;
    };

    console.log('Ready to capture. Implement your capture logic here.');
    console.log('Call captureFrame() to get the current frame as canvas.');
    
    // Example: capture front photo, then side photo
    // const frontPhoto = captureFrame();
    // await delay(5000); // Wait for user to turn to side
    // const sidePhoto = captureFrame();
    
    // const result = await measurementService.extractMeasurements({
    //   frontPhoto,
    //   sidePhoto,
    //   heightInCm: 170, // Get from user input
    // });

  } finally {
    measurementService.dispose();
  }
}

/**
 * Utility function for delays
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
