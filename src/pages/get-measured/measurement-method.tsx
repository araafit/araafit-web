import { useState } from "react";
import { WarningIcon } from "@phosphor-icons/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useGetMeasured } from "./context/get-measured-context";
import { MeasurementStepperLines } from "./stepper-lines";
import Button from "../../shared-components/button";
import { useNavigate } from "react-router-dom";
/* --------------------------------------------------------------------- */

/**
 *
 * @returns ReactElement
 */
export function MeasurementMethod() {
  const navigate = useNavigate();

  const [method, setMethod] = useState<"manual" | "automated" | undefined>(
    undefined
  );
  const { currentStep, stepTo } = useGetMeasured();

  const Radio = ({ isClicked }: { isClicked: boolean }) => (
    <div
      className={`h-[1rem] w-[1rem] rounded-full border 
       flex items-center justify-center ${
         isClicked ? "border-primary-500" : "border-[#E8E8E8]"
       }`}
    >
      {isClicked && (
        <div className={`size-[6px] bg-primary-500 rounded-full`} />
      )}
    </div>
  );

  const OpenModal = () => {
    if (method === "automated") {
      stepTo(currentStep + 1);
    } else {
      navigate("/get-measured/manual");
    }
  };


  return (
    <div className="flex flex-col gap-8 md:gap-[12rem] relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="lg:absolute top-0 left-0 w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 shadow-sm z-10"
          aria-label="Go back"
        >
          <IconArrowLeft size={16} className="text-gray-600" />
        </button>

        <div className="w-full flex flex-col gap-7">
          <MeasurementStepperLines stepIndex={currentStep} />

          <div className="w-full max-w-[51rem] flex flex-col gap-6">
            <div>
              <h2 className="text-xl md:text-[2rem] text-[#1C1C1C] font-semibold mb-2">
                Measurement Method
              </h2>
              <p className="text-neutral-500 font-inter text-sm md:text-base">
                How would you like to get measured?
              </p>
            </div>

            <div
              className={`flex items-start gap-2 bg-[#FFF8EB] rounded-md border border-[#B47409] py-2 px-4 ${
                method === "automated" ? "visible" : "invisible"
              }`}
            >
              <WarningIcon className="text-[#F59E0B] flex-shrink-0 mt-0.5" />

              <div className="w-full flex flex-col">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <span className="text-sm font-medium">Instruction</span>
                </div>

                <p className="text-[#B47409] font-light text-sm">
                  If your body has undergone augmentation, you might need to
                  input measurements that were taken manually.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8">
              <div
                className={`w-full md:w-[19.625rem] rounded-md py-4 md:py-6 px-4 border ${
                  method === "manual"
                    ? "border-primary-500"
                    : "border-neutral-100"
                } flex flex-col gap-2 hover:border-primary-500 cursor-pointer transition-colors`}
                onClick={() => setMethod("manual")}
              >
                <Radio isClicked={method === "manual"} />
                <h4 className="text-base md:text-[18px] font-inter">
                  Enter Measurements Manually
                </h4>
                <p className="text-neutral-500 text-sm md:text-base">
                  Prefer to take control? Fill in your measurements manually to
                  get a perfect fit tailored just for you.
                </p>
              </div>

              <div
                className={`w-full md:w-[19.625rem] rounded-md py-4 md:py-6 px-4 border ${
                  method === "automated"
                    ? "border-primary-500"
                    : "border-neutral-100"
                } flex flex-col gap-2 hover:border-primary-500 cursor-pointer transition-colors`}
                onClick={() => setMethod("automated")}
              >
                <Radio isClicked={method === "automated"} />
                <h4 className="text-base md:text-[18px] font-inter">
                  Get Measured with AraaFit
                </h4>
                <p className="text-neutral-500 text-sm md:text-base">
                  Let AraaFit handle it for you! Using your camera, we'll
                  capture your body measurements quickly and securely.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          text="Continue"
          variant="solid"
          disabled={!method}
          className="w-full md:w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
          onClick={OpenModal}
        />
    </div>
  );
}
