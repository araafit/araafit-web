export function FabricRequestStepperLines({
  stepIndex,
  className,
}: {
  stepIndex: number;
  className?: string;
}) {
  const steps = ["fabric", "style", "measurement", "review"];

  return (
    <div
      className={`inline-flex items-center gap-1 self-center overflow-x-auto w-full justify-center ${className}`}
    >
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col gap-2 flex-shrink-0">
          <div
            className={`w-16 md:w-[9rem] h-2 ${
              stepIndex >= idx ? "bg-primary-500" : "bg-neutral-100"
            } rounded-full`}
          />

          <span
            className={`font-medium text-xs md:text-[14px] ${
              stepIndex >= idx ? "text-primary-500" : "text-neutral-300"
            } capitalize text-center whitespace-nowrap`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}


