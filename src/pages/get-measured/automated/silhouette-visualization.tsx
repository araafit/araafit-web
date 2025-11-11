import { useRef, useEffect, useState } from "react";
import type { Landmark } from "../../../services/measurement/types";
import { pixelHeightFromMask, pixelHeightFromLandmarks } from "../../../services/measurement/utils";
import { POSITION_OFFSETS } from "../../../services/measurement";

interface SilhouetteVisualizationProps {
  frontPhoto: File;
  sidePhoto: File;
  frontMask?: ImageData;
  sideMask?: ImageData;
  frontLandmarks?: Landmark[];
  sideLandmarks?: Landmark[];
  heightInCm?: number;
}

export function SilhouetteVisualization({
  frontPhoto,
  sidePhoto,
  frontMask,
  sideMask,
  frontLandmarks,
  sideLandmarks,
  heightInCm,
}: SilhouetteVisualizationProps) {
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const sideCanvasRef = useRef<HTMLCanvasElement>(null);
  const [measurements, setMeasurements] = useState<{
    bust: { width: number; depth: number; circumference: number };
    waist: { width: number; depth: number; circumference: number };
    hip: { width: number; depth: number; circumference: number };
    pixelToCmRatio: number;
  } | null>(null);
  
  // No cross-view reuse of Y positions; compute independently per view

  useEffect(() => {
    if (frontMask && frontCanvasRef.current) {
      drawVisualization(
        frontCanvasRef.current,
        frontPhoto,
        frontMask,
        frontLandmarks,
        "mask",
        true
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontPhoto, frontMask, frontLandmarks]);

  useEffect(() => {
    if (sideMask && sideCanvasRef.current) {
      drawVisualization(
        sideCanvasRef.current,
        sidePhoto,
        sideMask,
        sideLandmarks,
        "mask",
        false
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidePhoto, sideMask, sideLandmarks]);

  // Calculate measurements when data is available
  useEffect(() => {
    if (frontMask && sideMask && heightInCm && frontLandmarks && sideLandmarks) {
      calculateMeasurements();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontMask, sideMask, heightInCm, frontLandmarks, sideLandmarks]);

  // --- helpers: put these near the top of the file or below your other helpers --- //

  const ALPHA_THRESHOLD = 128;

  /**
   * Calculate circumference from width and depth measurements
   * Uses ellipse approximation: Ramanujan's formula
   */
  const calculateCircumference = (width: number, depth: number): number => {
    const a = width / 2;
    const b = depth / 2;

    // Ramanujan's approximation for ellipse perimeter
    const h = Math.pow((a - b) / (a + b), 2);
    const circumference =
      Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

    return circumference;
  };

  /**
   * Extract pose-based torso measurements (aligned with waist-anchor offsets)
   */
  const getTorsoMeasurementsFromPose = (landmarks: Landmark[], w: number, h: number) => {
    const scale = (lm?: Landmark, width?: number, height?: number) => {
      if (!lm || !width || !height) return { x: 0, y: 0 };
      return { x: lm.x * width, y: lm.y * height };
    };

    const LShoulder = scale(landmarks[12], w, h);
    const RShoulder = scale(landmarks[11], w, h);
    const LHip = scale(landmarks[24], w, h);
    const RHip = scale(landmarks[23], w, h);

    const shoulderMid = {
      x: (LShoulder.x + RShoulder.x) / 2,
      y: (LShoulder.y + RShoulder.y) / 2,
    };
    const hipMid = {
      x: (LHip.x + RHip.x) / 2,
      y: (LHip.y + RHip.y) / 2,
    };

    const torsoHeight = Math.max(1, hipMid.y - shoulderMid.y);

    // Bust position: ~20% down from shoulders to hips
    const bustY = shoulderMid.y + torsoHeight * 0.2;

    // Waist position: use waist anchor (pelvis) minus torso-relative offset
    const waistAnchorY = hipMid.y;
    const waistY = waistAnchorY - torsoHeight * POSITION_OFFSETS.WAIST_UP_TORSO_RATIO;

    // Hip position: waist anchor plus torso-relative offset
    const hipY = waistAnchorY + torsoHeight * POSITION_OFFSETS.HIP_DOWN_TORSO_RATIO;

    // Calculate body width scaling factors based on shoulder-hip ratio
    const shoulderWidth = Math.abs(LShoulder.x - RShoulder.x);
    const hipWidth = Math.abs(LHip.x - RHip.x);
    
    // Determine if person has broader shoulders vs hips for body type scaling
    const shoulderToHipRatio = shoulderWidth / Math.max(hipWidth, 1);
    
    // Calculate width expansion factors (how much wider than landmark points)
    const getWidthExpansion = (measurementType: 'bust' | 'waist' | 'hip') => {
      let baseExpansion = 0.25; // Base 25% expansion from landmark points
      
      // Adjust based on body type
      if (shoulderToHipRatio > 1.15) {
        // Broader shoulders (athletic/inverted triangle body type)
        baseExpansion = measurementType === 'bust' ? 0.35 : 
                      measurementType === 'waist' ? 0.15 : 0.25;
      } else if (shoulderToHipRatio < 0.85) {
        // Broader hips (pear body type)
        baseExpansion = measurementType === 'bust' ? 0.2 : 
                      measurementType === 'waist' ? 0.15 : 0.35;
      } else {
        // Balanced proportions (rectangle/hourglass)
        baseExpansion = measurementType === 'bust' ? 0.3 : 
                      measurementType === 'waist' ? 0.12 : 0.3;
      }
      
      // Scale expansion based on overall torso size
      const torsoSize = (shoulderWidth + hipWidth) / 2;
      const imageSizeRatio = torsoSize / (w * 0.5); // Ratio of torso to image width
      const sizeMultiplier = Math.max(0.8, Math.min(1.3, imageSizeRatio * 2));
      
      return baseExpansion * sizeMultiplier;
    };

    // Calculate width for each measurement with appropriate expansion
    const calculateWidthWithExpansion = (
      L: { x: number; y: number }, 
      R: { x: number; y: number }, 
      t: number, 
      measurementType: 'bust' | 'waist' | 'hip'
    ) => {
      // Interpolate base landmark positions
      const baseLX = L.x + (LHip.x - L.x) * t;
      const baseRX = R.x + (RHip.x - R.x) * t;
      const baseWidth = Math.abs(baseRX - baseLX);
      
      // Apply width expansion
      const expansion = getWidthExpansion(measurementType);
      const expandedWidth = baseWidth * (1 + expansion);
      const expansionAmount = (expandedWidth - baseWidth) / 2;
      
      return {
        xL: baseLX - expansionAmount,
        xR: baseRX + expansionAmount,
      };
    };

    const bustPts = calculateWidthWithExpansion(LShoulder, RShoulder, 0.2, 'bust');
    const waistPts = calculateWidthWithExpansion(LShoulder, RShoulder, 0.5, 'waist');
    const hipPts = calculateWidthWithExpansion(
      { x: LHip.x, y: LHip.y }, 
      { x: RHip.x, y: RHip.y }, 
      1.0, 
      'hip'
    );

    return {
      bust: { y: bustY, xL: bustPts.xL, xR: bustPts.xR },
      waist: { y: waistY, xL: waistPts.xL, xR: waistPts.xR },
      hip: { y: hipY, xL: hipPts.xL, xR: hipPts.xR },
    };
  };

  /**
   * Calculate all measurements using the mask and landmark data
   */
  const calculateMeasurements = () => {
    if (!frontMask || !sideMask || !heightInCm || !frontLandmarks || !sideLandmarks) {
      return;
    }

    try {
      // Calculate pixel-to-cm ratio using the front mask (preferred) or landmarks
      // Try to get pixel height from mask first
      let pixelHeight = pixelHeightFromMask(frontMask.data, frontMask.width, frontMask.height);
      
      // Fall back to landmarks if mask fails
      if (!pixelHeight) {
        pixelHeight = pixelHeightFromLandmarks(frontLandmarks, frontMask.width, frontMask.height);
      }
      
      if (!pixelHeight || pixelHeight <= 0) {
        console.error("Unable to determine pixel height for measurements");
        return;
      }
      
      const pixelToCmRatio = heightInCm / pixelHeight;

      // Compute independently for each view
      const frontMeasurements = computeMeasurementRows(frontMask, frontLandmarks, frontMask.width, frontMask.height, false);
      const sideMeasurements = computeMeasurementRows(sideMask, sideLandmarks, sideMask.width, sideMask.height, true);

      // Calculate widths and depths in pixels, then convert to cm
      // For bust: use shoulder landmarks + 10% expansion for better accuracy
      const shoulderLeft = frontLandmarks[11]; // Left shoulder
      const shoulderRight = frontLandmarks[12]; // Right shoulder
      const bustWidthFromShoulders = shoulderLeft && shoulderRight 
        ? Math.abs(shoulderRight.x - shoulderLeft.x) * frontMask.width * (1 - POSITION_OFFSETS.BUST_FRONT_SHRINK_RATIO) * pixelToCmRatio
        : (frontMeasurements.bust.right - frontMeasurements.bust.left) * pixelToCmRatio;
      
      const bustWidth = bustWidthFromShoulders;
      const bustDepth = (sideMeasurements.bust.right - sideMeasurements.bust.left) * pixelToCmRatio;
      
      // For waist and hip: use inner torso bounds (excluding arms) for front view
      const frontWaistInner = getInnerTorsoBounds(frontMask, frontMeasurements.waist.y, frontLandmarks);
      const frontHipInner = getInnerTorsoBounds(frontMask, frontMeasurements.hip.y, frontLandmarks);
      
      const waistWidth = frontWaistInner ? (frontWaistInner.right - frontWaistInner.left) * pixelToCmRatio 
        : (frontMeasurements.waist.right - frontMeasurements.waist.left) * pixelToCmRatio;
      const waistDepth = (sideMeasurements.waist.right - sideMeasurements.waist.left) * pixelToCmRatio;
      
      const hipWidth = frontHipInner ? (frontHipInner.right - frontHipInner.left) * pixelToCmRatio
        : (frontMeasurements.hip.right - frontMeasurements.hip.left) * pixelToCmRatio;
      const hipDepth = (sideMeasurements.hip.right - sideMeasurements.hip.left) * pixelToCmRatio;

      // Calculate circumferences
      const bustCircumference = calculateCircumference(bustWidth, bustDepth);
      const waistCircumference = calculateCircumference(waistWidth, waistDepth);
      const hipCircumference = calculateCircumference(hipWidth, hipDepth);

      setMeasurements({
        bust: { width: bustWidth, depth: bustDepth, circumference: bustCircumference },
        waist: { width: waistWidth, depth: waistDepth, circumference: waistCircumference },
        hip: { width: hipWidth, depth: hipDepth, circumference: hipCircumference },
        pixelToCmRatio,
      });
    } catch (error) {
      console.error("Error calculating measurements:", error);
    }
  };

  /**
   * For every row (y) compute leftmost and rightmost body pixel (or -1 if none).
   */
  const getRowBoundsFromMask = (mask: ImageData) => {
    const { width, height, data } = mask;
    const leftBounds = new Array<number>(height).fill(-1);
    const rightBounds = new Array<number>(height).fill(-1);
    for (let y = 0; y < height; y++) {
      let left = -1;
      let right = -1;
      const rowStart = y * width * 4;
      for (let x = 0; x < width; x++) {
        const alpha = data[rowStart + x * 4 + 3];
        if (alpha > ALPHA_THRESHOLD) {
          if (left === -1) left = x;
          right = x;
        }
      }
      leftBounds[y] = left;
      rightBounds[y] = right;
    }

    return { leftBounds, rightBounds };
  };

  /**
   * Compute bust/waist/hip Y rows (pixel indices) and their left/right bounds.
   * Uses silhouette rows and landmarks to center the torso and ignore arms.
   */
  const computeMeasurementRows = (
    mask: ImageData,
    landmarks: Landmark[],
    imgW: number,
    imgH: number,
    isSideView = false
  ) => {
    // fallback if landmarks missing
    if (!landmarks || landmarks.length === 0) {
      const fallbackBust = Math.floor(imgH * 0.3);
      const fallbackWaist = Math.floor(imgH * 0.55);
      const fallbackHip = Math.floor(imgH * 0.78);
      return {
        bust: { y: fallbackBust, left: 0, right: imgW },
        waist: { y: fallbackWaist, left: 0, right: imgW },
        hip: { y: fallbackHip, left: 0, right: imgW },
      };
    }

    const { leftBounds, rightBounds } = getRowBoundsFromMask(mask);

    // landmark-derived pixels
    const ls = landmarks[11],
      rs = landmarks[12],
      lh = landmarks[23],
      rh = landmarks[24];

    // normalized coordinates
    const shoulderYNorm = ((ls?.y ?? 0.2) + (rs?.y ?? 0.2)) / 2;
    const hipYNorm = ((lh?.y ?? 0.7) + (rh?.y ?? 0.7)) / 2;
    const waistAnchorNorm = hipYNorm;
    const torsoSpanNorm = Math.max(0.0001, hipYNorm - shoulderYNorm);

    const shoulderY = Math.round(shoulderYNorm * imgH);
    const hipY = Math.round(hipYNorm * imgH);
    const bustY = Math.round(
      (shoulderYNorm + torsoSpanNorm * POSITION_OFFSETS.BUST_DOWN_TORSO_RATIO) * imgH
    );
    const waistY = Math.round(
      (waistAnchorNorm - torsoSpanNorm * POSITION_OFFSETS.WAIST_UP_TORSO_RATIO) * imgH
    );

    // compute left/right at shoulder & hip rows (fallback to landmark x if row bounds unavailable)
    const L_shoulder =
      leftBounds[shoulderY] > -1
        ? leftBounds[shoulderY]
        : Math.round((((ls?.x ?? 0.35) + (rs?.x ?? 0.65)) / 2) * imgW) - 20;
    const R_shoulder =
      rightBounds[shoulderY] > -1
        ? rightBounds[shoulderY]
        : Math.round((((ls?.x ?? 0.35) + (rs?.x ?? 0.65)) / 2) * imgW) + 20;
    const L_hip =
      leftBounds[hipY] > -1
        ? leftBounds[hipY]
        : Math.round((((lh?.x ?? 0.4) + (rh?.x ?? 0.6)) / 2) * imgW) - 20;
    const R_hip =
      rightBounds[hipY] > -1
        ? rightBounds[hipY]
        : Math.round((((lh?.x ?? 0.4) + (rh?.x ?? 0.6)) / 2) * imgW) + 20;

    const shoulderWidth = Math.max(1, R_shoulder - L_shoulder);
    const hipWidth = Math.max(1, R_hip - L_hip);

    // torso center x estimate (avg of shoulder/hip centers)
    const centerX = Math.round(
      ((L_shoulder + R_shoulder) / 2 + (L_hip + R_hip) / 2) / 2
    );

    // estimate torso half width and clamp
    const torsoHalfEstimate = Math.max(
      Math.min(imgW * 0.35, Math.max(shoulderWidth, hipWidth) * 0.5), // tighter band
      Math.max(imgW * 0.06, 20)
    );

    // innerWidthAtRow no longer needed with fixed Y positions

    // --- bust: use universal torso-relative position ---

    // --- hip: from waist anchor, move down by torso ratio ---
    const foundHipY = Math.round(
      (waistAnchorNorm + torsoSpanNorm * POSITION_OFFSETS.HIP_DOWN_TORSO_RATIO) * imgH
    );

    // compute left/right bounds per row
    const buildBounds = (y: number) => {
      const hasRow = leftBounds[y] > -1 && rightBounds[y] > -1;
      if (isSideView && hasRow) {
        // side view: use full silhouette width
        const left = Math.max(0, leftBounds[y]);
        const right = Math.min(imgW, rightBounds[y]);
        return { y, left, right };
      }

      // front view (or missing row bounds): use center-limited torso band to avoid arms
      const L = hasRow ? leftBounds[y] : Math.round(centerX - torsoHalfEstimate);
      const R = hasRow ? rightBounds[y] : Math.round(centerX + torsoHalfEstimate);
      const left = Math.max(0, Math.round(Math.max(L, centerX - torsoHalfEstimate)));
      const right = Math.min(imgW, Math.round(Math.min(R, centerX + torsoHalfEstimate)));
      return { y, left, right };
    };

    return {
      bust: buildBounds(bustY),
      waist: buildBounds(waistY),
      hip: buildBounds(foundHipY),
    };
  };

  // removed: computeMeasurementRowsWithYPositions; side must be computed independently

  /**
   * Get inner torso bounds at a specific Y level, excluding arms/hands
   * Looks for gaps in the mask to identify the main torso area
   */
  const getInnerTorsoBounds = (mask: ImageData, y: number, landmarks: Landmark[]) => {
    const { leftBounds, rightBounds } = getRowBoundsFromMask(mask);
    const clampedY = Math.max(0, Math.min(mask.height - 1, Math.round(y)));
    
    if (leftBounds[clampedY] === -1 || rightBounds[clampedY] === -1) {
      return null; // No body detected at this row
    }

    // Get the full row bounds
    const fullLeft = leftBounds[clampedY];
    const fullRight = rightBounds[clampedY];
    
    // Use shoulder landmarks to estimate torso center and reasonable width
    const shoulderLeft = landmarks[11];
    const shoulderRight = landmarks[12];
    
    if (!shoulderLeft || !shoulderRight) {
      return { left: fullLeft, right: fullRight }; // Fallback to full bounds
    }

    // Calculate torso center from shoulders
    const torsoCenter = ((shoulderLeft.x + shoulderRight.x) / 2) * mask.width;
    const shoulderWidth = Math.abs(shoulderRight.x - shoulderLeft.x) * mask.width;
    
    // Estimate reasonable torso half-width (shoulder width + some expansion for body)
    const maxTorsoHalfWidth = shoulderWidth * 0.8; // 80% of shoulder width as max torso radius
    
    // Scan inward from the edges to find the inner torso bounds
    const rowStart = clampedY * mask.width * 4;
    
    // Find leftmost torso edge (scan from center outward to left)
    let innerLeft = Math.round(torsoCenter);
    for (let x = Math.round(torsoCenter); x >= fullLeft; x--) {
      const pixelIndex = rowStart + x * 4;
      if (mask.data[pixelIndex + 3] > ALPHA_THRESHOLD) {
        innerLeft = x;
      } else {
        break; // Hit a gap, stop here
      }
      
      // Don't go beyond reasonable torso width
      if (torsoCenter - x > maxTorsoHalfWidth) break;
    }
    
    // Find rightmost torso edge (scan from center outward to right)
    let innerRight = Math.round(torsoCenter);
    for (let x = Math.round(torsoCenter); x <= fullRight; x++) {
      const pixelIndex = rowStart + x * 4;
      if (mask.data[pixelIndex + 3] > ALPHA_THRESHOLD) {
        innerRight = x;
      } else {
        break; // Hit a gap, stop here
      }
      
      // Don't go beyond reasonable torso width
      if (x - torsoCenter > maxTorsoHalfWidth) break;
    }

    return { left: innerLeft, right: innerRight };
  };

  const drawVisualization = async (
    canvas: HTMLCanvasElement,
    photo: File,
    mask: ImageData,
    landmarks?: Landmark[],
    mode: "pose" | "mask" = "pose",
    isFrontView = false
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load the original photo
    const img = new Image();
    const photoUrl = URL.createObjectURL(photo);

    img.onload = () => {
      // Set canvas size
      canvas.width = mask.width;
      canvas.height = mask.height;

      // Draw original photo (dimmed)
      ctx.globalAlpha = 0.3;
      ctx.drawImage(img, 0, 0, mask.width, mask.height);
      ctx.globalAlpha = 1.0;

      // Create silhouette overlay
      const silhouetteData = new ImageData(mask.width, mask.height);

      for (let i = 0; i < mask.data.length; i += 4) {
        // If this pixel is part of the body (alpha > 0)
        if (mask.data[i + 3] > 128) {
          // Make it bright green
          silhouetteData.data[i] = 0; // R
          silhouetteData.data[i + 1] = 255; // G
          silhouetteData.data[i + 2] = 0; // B
          silhouetteData.data[i + 3] = 180; // A (semi-transparent)
        } else {
          // Make it transparent
          silhouetteData.data[i] = 0;
          silhouetteData.data[i + 1] = 0;
          silhouetteData.data[i + 2] = 0;
          silhouetteData.data[i + 3] = 0;
        }
      }

      // Draw the silhouette overlay
      ctx.putImageData(silhouetteData, 0, 0);

      // Draw landmarks if available
      if (landmarks) {
        //let minX = mask.width,
        //  minY = mask.height;
        //let maxX = 0,
        //  maxY = 0;

        //for (let y = 0; y < mask.height; y++) {
        //  for (let x = 0; x < mask.width; x++) {
        //    const i = (y * mask.width + x) * 4;

        //    if (mask.data[i + 3] > 128) {
        //      // body pixel
        //      if (x < minX) minX = x;
        //      if (y < minY) minY = y;
        //      if (x > maxX) maxX = x;
        //      if (y > maxY) maxY = y;
        //    }
        //  }
        //}

        //const bodyWidth = maxX - minX + 1;
        //const bodyHeight = maxY - minY + 1;
        drawLandmarks(ctx, landmarks, mask.width, mask.height);
        if (mode === "pose") {
          drawTorsoBounds(ctx, landmarks, mask.width, mask.height);
        } else {
          drawTorsoBoundsMask(ctx, landmarks, mask, mask.width, mask.height, isFrontView);
        }
      }

      // Clean up
      URL.revokeObjectURL(photoUrl);
    };

    img.src = photoUrl;
  };

  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    landmarks.forEach((landmark, index) => {
      if (landmark.visibility && landmark.visibility < 0.5) return;

      const x = landmark.x * width;
      const y = landmark.y * height;

      // Draw landmark point
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw landmark index (for debugging)
      ctx.fillStyle = "white";
      ctx.font = "10px Arial";
      ctx.fillText(index.toString(), x + 5, y - 5);
      ctx.fillStyle = "red";
    });

    // Draw key connections for pose skeleton
    drawPoseSkeleton(ctx, landmarks, width, height);
  };

  const drawPoseSkeleton = (
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;

    // Define connections between landmarks (simplified pose skeleton)
    const connections = [
      [11, 12], // Shoulders
      [11, 13], // Left shoulder to elbow
      [13, 15], // Left elbow to wrist
      [12, 14], // Right shoulder to elbow
      [14, 16], // Right elbow to wrist
      [11, 23], // Left shoulder to hip
      [12, 24], // Right shoulder to hip
      [23, 24], // Hips
      [23, 25], // Left hip to knee
      [25, 27], // Left knee to ankle
      [24, 26], // Right hip to knee
      [26, 28], // Right knee to ankle
    ];

    connections.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];

      if (
        start &&
        end &&
        (!start.visibility || start.visibility > 0.5) &&
        (!end.visibility || end.visibility > 0.5)
      ) {
        ctx.beginPath();
        ctx.moveTo(start.x * width, start.y * height);
        ctx.lineTo(end.x * width, end.y * height);
        ctx.stroke();
      }
    });
  };

  const drawTorsoBounds = (
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    // pose-based torso measurements (landmark interpolation)
    const levels = getTorsoMeasurementsFromPose(landmarks, width, height);

    const measurementLevels = [
      { name: "Bust", color: "#FF6B6B", level: levels.bust },
      { name: "Waist", color: "#4ECDC4", level: levels.waist },
      { name: "Hip", color: "#45B7D1", level: levels.hip },
    ];

    measurementLevels.forEach(({ name, color, level }) => {
      const y = Math.floor(level.y);
      const left = Math.round(Math.min(level.xL, level.xR));
      const right = Math.round(Math.max(level.xL, level.xR));

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left, y - 10);
      ctx.lineTo(left, y + 10);
      ctx.moveTo(right, y - 10);
      ctx.lineTo(right, y + 10);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = "bold 12px Arial";
      ctx.fillText(name, Math.max(4, left - 36), y - 8);
    });
  };

  const drawTorsoBoundsMask = (
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    mask: ImageData,
    width: number,
    height: number,
    isFrontView: boolean
  ) => {
    // compute independently per view
    const levels = computeMeasurementRows(mask, landmarks, width, height, !isFrontView);

    // For front view, optional overrides
    if (isFrontView && landmarks[11] && landmarks[12]) {
      // Bust: use shoulder landmarks
      const shoulderLeft = landmarks[11]; // Left shoulder
      const shoulderRight = landmarks[12]; // Right shoulder
      const shoulderDistance = Math.abs(shoulderRight.x - shoulderLeft.x) * width;
      
      const centerX = (shoulderLeft.x + shoulderRight.x) / 2 * width;
      const halfWidth = (shoulderDistance / 2) * (1 - POSITION_OFFSETS.BUST_FRONT_SHRINK_RATIO);
      const bustLeft = centerX - halfWidth;
      const bustRight = centerX + halfWidth;
      
      levels.bust = {
        y: levels.bust.y,
        left: Math.round(bustLeft),
        right: Math.round(bustRight)
      };

      // Waist and Hip: use inner torso bounds (excluding arms)
      const waistInner = getInnerTorsoBounds(mask, levels.waist.y, landmarks);
      const hipInner = getInnerTorsoBounds(mask, levels.hip.y, landmarks);
      
      if (waistInner) {
        levels.waist = {
          y: levels.waist.y,
          left: waistInner.left,
          right: waistInner.right
        };
      }
      
      if (hipInner) {
        levels.hip = {
          y: levels.hip.y,
          left: hipInner.left,
          right: hipInner.right
        };
      }
    }

    const measurementLevels = [
      { name: "Bust", color: "#FF6B6B", level: levels.bust },
      { name: "Waist", color: "#4ECDC4", level: levels.waist },
      { name: "Hip", color: "#45B7D1", level: levels.hip },
    ];

    measurementLevels.forEach(({ name, color, level }) => {
      const y = Math.floor(level.y);
      const left = Math.round(level.left);
      const right = Math.round(level.right);

      // Draw dashed measurement line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();

      // End markers
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left, y - 10);
      ctx.lineTo(left, y + 10);
      ctx.moveTo(right, y - 10);
      ctx.lineTo(right, y + 10);
      ctx.stroke();

      // Label
      ctx.fillStyle = color;
      ctx.font = "bold 12px Arial";
      ctx.fillText(name, Math.max(4, left - 36), y - 8);
    });
  };


  if (!frontMask && !sideMask) {
    return (
      <div className="flex items-center justify-center p-8 bg-neutral-100 rounded-lg">
        <p className="text-neutral-500">
          No segmentation data available for visualization
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">
        🔍 Silhouette Detection (Debug View)
      </h3>
      <p className="text-sm text-neutral-600 mb-4">
        Green overlay shows detected body silhouette. Red dots are pose
        landmarks. Colored dashed lines show torso measurement bounds (excluding
        arms).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frontMask && (
          <div className="flex flex-col items-center">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">
              Front View
            </h4>
            <canvas
              ref={frontCanvasRef}
              className="max-w-full h-auto border border-neutral-300 rounded"
              style={{ maxHeight: "300px" }}
            />
          </div>
        )}

        {sideMask && (
          <div className="flex flex-col items-center">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">
              Side View
            </h4>
            <canvas
              ref={sideCanvasRef}
              className="max-w-full h-auto border border-neutral-300 rounded"
              style={{ maxHeight: "300px" }}
            />
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Temporary Debug View:</strong> This visualization helps verify
          that the AI is correctly detecting your body silhouette and pose
          landmarks. It will be removed once measurements are perfected.
        </p>
      </div>

      {measurements && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">
            📏 Body Measurements
          </h4>
          <p className="text-sm text-blue-700 mb-4">
            Calculated from your {heightInCm}cm height and detected silhouette (Ratio: {measurements.pixelToCmRatio.toFixed(4)} cm/pixel)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bust Measurements */}
            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-medium text-red-600 mb-2 flex items-center">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Bust
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Width (front):</span>
                  <span className="font-medium">{measurements.bust.width.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Depth (side):</span>
                  <span className="font-medium">{measurements.bust.depth.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-gray-800 font-medium">Circumference:</span>
                  <span className="font-bold text-red-600">{measurements.bust.circumference.toFixed(1)} cm</span>
                </div>
              </div>
            </div>

            {/* Waist Measurements */}
            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-medium text-teal-600 mb-2 flex items-center">
                <span className="inline-block w-3 h-3 bg-teal-500 rounded-full mr-2"></span>
                Waist
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Width (front):</span>
                  <span className="font-medium">{measurements.waist.width.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Depth (side):</span>
                  <span className="font-medium">{measurements.waist.depth.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-gray-800 font-medium">Circumference:</span>
                  <span className="font-bold text-teal-600">{measurements.waist.circumference.toFixed(1)} cm</span>
                </div>
              </div>
            </div>

            {/* Hip Measurements */}
            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-medium text-blue-600 mb-2 flex items-center">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Hip
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Width (front):</span>
                  <span className="font-medium">{measurements.hip.width.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Depth (side):</span>
                  <span className="font-medium">{measurements.hip.depth.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-gray-800 font-medium">Circumference:</span>
                  <span className="font-bold text-blue-600">{measurements.hip.circumference.toFixed(1)} cm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-blue-600">
            <p>💡 <strong>Tip:</strong> Circumference is calculated using an ellipse approximation from the width and depth measurements.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SilhouetteVisualization;
