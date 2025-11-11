import {
  Confirmation,
  MeasurementMethod,
  Position,
  SmartCapture,
  PhotoUpload,
  HeightInput,
} from "./automated/import-entry";
import { PickGender } from "./import-entry";
import { GetMeasuredProvider, useGetMeasured } from "./context/get-measured-context";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* ----------------------------------------------------------------------- */

const StepContent = () => {
  const { currentStep, stepTo } = useGetMeasured();
  const location = useLocation();
  // console.log("currentStep", currentStep);

  // Always start at gender when landing on /get-measured (index route)
  useEffect(() => {
    if (location.pathname === "/get-measured" && currentStep !== 0) {
      stepTo(0);
    }
    // Run only on mount for this path
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Toggle between SmartCapture (camera) and PhotoUpload (file upload)
  // Change this flag to switch between the two methods
  const usePhotoUpload = true; // Set to false to use SmartCapture (camera)

  switch (currentStep) {
    case 0:
      return <PickGender />;
    case 1:
      return <MeasurementMethod />;
    case 2:
      return usePhotoUpload ? <PhotoUpload /> : <Position />;
    case 3:
      return usePhotoUpload ? <HeightInput /> : <SmartCapture />;
    case 4:
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
