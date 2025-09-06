import { useState, useEffect, useCallback } from "react";
import {
  Sparkle,
  PencilSimple,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { MeasurementStepperLines } from "../stepper-lines";
import { useGetMeasured } from "../context/get-measured-context";
import Button from "../../../shared-components/button";
import {
  createMeasurementService,
  type MeasurementResult,
} from "../../../services/measurement";
import { extractSkinToneFromPhoto } from "../../../services/measurement/skin-tone-extractor";

/* ------------------------------------------------------------------- */

export function Confirmation() {
  const { currentStep, stepTo, frontPhoto, sidePhoto, height, resetProgress } =
    useGetMeasured();
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

      // Extract skin tone from front photo
      setProgress({ progress: 0.9, stage: "Analyzing skin tone..." });
      try {
        const extractedSkinTone = await extractSkinToneFromPhoto(frontPhoto);
        setSkinTone(extractedSkinTone);
      } catch (skinToneError) {
        console.warn("Skin tone extraction failed:", skinToneError);
        // Use fallback skin tone
        setSkinTone({
          hex: "#D4A574",
          rgb: { r: 212, g: 165, b: 116 },
          name: "Medium",
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
  }, [frontPhoto, sidePhoto, height]);

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
        <div className="w-full flex flex-col gap-5">
          <MeasurementStepperLines stepIndex={currentStep} />

          <div className="w-[51rem] flex flex-col gap-6">
            <div>
              <h2 className="text-[2rem] text-[#1C1C1C] font-semibold mb-2">
                Processing Your Measurements
              </h2>
              <p className="text-neutral-500 font-inter">
                Our AI is analyzing your photos to extract precise
                measurements...
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
                <Sparkle
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500"
                  size={24}
                />
              </div>

              <div className="text-center">
                <p className="text-lg font-medium text-neutral-700 mb-2">
                  {progress.stage}
                </p>
                <div className="w-80 bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress * 100}%` }}
                  />
                </div>
                <p className="text-sm text-neutral-500 mt-2">
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
        <div className="w-full flex flex-col gap-5">
          <MeasurementStepperLines stepIndex={currentStep} />

          <div className="w-[51rem] flex flex-col gap-6">
            <div>
              <h2 className="text-[2rem] text-[#1C1C1C] font-semibold mb-2">
                Processing Failed
              </h2>
              <p className="text-neutral-500 font-inter">
                We encountered an issue processing your measurements
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 mt-8">
          <button
            className="w-[10rem] px-4 py-2 border border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg flex items-center justify-center gap-2 transition-colors"
            onClick={handleRestart}
          >
            <ArrowCounterClockwise size={16} />
            <span>Restart</span>
          </button>

          <Button
            text="Try Again"
            variant="solid"
            className="w-[10rem] self-end"
            onClick={retake}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col gap-5">
        <MeasurementStepperLines stepIndex={currentStep} />

        <div className="w-[51rem] flex flex-col gap-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-[2rem] text-[#1C1C1C] font-semibold mb-4">
              Measurement Summary
            </h2>
            <p className="text-neutral-500 font-inter text-lg">
              We've successfully captured your measurements and detected your
              skin tone.
            </p>
          </div>

          {measurements && (
            <>
              {/* Measurements Section */}
              <div className="bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#1C1C1C]">
                    Measurement
                  </h3>
                  <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors">
                    <PencilSimple size={16} />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                    <span className="text-lg text-neutral-700">Bust</span>
                    <span className="text-xl font-semibold text-[#1C1C1C]">
                      {Math.round(measurements.measurements.bust)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                    <span className="text-lg text-neutral-700">Waist</span>
                    <span className="text-xl font-semibold text-[#1C1C1C]">
                      {Math.round(measurements.measurements.waist)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                    <span className="text-lg text-neutral-700">
                      Hip (inches)
                    </span>
                    <span className="text-xl font-semibold text-[#1C1C1C]">
                      {Math.round(measurements.measurements.hip / 2.54)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                    <span className="text-lg text-neutral-700">Height</span>
                    <span className="text-xl font-semibold text-[#1C1C1C]">
                      {Math.floor(measurements.measurements.height / 30.48)}'
                      {Math.round(
                        (measurements.measurements.height % 30.48) / 2.54
                      )}
                      "
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                    <span className="text-lg text-neutral-700">Dress Size</span>
                    <span className="text-xl font-semibold text-[#1C1C1C]">
                      {measurements.dressSize.us}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skin Tone Section */}
              {skinTone && (
                <div className="bg-white">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-neutral-700">Skin Tone</span>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-8 rounded-lg border border-neutral-200"
                        style={{ backgroundColor: skinTone.hex }}
                      />
                      <span className="text-lg font-medium text-[#1C1C1C]">
                        {skinTone.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-12">
        
        <Button
          text="Try Again"
          variant="solid"
          className="w-[10rem] self-end"
          onClick={handleRestart}
        />

        <Button
          text="Share"
          variant="outline"
          className="w-[10rem] border-neutral-300 text-neutral-700 hover:border-neutral-400"
          onClick={() => {
            // Share functionality
            console.log("Sharing measurements");
          }}
        />

        <Button
          text="Save"
          variant="solid"
          className="w-[10rem] bg-[#A67C5A] hover:bg-[#8B6A4D] text-white"
          onClick={() => {
            // Save functionality
            console.log("Saving measurements:", measurements);
          }}
        />
      </div>
    </div>
  );
}
