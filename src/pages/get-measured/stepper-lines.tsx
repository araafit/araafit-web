export function MeasurementStepperLines({ stepIndex }: { stepIndex: number }) {
  const steps = ["method", "position", "smart capture", "confirmation"];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <div
            className={`w-[10rem] h-2 ${
              stepIndex >= idx ? "bg-primary-500" : "bg-neutral-100"
            } rounded-full`}
          />

          <span
            className={`font-medium text-[14px] ${ stepIndex >= idx ? "text-primary-500" : "text-neutral-100"} capitalize`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
