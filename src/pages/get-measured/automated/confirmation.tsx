import { MeasurementStepperLines } from "../stepper-lines";
import { useGetMeasured } from "../context/get-measured-context";
import Button from "../../../shared-components/button";

/* ------------------------------------------------------------------- */

export function Confirmation() {
  const { currentStep, stepTo } = useGetMeasured();

  const retake = () => {
    stepTo(0);
    window.location.reload();
  }

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col gap-5">
        <MeasurementStepperLines stepIndex={currentStep} />

        <div className="w-[51rem] flex flex-col gap-6">
          <h2 className="text-[2rem] text-[#1C1C1C] font-semibold mb-2">
            Smart Capture
          </h2>

          <div className="w-full flex items-center justify-center">
            {/* <img src={capturedImage} alt="" className="size-[500px]" /> */}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-6">
        <Button
          text="Share"
          variant="outline"
          className="w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed border-neutral-100 text-neutral-950"
          onClick={retake}
        />

        <Button
          text="Save"
          variant="solid"
          className="w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
