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

/**
 * Convert RGB values to a skin tone name
 */
function getSkinToneName(r: number, g: number, b: number): string {
  // Simple skin tone classification based on RGB values
  const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180 / Math.PI;
  const saturation = 1 - 3 * Math.min(r, g, b) / (r + g + b);
  console.log("Hue:", hue);
  console.log("Saturation:", saturation);
  const lightness = (r + g + b) / (3 * 255);

  if (lightness < 0.2) return "Deep";
  if (lightness < 0.35) return "Dark";
  if (lightness < 0.5) return "Medium";
  if (lightness < 0.65) return "Olive";
  if (lightness < 0.8) return "Light";
  if (lightness < 0.9) return "Fair";
  return "Porcelain";
}

/**
 * Extract dominant skin tone from an image given a bounding box (e.g. cheek region)
 */
async function extractSkinTone(
  buffer: Buffer,
  bbox: { x: number; y: number; width: number; height: number }
): Promise<{ hex: string; rgb: { r: number; g: number; b: number }; name: string }> {
  const image = await decode(buffer);
  const roi = image.crop(bbox); // crop to cheek area

  const pixels: number[][] = [];
  for (let y = 0; y < roi.height; y++) {
    for (let x = 0; x < roi.width; x++) {
      const [r, g, b] = roi.getPixel(x, y);

      // filter shadows & highlights (skip very dark or very bright pixels)
      const brightness = (r + g + b) / 3;
      if (brightness > 40 && brightness < 220) {
        pixels.push([r, g, b]);
      }
    }
  }

  if (pixels.length === 0) throw new Error("No valid skin pixels found");

  // Compute median color (less sensitive to noise than average)
  const median = [0, 1, 2].map((i) =>
    pixels.map((p) => p[i]).sort((a, b) => a - b)[
      Math.floor(pixels.length / 2)
    ]
  );

  const [r, g, b] = median;
  const name = getSkinToneName(r, g, b);
  
  return { 
    hex: rgbToHex(r, g, b), 
    rgb: { r, g, b },
    name 
  };
}

/**
 * Get cheek bounding box from face landmarks
 */
function getCheekBBox(landmarks: Landmark[], imgW: number, imgH: number): { x: number; y: number; width: number; height: number } {
  // Use face landmarks to determine cheek area
  // These are approximate landmark indices - adjust based on your pose detection model
  const leftCheek = landmarks[234]; // sample landmark index
  const rightCheek = landmarks[454];

  if (!leftCheek || !rightCheek) {
    // Fallback to a general face area if specific cheek landmarks aren't available
    const nose = landmarks[1]; // nose tip
    if (nose) {
      return {
        x: Math.round((nose.x - 0.1) * imgW),
        y: Math.round((nose.y - 0.05) * imgH),
        width: Math.round(0.2 * imgW),
        height: Math.round(0.1 * imgH)
      };
    }
    
    // Ultimate fallback - center of image
    return {
      x: Math.round(0.4 * imgW),
      y: Math.round(0.3 * imgH),
      width: Math.round(0.2 * imgW),
      height: Math.round(0.2 * imgH)
    };
  }

  const x = Math.min(leftCheek.x, rightCheek.x) * imgW;
  const y = Math.min(leftCheek.y, rightCheek.y) * imgH;
  const w = Math.abs(rightCheek.x - leftCheek.x) * imgW;
  const h = 0.25 * imgH; // small patch height

  return { 
    x: Math.round(x), 
    y: Math.round(y), 
    width: Math.round(w), 
    height: Math.round(h) 
  };
}

/**
 * Extract skin tone from uploaded photo
 */
export async function extractSkinToneFromPhoto(
  photo: File,
  landmarks?: Landmark[],
  imageWidth = 512,
  imageHeight = 512
): Promise<{ hex: string; rgb: { r: number; g: number; b: number }; name: string }> {
  const arrayBuffer = await photo.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  let bbox: { x: number; y: number; width: number; height: number };
  
  if (landmarks && landmarks.length > 0) {
    bbox = getCheekBBox(landmarks, imageWidth, imageHeight);
  } else {
    // Default face area if no landmarks available
    bbox = {
      x: Math.round(0.3 * imageWidth),
      y: Math.round(0.2 * imageHeight),
      width: Math.round(0.4 * imageWidth),
      height: Math.round(0.3 * imageHeight)
    };
  }
  
  try {
    return await extractSkinTone(buffer, bbox);
  } catch (error) {
    console.warn('Skin tone extraction failed, using fallback:', error);
    // Fallback skin tone
    return {
      hex: "#D4A574",
      rgb: { r: 212, g: 165, b: 116 },
      name: "Medium"
    };
  }
}

export { rgbToHex, getSkinToneName };
