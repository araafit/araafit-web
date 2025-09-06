import {
  Confirmation,
  MeasurementMethod,
  Position,
  SmartCapture,
} from "./automated/import-entry";
import { GetMeasuredProvider, useGetMeasured } from "./context/get-measured-context";

/* ----------------------------------------------------------------------- */

const StepContent = () => {
  const { currentStep } = useGetMeasured();

  switch (currentStep) {
    case 0:
      return <MeasurementMethod />;
    case 1:
      return <Position />;
    case 2:
      return <SmartCapture />;
    case 3:
      return <Confirmation />;
    default:
      return null;
  }
};

/**
 * Get Measured layout
 *
 *
 * @returns ReactElement
 */
export default function GetMeasuredLayout() {
  return (
    <section className="h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
      <div className="w-full h-[809px] bg-white flex justify-center border rounded-md p-14">
        <GetMeasuredProvider>
          <StepContent />
        </GetMeasuredProvider>
      </div>
    </section>
  );
}
