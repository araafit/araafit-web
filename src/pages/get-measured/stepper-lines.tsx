export function MeasurementStepperLines({ stepIndex }: { stepIndex: number }) {
  // Determine if we're using photo upload (which replaces position step)
  const usePhotoUpload = true; // This should match the flag in get-measured.tsx
  const steps = usePhotoUpload 
    ? ["method", "upload photos", "enter height", "confirmation"]
    : ["method", "position", "smart capture", "confirmation"];

  return (
    <div className="inline-flex items-center gap-1 self-center">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <div
            className={`w-[10rem] h-2 ${
              stepIndex >= idx ? "bg-primary-500" : "bg-neutral-100"
            } rounded-full`}
          />

          <span
            className={`font-medium text-[14px] ${
              stepIndex >= idx ? "text-primary-500" : "text-neutral-100"
            } capitalize`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
