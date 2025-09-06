import { useEffect, useState } from "react";
import { useGetMeasured } from "../context/get-measured-context";

/* ------------------------------------------------------------------ */

export function CaptureProcessLoader({ isOpen }: { isOpen: boolean }) {
  const maxWidth = 325;
  const [loadCount, setLoadCount] = useState(0);
  const { currentStep, stepTo } = useGetMeasured();

  // Animate loader width until it reaches maxWidth
  useEffect(() => {
    if (!isOpen) {
      setLoadCount(0);
    }
    
    if (loadCount < maxWidth) {
      const interval = setInterval(() => {
        setLoadCount((prev) => {
          const next = prev + 8;
          return next >= maxWidth ? maxWidth : next;
        });
      }, 200);
      return () => clearInterval(interval);
    }

    if (loadCount === maxWidth) {
      stepTo(currentStep + 1);
      window.location.reload();
    }
  }, [loadCount, isOpen]);

  return (
    <div
      className={`w-full bg-white ${
        !isOpen ? "hidden" : "block absolute h-[809px] left-0 top-0"
      }`}
    >
      <div className="size-full flex items-center justify-center">
        <div className="w-[325px] flex flex-col gap-4">
          <div className="w-full h-[5px] bg-primary-50 rounded-full relative">
            <div
              className="absolute h-[inherit] left-0 bg-primary-500 rounded-full transition-[width] ease-in"
              style={{ width: loadCount }}
            />
          </div>
          <p className="text-[0.847rem]">
            Processing image. This may take a few seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
