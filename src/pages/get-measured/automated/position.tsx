import Button from "../../../shared-components/button";
import { MeasurementStepperLines } from "../stepper-lines";
import { useGetMeasured } from "../context/get-measured-context";
import { WarningIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { CaptureProcessLoader } from "./capture-process-loader";
import { useSwitch } from "../../../shared-hooks/switch";
/* ------------------------------------------------------------------- */

export function Position() {
  const { toggleSwitch: showLoader, switchValue: isOpen } = useSwitch();
  const { currentStep } = useGetMeasured();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 307, height: 412 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  }, []);

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="w-full flex flex-col gap-5">
          <MeasurementStepperLines stepIndex={currentStep} />

          <div className="w-[51rem] flex flex-col gap-6">
            <h2 className="text-[2rem] text-[#1C1C1C] font-semibold mb-2">
              Smart Capture
            </h2>

            <div
              className={`flex items-start gap-2 bg-[#FFF8EB] rounded-md border border-[#B47409] py-2 px-4`}
            >
              <WarningIcon className="text-[#F59E0B]" />

              <div className="w-full flex flex-col">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <span>Instruction</span>
                </div>

                <div className="flex flex-col gap-2 text-[#B47409]">
                  <p>
                    1. Follow on-screen instructions to align your body within
                    the provided frame or outline.
                  </p>

                  <p>
                    2. Take a full-body picture from the front while we also
                    extract your skin tone.
                  </p>
                </div>
              </div>
            </div>

            {/* Access device camera */}
            <div className="w-full flex items-center justify-center">
              <video
                id="camera-stream"
                autoPlay
                playsInline
                className="w-[19.1875rem] h-[25.75rem] rounded-lg border border-gray-300 bg-black"
                style={{ objectFit: "cover" }}
                ref={videoRef}
              />
            </div>
          </div>
        </div>

        <Button
          text="Capture"
          variant="solid"
          className="w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
          onClick={showLoader}
        />
      </div>

      <CaptureProcessLoader isOpen={isOpen} />
    </div>
  );
}
