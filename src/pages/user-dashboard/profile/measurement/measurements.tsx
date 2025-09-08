import React from "react";
import Button from "../../../../shared-components/button";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import araafitWatermark from "./araafit-watermark.png";
import { measurementInProfile } from "../../_data/_profile";
import { useNavigate } from "react-router-dom";
// import showToast from "../../../../utils/notification";
/* -------------------------------------------------------------- */

/**
 * All measurement
 *
 * @returns ReactElement
 */
export default function Measurements() {
  const navigate = useNavigate();

  const waterMarkStyle: React.CSSProperties = {
    backgroundImage: `url(${araafitWatermark})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "bottom",
    objectFit: "fill",
  };

  return (
    <div className="size-full bg-white py-5 px-8 rounded-md flex flex-col items-center justify-center gap-6">
      <div className="w-[30.125rem]">
        <div className="flex flex-col items-center gap-4">
          <h5 className="text-[2rem] font-semibold">Measurement Summary</h5>
          <p className="text-neutral-500 font-light text-center">
            We’ve successfully captured your measurements and detected your skin
            tone.
          </p>
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
                {measurementInProfile.bust}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Waist</span>
              <span className="font-semibold text-neutral-950">
                {measurementInProfile.waist}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Hip (inches)</span>
              <span className="font-semibold text-neutral-950">
                {measurementInProfile.hip}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Height</span>
              <span className="font-semibold text-neutral-950">
                {measurementInProfile.height}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Dress size</span>
              <span className="font-semibold text-neutral-950">
                {measurementInProfile.dressSize}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Skin Tone</span>
              <span className="font-semibold text-neutral-950">
                {measurementInProfile.skinTone}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[30.125rem] flex justify-end">
        <Button
          type="button"
          text="Share"
          variant="outline"
          className="w-[175px] border border-neutral-100 text-neutral-950"
        />
      </div>
    </div>
  );
}
