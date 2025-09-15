import { decode } from "image-js";
import type { Landmark } from "./types";

/**
 * Convert RGB → HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Skin tone mapping for manual measurement component
const MANUAL_SKIN_TONES = [
  { name: "deep", color: "#33251c" },
  { name: "dark", color: "#55322e" },
  { name: "medium", color: "#8c5a47" },
  { name: "tan", color: "#b0522d" },
  { name: "light", color: "#c4976c" },
  { name: "fair", color: "#deb588" },
];

// Skin tone mapping for admin inventory (fabric recommendations)
const INVENTORY_SKIN_TONES = [
  "Porcelin", "Ivory", "Sand", "Espresso", "Chestnut", "Honey"
];

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate color distance between two RGB colors
 */
function colorDistance(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Convert RGB values to a skin tone name using color matching
 */
function getSkinToneName(r: number, g: number, b: number): string {
  const inputRgb = { r, g, b };
  
  // Find the closest match from our defined skin tones
  let closestTone = MANUAL_SKIN_TONES[0];
  let minDistance = Number.MAX_VALUE;
  
  for (const tone of MANUAL_SKIN_TONES) {
    const toneRgb = hexToRgb(tone.color);
    if (toneRgb) {
      const distance = colorDistance(inputRgb, toneRgb);
      if (distance < minDistance) {
        minDistance = distance;
        closestTone = tone;
      }
    }
  }
  
  return closestTone.name;
}

/**
 * Advanced skin tone classification using multiple factors
 */
function getAdvancedSkinToneName(r: number, g: number, b: number): string {
  // Calculate various color properties
  const lightness = (r + g + b) / (3 * 255);
  const maxComponent = Math.max(r, g, b);
  const minComponent = Math.min(r, g, b);
  
  // Calculate skin tone hue (simplified HSV hue calculation)
  let hue = 0;
  if (maxComponent !== minComponent) {
    const delta = maxComponent - minComponent;
    if (maxComponent === r) {
      hue = ((g - b) / delta) % 6;
    } else if (maxComponent === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  
  // Use color matching as primary method
  const colorMatchTone = getSkinToneName(r, g, b);
  
  // Validate with lightness-based classification
  let lightnessBasedTone: string;
  if (lightness < 0.25) {
    lightnessBasedTone = "deep";
  } else if (lightness < 0.4) {
    lightnessBasedTone = "dark";
  } else if (lightness < 0.55) {
    lightnessBasedTone = "medium";
  } else if (lightness < 0.7) {
    lightnessBasedTone = "tan";
  } else if (lightness < 0.85) {
    lightnessBasedTone = "light";
  } else {
    lightnessBasedTone = "fair";
  }
  
  // For very dark or very light tones, prefer lightness-based classification
  if (lightness < 0.2 || lightness > 0.9) {
    return lightnessBasedTone;
  }
  
  // Otherwise, use color matching result
  return colorMatchTone;
}

/**
 * Extract dominant skin tone from an image given a bounding box (e.g. face/cheek region)
 */
async function extractSkinTone(
  buffer: Uint8Array,
  bbox: { x: number; y: number; width: number; height: number }
): Promise<{ hex: string; rgb: { r: number; g: number; b: number }; name: string }> {
  const image = await decode(buffer);
  
  // Ensure bbox is within image bounds
  const clampedBbox = {
    x: Math.max(0, Math.min(bbox.x, image.width - 1)),
    y: Math.max(0, Math.min(bbox.y, image.height - 1)),
    width: Math.max(1, Math.min(bbox.width, image.width - bbox.x)),
    height: Math.max(1, Math.min(bbox.height, image.height - bbox.y))
  };
  
  const roi = image.crop(clampedBbox);

  const pixels: number[][] = [];
  const skinPixels: number[][] = [];
  
  for (let y = 0; y < roi.height; y++) {
    for (let x = 0; x < roi.width; x++) {
      const [r, g, b] = roi.getPixel(x, y);

      // Basic skin tone filtering (avoid extreme shadows and highlights)
      const brightness = (r + g + b) / 3;
      if (brightness > 30 && brightness < 230) {
        pixels.push([r, g, b]);
        
        // Additional skin tone filtering using HSV
        const hsv = rgbToHsv(r, g, b);
        // Skin tone typically falls within these HSV ranges
        if (hsv.h >= 0 && hsv.h <= 50 && hsv.s >= 0.1 && hsv.s <= 0.7 && hsv.v >= 0.2 && hsv.v <= 0.9) {
          skinPixels.push([r, g, b]);
        }
      }
    }
  }

  // Use skin-filtered pixels if we have enough, otherwise use all valid pixels
  const validPixels = skinPixels.length > 10 ? skinPixels : pixels;
  
  if (validPixels.length === 0) {
    throw new Error("No valid skin pixels found in the specified region");
  }

  // Calculate median color (more robust than average for skin tone detection)
  const median = [0, 1, 2].map((i) => {
    const sorted = validPixels.map((p) => p[i]).sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  });

  const [r, g, b] = median;
  const name = getAdvancedSkinToneName(r, g, b);
  
  console.log(`Detected skin tone: RGB(${r}, ${g}, ${b}) -> ${name}`);
  
  return { 
    hex: rgbToHex(r, g, b), 
    rgb: { r, g, b },
    name 
  };
}

/**
 * Convert RGB to HSV color space
 */
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  
  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  
  const s = max === 0 ? 0 : delta / max;
  const v = max;
  
  return { h, s, v };
}

/**
 * Get face/forehead bounding box from pose landmarks for skin tone extraction
 */
function getFaceBBox(landmarks: Landmark[], imgW: number, imgH: number): { x: number; y: number; width: number; height: number } {
  // For pose detection models, we typically have body landmarks, not detailed face landmarks
  // We'll try to use head/face area landmarks if available
  
  // Try to find face-related landmarks (nose, eyes, ears)
  const nose = landmarks[0]; // Nose tip (MediaPipe pose landmark 0)
  const leftEye = landmarks[2]; // Left eye (MediaPipe pose landmark 2)
  const rightEye = landmarks[5]; // Right eye (MediaPipe pose landmark 5)
  const leftEar = landmarks[7]; // Left ear (MediaPipe pose landmark 7)
  const rightEar = landmarks[8]; // Right ear (MediaPipe pose landmark 8)
  
  // If we have eye landmarks, use them to define face area
  if (leftEye && rightEye) {
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;
    const eyeDistance = Math.abs(rightEye.x - leftEye.x);
    
    // Define forehead area above the eyes for skin tone extraction
    return {
      x: Math.round((eyeCenterX - eyeDistance * 0.6) * imgW),
      y: Math.round((eyeCenterY - eyeDistance * 0.8) * imgH), // Above eyes
      width: Math.round(eyeDistance * 1.2 * imgW),
      height: Math.round(eyeDistance * 0.6 * imgH)
    };
  }
  
  // If we have nose landmark, use it as center
  if (nose) {
    return {
      x: Math.round((nose.x - 0.15) * imgW),
      y: Math.round((nose.y - 0.2) * imgH), // Above nose for forehead area
      width: Math.round(0.3 * imgW),
      height: Math.round(0.15 * imgH)
    };
  }
  
  // If we have ear landmarks, estimate face area between them
  if (leftEar && rightEar) {
    const earCenterX = (leftEar.x + rightEar.x) / 2;
    const earCenterY = (leftEar.y + rightEar.y) / 2;
    const earDistance = Math.abs(rightEar.x - leftEar.x);
    
    return {
      x: Math.round((earCenterX - earDistance * 0.3) * imgW),
      y: Math.round((earCenterY - earDistance * 0.2) * imgH),
      width: Math.round(earDistance * 0.6 * imgW),
      height: Math.round(earDistance * 0.3 * imgH)
    };
  }
  
  // Ultimate fallback - assume face is in upper center of image
  return {
    x: Math.round(0.35 * imgW),
    y: Math.round(0.15 * imgH), // Upper portion for face area
    width: Math.round(0.3 * imgW),
    height: Math.round(0.25 * imgH)
  };
}

/**
 * Extract skin tone from uploaded photo using pose landmarks
 */
export async function extractSkinToneFromPhoto(
  photo: File,
  landmarks?: Landmark[],
  imageWidth?: number,
  imageHeight?: number
): Promise<{ hex: string; rgb: { r: number; g: number; b: number }; name: string }> {
  const arrayBuffer = await photo.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  
  // Decode image to get actual dimensions if not provided
  let actualWidth = imageWidth;
  let actualHeight = imageHeight;
  
  if (!actualWidth || !actualHeight) {
    try {
      const tempImage = await decode(buffer);
      actualWidth = tempImage.width;
      actualHeight = tempImage.height;
    } catch {
      console.warn('Could not get image dimensions, using defaults');
      actualWidth = 512;
      actualHeight = 512;
    }
  }
  
  let bbox: { x: number; y: number; width: number; height: number };
  
  if (landmarks && landmarks.length > 0) {
    bbox = getFaceBBox(landmarks, actualWidth, actualHeight);
    console.log('Using landmark-based face detection:', bbox);
  } else {
    // Default face area if no landmarks available - focus on forehead area
    bbox = {
      x: Math.round(0.3 * actualWidth),
      y: Math.round(0.1 * actualHeight), // Upper area for forehead
      width: Math.round(0.4 * actualWidth),
      height: Math.round(0.25 * actualHeight)
    };
    console.log('Using default face area:', bbox);
  }
  
  try {
    const result = await extractSkinTone(buffer, bbox);
    console.log('Skin tone extraction successful:', result);
    return result;
  } catch (error) {
    console.warn('Skin tone extraction failed, using fallback:', error);
    // Return a medium tone as fallback
    return {
      hex: "#8c5a47",
      rgb: { r: 140, g: 90, b: 71 },
      name: "medium"
    };
  }
}

export { 
  rgbToHex, 
  getSkinToneName, 
  getAdvancedSkinToneName,
  MANUAL_SKIN_TONES,
  INVENTORY_SKIN_TONES 
};
