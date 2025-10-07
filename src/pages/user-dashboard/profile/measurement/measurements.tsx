import React from "react";
import Button from "../../../../shared-components/button";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import araafitWatermark from "./araafit-watermark.png";
import { useNavigate } from "react-router-dom";
import { useMeasurementsSummary } from "../../../../hooks/measurements.hooks";
/* -------------------------------------------------------------- */

/**
 * All measurement
 *
 * @returns ReactElement
 */
export default function Measurements() {
  const navigate = useNavigate();
  const {
    data: measurementsSummary,
    isLoading,
    error,
  } = useMeasurementsSummary();

  const waterMarkStyle: React.CSSProperties = {
    backgroundImage: `url(${araafitWatermark})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "bottom",
    objectFit: "fill",
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white py-5 px-8 rounded-md flex flex-col items-center gap-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2">Loading measurements...</span>
        </div>
      </div>
    );
  }

  if (error || !measurementsSummary) {
    return (
      <div className="w-full bg-white py-5 px-8 rounded-md flex flex-col items-center gap-6">
        <div className="text-center py-20">
          <h5 className="text-[2rem] font-semibold mb-4">
            No Measurements Found
          </h5>
          <p className="text-neutral-500 font-light mb-6">
            Get started by taking your measurements for a perfect fit.
          </p>
          <Button
            text="Take Measurements"
            variant="solid"
            onClick={() => navigate("/get-measured")}
          />
        </div>
      </div>
    );
  }

  const { measurements, formattedHeight, hasCompleteMeasurements } =
    measurementsSummary;

  return (
    <div className="w-full bg-white py-5 px-8 rounded-md flex flex-col items-center gap-6">
      <div className="w-full max-w-[30.125rem]">
        <div className="flex flex-col items-center gap-4">
          <h5 className="text-[2rem] font-semibold">Measurement Summary</h5>
          {hasCompleteMeasurements && (
            <div className="w-full max-w-[30.125rem] flex justify-end bg-[#F6FEF9] text-[#15803c] text-[14px] border border-[#15803C] p-2 rounded-md mb-3">
              <p>
                We've successfully capture your measurement and detected your
                skin tone.
              </p>
            </div>
          )}

          {/* <p className="text-neutral-500 font-light text-center">
            {hasCompleteMeasurements
              ? "We've successfully captured your measurements and detected your skin tone."
              : "Some measurements are missing. Update them for a better fit."}
          </p> */}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items justify-between">
            <span className="font-medium text-[18px] text-neutral-950">
              Measurement
            </span>

            <div
              className="flex items-center gap-2 font-light cursor-pointer"
              onClick={() => navigate("/dashboard/profile/get-measured")}
            >
              <PencilSimpleIcon />
              <span>Edit</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-6" style={waterMarkStyle}>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Bust</span>
              <span className="font-semibold text-neutral-950">
                {measurements.bust} inches
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Waist</span>
              <span className="font-semibold text-neutral-950">
                {measurements.waist} inches
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Hip (inches)</span>
              <span className="font-semibold text-neutral-950">
                {measurements.hips} inches
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Height</span>
              <span className="font-semibold text-neutral-950">
                {formattedHeight}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Dress size</span>
              <span className="font-semibold text-neutral-950">
                {measurements.dressSize}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Skin Tone</span>
              <span className="font-semibold text-neutral-950 capitalize">
                {measurements.skinTone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
