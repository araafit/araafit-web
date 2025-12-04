import { useState, useEffect, useCallback } from "react";
import {
  SparkleIcon,
  PencilSimpleIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react";
import { MeasurementStepperLines } from "../stepper-lines";
import { useGetMeasured } from "../context/get-measured-context";
import Button from "../../../shared-components/button";
import {
  createMeasurementService,
  type MeasurementResult,
} from "../../../services/measurement";
import { POSITION_OFFSETS } from "../../../services/measurement";
import { extractSkinToneFromPhoto } from "../../../services/measurement/skin-tone-extractor";
//import SilhouetteVisualization from "./silhouette-visualization";
import { useCreateMeasurements } from "../../../hooks/measurements.hooks";
import { useCreateGuestUser } from "../../../hooks/auth.hooks";
import { useAuthStore } from "../../../stores/auth-store";
import { useSkinTonesList } from "../../../hooks/admin-settings.hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { Landmark } from "../../../services/measurement/types";
import {
  pixelHeightFromMask,
  pixelHeightFromLandmarks,
} from "../../../services/measurement/utils";
import { EditMeasurementsDrawer } from "./edit-measurements.drawer";

/* ------------------------------------------------------------------- */

export function Confirmation() {
  const { currentStep, stepTo, frontPhoto, sidePhoto, height, resetProgress } =
    useGetMeasured();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gender = (searchParams.get("gender") || "female").toLowerCase();
  const isMale = gender === "male";
  const { isAuthenticated, isGuest } = useAuthStore();
  const createMeasurements = useCreateMeasurements();
  const createGuestUser = useCreateGuestUser();
  const { data: skinTones } = useSkinTonesList();

  const [isProcessing, setIsProcessing] = useState(false);
  const [measurements, setMeasurements] = useState<MeasurementResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ progress: 0, stage: "" });
  const [skinTone, setSkinTone] = useState<{
    hex: string;
    rgb: { r: number; g: number; b: number };
    name: string;
  } | null>(null);

  // New accurate measurements from visualization method
  const [accurateMeasurements, setAccurateMeasurements] = useState<{
    bust: { width: number; depth: number; circumference: number };
    waist: { width: number; depth: number; circumference: number };
    hip: { width: number; depth: number; circumference: number };
    pixelToCmRatio: number;
  } | null>(null);

  // Edited measurements (overrides original when user edits)
  const [editedMeasurements, setEditedMeasurements] = useState<{
    bust?: number;
    chest?: number;
    waist: number;
    hips?: number;
    height: number;
    skinTone: string;
    dressSize?: string;
    neck?: number;
    shoulder?: number;
  } | null>(null);

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
   * For every row (y) compute leftmost and rightmost body pixel (or -1 if none).
   */
  const getRowBoundsFromMask = useCallback((mask: ImageData) => {
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
  }, []);

  /**
   * Compute bust/waist/hip Y rows (pixel indices) and their left/right bounds.
   * Uses silhouette rows and landmarks to center the torso and ignore arms.
   */
  const computeMeasurementRows = useCallback(
    (
      mask: ImageData,
      _landmarks: Landmark[],
      imgW: number,
      imgH: number,
      isSideView = false
    ) => {
      // fallback if landmarks missing
      if (!_landmarks || _landmarks.length === 0) {
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
      const ls = _landmarks[11],
        rs = _landmarks[12],
        lh = _landmarks[23],
        rh = _landmarks[24];

      // normalized coordinates
      const shoulderYNorm = ((ls?.y ?? 0.2) + (rs?.y ?? 0.2)) / 2;
      const hipYNorm = ((lh?.y ?? 0.7) + (rh?.y ?? 0.7)) / 2;
      const waistAnchorNorm = hipYNorm; // pelvis/mid-hip as anchor
      const torsoSpanNorm = Math.max(0.0001, hipYNorm - shoulderYNorm);

      const shoulderY = Math.round(shoulderYNorm * imgH);
      const hipY = Math.round(hipYNorm * imgH);
      const bustY = Math.round(
        (shoulderYNorm +
          torsoSpanNorm * POSITION_OFFSETS.BUST_DOWN_TORSO_RATIO) *
          imgH
      );
      const waistY = Math.round(
        (waistAnchorNorm -
          torsoSpanNorm * POSITION_OFFSETS.WAIST_UP_TORSO_RATIO) *
          imgH
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

      // --- hip: from waist anchor, move down by torso ratio ---
      const foundHipY = Math.round(
        (waistAnchorNorm +
          torsoSpanNorm * POSITION_OFFSETS.HIP_DOWN_TORSO_RATIO) *
          imgH
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
        const L = hasRow
          ? leftBounds[y]
          : Math.round(centerX - torsoHalfEstimate);
        const R = hasRow
          ? rightBounds[y]
          : Math.round(centerX + torsoHalfEstimate);
        const left = Math.max(
          0,
          Math.round(Math.max(L, centerX - torsoHalfEstimate))
        );
        const right = Math.min(
          imgW,
          Math.round(Math.min(R, centerX + torsoHalfEstimate))
        );
        return { y, left, right };
      };

      return {
        bust: buildBounds(bustY),
        waist: buildBounds(waistY),
        hip: buildBounds(foundHipY),
      };
    },
    [getRowBoundsFromMask]
  );

  /**
   * Compute measurement rows using provided Y positions (for consistency between views)
   */
  // removed: computeMeasurementRowsWithYPositions; side must be computed independently

  /**
   * Get inner torso bounds at a specific Y level, excluding arms/hands
   * Looks for gaps in the mask to identify the main torso area
   */
  const getInnerTorsoBounds = useCallback(
    (mask: ImageData, y: number, landmarks: Landmark[]) => {
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
      const shoulderWidth =
        Math.abs(shoulderRight.x - shoulderLeft.x) * mask.width;

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
    },
    [getRowBoundsFromMask]
  );
  /**
   * Calculate accurate measurements using the visualization method
   */
  const calculateAccurateMeasurements = useCallback(
    (result: MeasurementResult) => {
      if (
        !result.debug?.frontMask ||
        !result.debug?.sideMask ||
        !result.debug?.frontLandmarks ||
        !result.debug?.sideLandmarks
      ) {
        return null;
      }

      try {
        const frontMask = result.debug.frontMask;
        const sideMask = result.debug.sideMask;
        const frontLandmarks = result.debug.frontLandmarks;
        const sideLandmarks = result.debug.sideLandmarks;
        const heightInCm = result.metadata.heightInCm;

        // Calculate pixel-to-cm ratio
        let pixelHeight = pixelHeightFromMask(
          frontMask.data,
          frontMask.width,
          frontMask.height
        );
        if (!pixelHeight) {
          pixelHeight = pixelHeightFromLandmarks(
            frontLandmarks,
            frontMask.width,
            frontMask.height
          );
        }

        if (!pixelHeight || pixelHeight <= 0) {
          console.error(
            "Unable to determine pixel height for accurate measurements"
          );
          return null;
        }

        const pixelToCmRatio = heightInCm / pixelHeight;

        // Get measurements using the same logic as visualization
        const frontMeasurements = computeMeasurementRows(
          frontMask,
          frontLandmarks,
          frontMask.width,
          frontMask.height,
          false
        );
        // Side view: compute independently using side landmarks
        const sideMeasurements = computeMeasurementRows(
          sideMask,
          sideLandmarks,
          sideMask.width,
          sideMask.height,
          true
        );

        // Calculate widths and depths in pixels, then convert to cm
        const shoulderLeft = frontLandmarks[11];
        const shoulderRight = frontLandmarks[12];
        const bustWidthFromShoulders =
          shoulderLeft && shoulderRight
            ? Math.abs(shoulderRight.x - shoulderLeft.x) *
              frontMask.width *
              (1 - POSITION_OFFSETS.BUST_FRONT_SHRINK_RATIO) *
              pixelToCmRatio
            : (frontMeasurements.bust.right - frontMeasurements.bust.left) *
              pixelToCmRatio;

        const bustWidth = bustWidthFromShoulders;
        const bustDepth =
          (sideMeasurements.bust.right - sideMeasurements.bust.left) *
          pixelToCmRatio;

        // For waist and hip: use inner torso bounds (excluding arms) for front view
        const frontWaistInner = getInnerTorsoBounds(
          frontMask,
          frontMeasurements.waist.y,
          frontLandmarks
        );
        const frontHipInner = getInnerTorsoBounds(
          frontMask,
          frontMeasurements.hip.y,
          frontLandmarks
        );

        const waistWidth = frontWaistInner
          ? (frontWaistInner.right - frontWaistInner.left) * pixelToCmRatio
          : (frontMeasurements.waist.right - frontMeasurements.waist.left) *
            pixelToCmRatio;
        const waistDepth =
          (sideMeasurements.waist.right - sideMeasurements.waist.left) *
          pixelToCmRatio;

        const hipWidth = frontHipInner
          ? (frontHipInner.right - frontHipInner.left) * pixelToCmRatio
          : (frontMeasurements.hip.right - frontMeasurements.hip.left) *
            pixelToCmRatio;
        const hipDepth =
          (sideMeasurements.hip.right - sideMeasurements.hip.left) *
          pixelToCmRatio;

        // Calculate circumferences using ellipse approximation
        const bustCircumference = calculateCircumference(bustWidth, bustDepth);
        const waistCircumference = calculateCircumference(
          waistWidth,
          waistDepth
        );
        const hipCircumference = calculateCircumference(hipWidth, hipDepth);

        return {
          bust: {
            width: bustWidth,
            depth: bustDepth,
            circumference: bustCircumference,
          },
          waist: {
            width: waistWidth,
            depth: waistDepth,
            circumference: waistCircumference,
          },
          hip: {
            width: hipWidth,
            depth: hipDepth,
            circumference: hipCircumference,
          },
          pixelToCmRatio,
        };
      } catch (error) {
        console.error("Error calculating accurate measurements:", error);
        return null;
      }
    },
    [computeMeasurementRows, getInnerTorsoBounds]
  );

  const processMeasurements = useCallback(async () => {
    if (!frontPhoto || !sidePhoto || !height) return;

    setIsProcessing(true);
    setError(null);

    try {
      const measurementService = createMeasurementService({
        poseDetectionThreshold: 0.6,
        segmentationThreshold: 0.7,
        smoothingFactor: 0.8,
      });

      await measurementService.initialize((progress, stage) => {
        setProgress({ progress, stage });
      });

      const result = await measurementService.extractMeasurements(
        {
          frontPhoto,
          sidePhoto,
          heightInCm: height,
        },
        (progress, stage) => {
          setProgress({ progress, stage });
        }
      );

      setMeasurements(result);

      // Calculate accurate measurements using visualization method
      setProgress({
        progress: 0.85,
        stage: "Calculating accurate measurements...",
      });
      const accurate = calculateAccurateMeasurements(result);
      if (accurate) {
        setAccurateMeasurements(accurate);
      }

      // Extract skin tone from front photo
      setProgress({ progress: 0.9, stage: "Analyzing skin tone..." });
      try {
        const extractedSkinTone = await extractSkinToneFromPhoto(
          frontPhoto,
          result.debug?.frontLandmarks,
          result.debug?.frontMask?.width,
          result.debug?.frontMask?.height
        );
        setSkinTone(extractedSkinTone);
      } catch (skinToneError) {
        console.warn("Skin tone extraction failed:", skinToneError);
        // Use fallback skin tone
        setSkinTone({
          hex: "#8c5a47",
          rgb: { r: 140, g: 90, b: 71 },
          name: "medium",
        });
      }

      measurementService.dispose();
    } catch (error) {
      console.error("Measurement processing failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process measurements"
      );
    } finally {
      setIsProcessing(false);
    }
  }, [frontPhoto, sidePhoto, height, calculateAccurateMeasurements]);

  useEffect(() => {
    if (frontPhoto && sidePhoto && height && !measurements && !isProcessing) {
      processMeasurements();
    }
  }, [
    frontPhoto,
    sidePhoto,
    height,
    measurements,
    isProcessing,
    processMeasurements,
  ]);

  const retake = () => {
    stepTo(0);
    window.location.reload();
  };

  const handleRestart = () => {
    resetProgress();
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col">
        <div className="w-full flex flex-col gap-5 items-center">
          <MeasurementStepperLines stepIndex={currentStep} />

          <div className="w-full max-w-[51rem] flex flex-col gap-6 items-center">
            <div>
              <h2 className="text-xl md:text-[2rem] text-[#1C1C1C] font-semibold mb-2">
                Processing Your Measurements
              </h2>
              <p className="text-neutral-500 font-inter text-sm md:text-base">
                Our AI is analyzing your photos to extract precise
                measurements...
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 md:gap-6 py-8 md:py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-primary-500"></div>
                <SparkleIcon
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500"
                  size={20}
                />
              </div>

              <div className="text-center w-full max-w-sm md:max-w-none">
                <p className="text-base md:text-lg font-medium text-neutral-700 mb-2">
                  {progress.stage}
                </p>
                <div className="w-full max-w-80 bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress * 100}%` }}
                  />
                </div>
                <p className="text-xs md:text-sm text-neutral-500 mt-2">
                  {Math.round(progress.progress * 100)}% complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <div className="w-full flex flex-col gap-5 items-center">
          <MeasurementStepperLines stepIndex={currentStep} />

          <div className="w-full max-w-[51rem] flex flex-col gap-6">
            <div>
              <h2 className="text-xl md:text-[2rem] text-[#1C1C1C] font-semibold mb-2">
                Processing Failed
              </h2>
              <p className="text-neutral-500 font-inter text-sm md:text-base">
                We encountered an issue processing your measurements
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
              <p className="text-red-700 text-sm md:text-base">{error}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-4 md:gap-6 mt-8">
          <button
            className="w-full md:w-[10rem] px-4 py-2 border border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg flex items-center justify-center gap-2 transition-colors"
            onClick={handleRestart}
          >
            <ArrowCounterClockwiseIcon size={16} />
            <span>Restart</span>
          </button>

          <Button
            text="Try Again"
            variant="solid"
            className="w-full md:w-[10rem] self-end"
            onClick={retake}
          />
        </div>
      </div>
    );
  }

  console.log("measurements", measurements);
  console.log("accurateMeasurements", accurateMeasurements);

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col gap-5 items-center">
        <MeasurementStepperLines stepIndex={currentStep} />

        <div className="w-full max-w-[51rem] flex flex-col gap-6 md:gap-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-xl md:text-[2rem] text-[#1C1C1C] font-semibold mb-4">
              Measurement Summary
            </h2>
            <p className="text-neutral-500 font-inter text-sm md:text-lg">
              We've successfully captured your measurements and detected your
              skin tone.
            </p>
          </div>

          {measurements && (
            <>
              {/* Measurements Section */}
              <div className="bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
                  <h3 className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                    Measurement
                  </h3>
                  <EditMeasurementsDrawer
                    trigger={
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors self-start sm:self-center">
                        <PencilSimpleIcon size={16} />
                        <span className="text-xs md:text-sm">Edit</span>
                      </button>
                    }
                    measurements={measurements}
                    accurateMeasurements={accurateMeasurements}
                    gender={gender as "male" | "female"}
                    skinTone={skinTone}
                    onSave={(updated) => {
                      setEditedMeasurements(updated);
                      // Update skin tone state if changed
                      if (updated.skinTone && skinTones) {
                        const tone = skinTones.find((t) => t.name === updated.skinTone);
                        if (tone) {
                          setSkinTone({
                            hex: tone.hex,
                            rgb: { r: 0, g: 0, b: 0 }, // Not needed for display
                            name: tone.name,
                          });
                        }
                      }
                    }}
                  />
                </div>

                <div className="space-y-4 md:space-y-6">
                  Show accurate measurements if available, with comparison
                  {/*{accurateMeasurements && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">
                        ✨ Enhanced Accurate Measurements
                      </h4>
                      <p className="text-sm text-green-700">
                        Using advanced silhouette analysis for improved accuracy
                      </p>
                    </div>
                  )}*/}
                  {isMale ? (
                    <>
                      <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                        <span className="text-sm md:text-lg text-neutral-700">
                          Chest (inches)
                        </span>
                        <div className="text-right">
                          <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                            {editedMeasurements?.chest ??
                              (accurateMeasurements
                                ? Math.round(
                                    accurateMeasurements.bust.circumference / 2.54
                                  )
                                : Math.round(
                                    measurements.measurements.bust / 2.54
                                  ))}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                        <span className="text-sm md:text-lg text-neutral-700">
                          Waist (inches)
                        </span>
                        <div className="text-right">
                          <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                            {editedMeasurements?.waist ??
                              (accurateMeasurements
                                ? Math.round(
                                    accurateMeasurements.waist.circumference /
                                      2.54
                                  )
                                : Math.round(
                                    measurements.measurements.waist / 2.54
                                  ))}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                        <span className="text-sm md:text-lg text-neutral-700">
                          Shoulder (inches)
                        </span>
                        <div className="text-right">
                          <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                            {editedMeasurements?.shoulder ??
                              Math.round(
                                (measurements.measurements.shoulderWidth || 0) /
                                  2.54
                              )}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                        <span className="text-sm md:text-lg text-neutral-700">
                          Inseam (inches)
                        </span>
                        <div className="text-right">
                          <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                            {Math.round(
                              (measurements.measurements.inseam || 0) / 2.54
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                        <span className="text-sm md:text-lg text-neutral-700">
                          Bust (inches)
                        </span>
                        <div className="text-right">
                          <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                            {editedMeasurements?.bust ??
                              (accurateMeasurements
                                ? Math.round(
                                    accurateMeasurements.bust.circumference / 2.54
                                  )
                                : Math.round(
                                    measurements.measurements.bust / 2.54
                                  ))}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                        <span className="text-sm md:text-lg text-neutral-700">
                          Waist (inches)
                        </span>
                        <div className="text-right">
                          <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                            {editedMeasurements?.waist ??
                              (accurateMeasurements
                                ? Math.round(
                                    accurateMeasurements.waist.circumference /
                                      2.54
                                  )
                                : Math.round(
                                    measurements.measurements.waist / 2.54
                                  ))}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                        <span className="text-sm md:text-lg text-neutral-700">
                          Hip (inches)
                        </span>
                        <div className="text-right">
                          <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                            {editedMeasurements?.hips ??
                              (accurateMeasurements
                                ? Math.round(
                                    accurateMeasurements.hip.circumference / 2.54
                                  )
                                : Math.round(
                                    measurements.measurements.hip / 2.54
                                  ))}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                    <span className="text-sm md:text-lg text-neutral-700">
                      Height
                    </span>
                    <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                      {editedMeasurements?.height
                        ? `${Math.floor(editedMeasurements.height / 12)}'${editedMeasurements.height % 12}"`
                        : `${Math.floor(measurements.measurements.height / 30.48)}'${Math.round(
                            (measurements.measurements.height % 30.48) / 2.54
                          )}"`}
                    </span>
                  </div>
                  {!isMale && (
                    <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                      <span className="text-sm md:text-lg text-neutral-700">
                        Dress Size
                      </span>
                      <span className="text-lg md:text-xl font-semibold text-[#1C1C1C]">
                        {editedMeasurements?.dressSize ?? measurements.dressSize.us}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skin Tone Section */}
              {skinTone && (
                <div className="bg-white">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm md:text-lg text-neutral-700">
                      Skin Tone
                    </span>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-6 md:w-12 md:h-8 rounded-lg border border-neutral-200"
                        style={{ backgroundColor: skinTone.hex }}
                      />
                      <span className="text-sm md:text-lg font-medium text-[#1C1C1C]">
                        {skinTone.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Silhouette Visualization (Debug) */}
              {/*{frontPhoto && sidePhoto && measurements?.debug && (
                <SilhouetteVisualization
                  frontPhoto={frontPhoto}
                  sidePhoto={sidePhoto}
                  frontMask={measurements.debug.frontMask}
                  sideMask={measurements.debug.sideMask}
                  frontLandmarks={measurements.debug.frontLandmarks}
                  sideLandmarks={measurements.debug.sideLandmarks}
                  heightInCm={measurements.metadata.heightInCm}
                />
              )}*/}
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 mt-8 md:mt-12">
        {!isAuthenticated ? (
          // Not authenticated: Show guest/signup options
          <>
            <Button
              text="Try Again"
              variant="solid"
              className="w-full md:w-[10rem] self-end"
              onClick={handleRestart}
            />
            <button
              className="text-[#A67C5A] hover:text-[#8B6A4D] font-medium underline transition-colors disabled:opacity-50 text-sm md:text-base text-center py-2"
              disabled={createGuestUser.isPending}
              onClick={() => {
                // Create guest user with measurements then navigate to shop
                if (!measurements && !accurateMeasurements) {
                  toast.error("No measurements available");
                  return;
                }

                let bust, waist, hips;

                // Use edited measurements if available, otherwise use accurate or original
                if (editedMeasurements) {
                  bust = editedMeasurements.bust ?? editedMeasurements.chest ?? 0;
                  waist = editedMeasurements.waist;
                  hips = editedMeasurements.hips ?? 0;
                } else if (accurateMeasurements) {
                  // Use accurate measurements from visualization method (convert to inches)
                  bust = Math.round(
                    accurateMeasurements.bust.circumference / 2.54
                  );
                  waist = Math.round(
                    accurateMeasurements.waist.circumference / 2.54
                  );
                  hips = Math.round(
                    accurateMeasurements.hip.circumference / 2.54
                  );
                } else if (measurements) {
                  // Fall back to original measurements (convert to inches)
                  bust = Math.round(measurements.measurements.bust / 2.54);
                  waist = Math.round(measurements.measurements.waist / 2.54);
                  hips = Math.round(measurements.measurements.hip / 2.54);
                } else {
                  toast.error("No measurements available");
                  return;
                }

                if (!height) {
                  toast.error("Height information missing");
                  return;
                }

                const guestUserData = {
                  gender,
                  // Shared
                  waist,
                  height: editedMeasurements?.height
                    ? editedMeasurements.height
                    : Math.round(height * 0.393701), // Convert cm to inches
                  skinTone:
                    editedMeasurements?.skinTone ||
                    skinTone?.name?.toLowerCase() ||
                    "medium",
                  // Female
                  bust: isMale ? undefined : bust,
                  hips: isMale ? undefined : hips,
                  // Male
                  chest: isMale ? bust : undefined,
                };

                createGuestUser.mutate(guestUserData as Parameters<typeof createGuestUser.mutate>[0], {
                  onSuccess: () => {
                    toast.success("Welcome! Continue shopping as a guest.");
                    navigate("/shop"); // This will show the guest shop page
                  },
                });
              }}
            >
              {createGuestUser.isPending
                ? "Creating account..."
                : "Continue as guest user"}
            </button>

            <Button
              text="Create a free account"
              variant="solid"
              className="w-full md:w-auto bg-[#A67C5A] hover:bg-[#8B6A4D] text-white px-6 py-3"
              onClick={() => {
                navigate("/auth/register");
              }}
            />
          </>
        ) : (
          // Authenticated: Show normal action buttons
          <>
            <Button
              text="Try Again"
              variant="solid"
              className="w-full md:w-[10rem] self-end"
              onClick={handleRestart}
            />

            <Button
              text="Share"
              variant="outline"
              className="w-full md:w-[10rem] border-neutral-300 text-neutral-700 hover:border-neutral-400"
              onClick={() => {
                // Share functionality
                console.log("Sharing measurements");
              }}
            />

            <Button
              text={createMeasurements.isPending ? "Saving..." : "Save"}
              variant="solid"
              disabled={createMeasurements.isPending}
              className="w-full md:w-[10rem] bg-[#A67C5A] hover:bg-[#8B6A4D] text-white disabled:bg-gray-400"
              onClick={() => {
                // Use accurate measurements if available, otherwise fall back to original
                const measurementsToSave = accurateMeasurements || measurements;

                if (!measurementsToSave || !measurements || !height) {
                  toast.error("No measurements available to save");
                  return;
                }

                let bust, waist, hips, dressSize;

                // Use edited measurements if available, otherwise use accurate or original
                if (editedMeasurements) {
                  bust = editedMeasurements.bust ?? editedMeasurements.chest ?? 0;
                  waist = editedMeasurements.waist;
                  hips = editedMeasurements.hips ?? 0;
                  dressSize = editedMeasurements.dressSize
                    ? Number(editedMeasurements.dressSize)
                    : Number(measurements?.dressSize?.us) || 12;
                } else if (accurateMeasurements) {
                  // Use accurate measurements from visualization method (in cm)
                  bust = Math.round(
                    accurateMeasurements.bust.circumference / 2.54
                  ); // Convert to inches
                  waist = Math.round(
                    accurateMeasurements.waist.circumference / 2.54
                  );
                  hips = Math.round(
                    accurateMeasurements.hip.circumference / 2.54
                  );
                  dressSize = Number(measurements.dressSize?.us) || 12; // Use original dress size calculation
                } else {
                  // Fall back to original measurements (already in inches)
                  bust = Math.round(measurements.measurements.bust / 2.54);
                  waist = Math.round(measurements.measurements.waist / 2.54);
                  hips = Math.round(measurements.measurements.hip / 2.54);
                  dressSize = Number(measurements.dressSize.us);
                }

                const measurementData = {
                  gender,
                  bust,
                  waist,
                  hips,
                  height: editedMeasurements?.height
                    ? editedMeasurements.height
                    : Math.round(height * 0.393701), // Convert cm to inches
                  dressSize: String(dressSize),
                  skinTone:
                    editedMeasurements?.skinTone ||
                    skinTone?.name?.toLowerCase() ||
                    "medium",
                };

                console.log("Saving accurate measurements:", {
                  original: measurements?.measurements,
                  accurate: accurateMeasurements,
                  apiData: measurementData,
                });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                createMeasurements.mutate(measurementData as unknown as any, {
                  onSuccess: () => {
                    if (isGuest) {
                      toast.success(
                        "Measurements saved! Continue shopping as guest."
                      );
                      navigate("/shop");
                    } else {
                      navigate("/dashboard/profile");
                    }
                  },
                });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
