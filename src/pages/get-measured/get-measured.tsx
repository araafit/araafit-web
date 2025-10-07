import {
  Confirmation,
  MeasurementMethod,
  Position,
  SmartCapture,
  PhotoUpload,
  HeightInput,
} from "./automated/import-entry";
import { GetMeasuredProvider, useGetMeasured } from "./context/get-measured-context";

/* ----------------------------------------------------------------------- */

const StepContent = () => {
  const { currentStep } = useGetMeasured();
  console.log("currentStep", currentStep);

  // Toggle between SmartCapture (camera) and PhotoUpload (file upload)
  // Change this flag to switch between the two methods
  const usePhotoUpload = true; // Set to false to use SmartCapture (camera)

  switch (currentStep) {
    case 0:
      return <MeasurementMethod />;
    case 1:
      return usePhotoUpload ? <PhotoUpload /> : <Position />;
    case 2:
      return usePhotoUpload ? <HeightInput /> : <SmartCapture />;
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
export function GetMeasured() {
  return (
    <section className="min-h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
      <div className="w-full min-h-[809px] bg-white flex justify-center border rounded-md p-4 lg:p-14">
        <GetMeasuredProvider>
          <StepContent />
        </GetMeasuredProvider>
      </div>
    </section>
  );
}
