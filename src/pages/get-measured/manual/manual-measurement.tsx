import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared-components/button";
import {
  useSizeChart,
  useCreateMeasurements,
  useMeasurements,
} from "../../../hooks/measurements.hooks";
import Spinner from "../../../shared-components/spinner";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/use-auth";
import { useMeasurementsStore } from "../../../shared-hooks/state-store";

/* ------------------------------------------------------------- */

const waterMarkStyle: React.CSSProperties = {
  backgroundImage: `url(/araafit-watermark.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "bottom",
  objectFit: "fill",
};

/**
 * Manual measurement
 *
 * @returns ReactElement
 */
export function ManualMeasurement() {
  const navigate = useNavigate();
  const { isAuthenticated, isGuest } = useAuth();
  const [searchParams] = useSearchParams();
  const gender = searchParams.get("gender") || undefined;

  // API hooks
  const { data: sizeChart, isLoading: sizeChartLoading } = useSizeChart(gender);
  console.log(sizeChart);
  const { data: existingMeasurements } = useMeasurements();
  const createMeasurements = useCreateMeasurements();
  const updateMeasurement = useMeasurementsStore(
    (state) => state.updateMeasurement
  );

  // Local state for selected measurements
  const [selectedValues, setSelectedValues] = useState<
    Record<string, number | string>
  >({});

  // Prefill existing measurements if available
  useEffect(() => {
    if (existingMeasurements) {
      setSelectedValues((prev) => {
        const updated: Record<string, number | string> = { ...prev };
        const keys = sizeChart ? Object.keys(sizeChart) : [];
        keys.forEach((key) => {
          if (key === "skinTones") {
            updated.skinTone = (existingMeasurements.skinTone as string) || "";
            return;
          }
          if (key === "chest") {
            updated.chest =
              (existingMeasurements as unknown as Record<string, number | null>)
                .chest ??
              (existingMeasurements.bust as number) ??
              0;
            return;
          }
          const value = (
            existingMeasurements as unknown as Record<string, number | null>
          )[key];
          if (typeof value === "number") {
            updated[key] = value;
          }
        });
        return updated;
      });
    }
  }, [existingMeasurements, sizeChart]);

  const handleSelection = (type: string, value: number | string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Determine required fields based on the sizeChart response (exclude skinTones)
  const orderedKeys = (() => {
    if (!sizeChart) return [] as string[];
    const keys = Object.keys(sizeChart);
    const preferred = [
      "bust",
      "chest",
      "waist",
      "hips",
      "shoulder",
      "inseam",
      "height",
      "dressSize",
      "skinTones",
    ];
    const first = preferred.filter((k) => keys.includes(k));
    const rest = keys.filter((k) => !preferred.includes(k));
    return [...first, ...rest];
  })();

  const requiredKeys = orderedKeys.filter((k) => k !== "skinTones");
  const measurementNotSelected = requiredKeys.some((key) => {
    const val = selectedValues[key];
    return val === 0 || val === "" || val === undefined || val === null;
  });

  const saveData = async () => {
    if (!isAuthenticated && !isGuest) {
      // Persist to local store and go to summary for guest/unauthenticated flow
      const bustVal =
        (selectedValues["bust"] as number) ??
        (selectedValues["chest"] as number) ??
        0;
      const waistVal = (selectedValues["waist"] as number) ?? 0;
      const hipsVal = (selectedValues["hips"] as number) ?? 0;
      const heightVal =
        typeof selectedValues["height"] === "string"
          ? (selectedValues["height"] as string)
          : String(selectedValues["height"] ?? "");
      const dressSizeVal = (selectedValues["dressSize"] as number) ?? 0;
      const skinToneVal = (selectedValues["skinTone"] as string) ?? "";

      updateMeasurement("bust", bustVal);
      updateMeasurement("waist", waistVal);
      updateMeasurement("hip", hipsVal);
      updateMeasurement("height", heightVal);
      updateMeasurement("dressSize", dressSizeVal);
      updateMeasurement("skinTone", skinToneVal);

      navigate("/get-measured/summary");
      return;
    }

    const payload = {
      bust:
        (selectedValues["bust"] as number) ??
        (selectedValues["chest"] as number) ??
        0,
      waist: (selectedValues["waist"] as number) ?? 0,
      hips: (selectedValues["hips"] as number) ?? 0,
      height: (selectedValues["height"] as number) ?? 0,
      dressSize: (selectedValues["dressSize"] as number) ?? 0,
      skinTone: (selectedValues["skinTone"] as string) ?? "",
    };

    createMeasurements.mutate(payload, {
      onSuccess: () => {
        if (isGuest) {
          // For guests, stay on the measurement page or redirect to continue guest flow
          toast.success("Measurements saved! Continue shopping as guest.");
          navigate("/shop");
        }

        // For authenticated users, redirect to dashboard
        if (isAuthenticated) {
          toast.success("Measurements saved successfully!");
          navigate("/dashboard/profile");
        }
      },
    });
  };

  if (sizeChartLoading) {
    return (
      <section className="min-h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
        <div className="w-full min-h-[809px] bg-white flex justify-center items-center border rounded-md p-4 md:p-14">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <span className="text-sm md:text-base">
              Loading measurement options
            </span>
            <Spinner
              isLoading={sizeChartLoading}
              speed="fast"
              size="lg"
              arcColor="#9A6C50"
            />
          </div>
        </div>
      </section>
    );
  }

  const isEmpty =
    !sizeChart ||
    (typeof sizeChart === "object" &&
      sizeChart !== null &&
      Object.keys(sizeChart).length === 0);

  if (isEmpty) {
    return (
      <section className="min-h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
        <div className="w-full min-h-[809px] bg-white flex justify-center items-center border rounded-md p-4 md:p-14">
          <div className="flex flex-col items-center justify-center gap-3">
            <h5 className="text-lg md:text-xl font-semibold text-center">
              No measurement options
            </h5>
            <p className="text-neutral-500 text-sm md:text-base text-center px-4">
              We couldn't find any measurement options for the selected gender.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => navigate(-1)}
              text="Go back"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
      <div className="w-full min-h-[809px] bg-white flex justify-center border rounded-md p-4 md:p-14">
        <button
          type="button"
          className="absolute top-4 md:top-[32px] left-4 md:left-[200px] w-8 h-8 md:w-[40px] md:h-[40px] rounded-md border border-[#E8E8E8] flex flex-col items-center justify-center bg-white text-neutral-800 cursor-pointer z-10 hover:bg-gray-50 transition-colors"
          onClick={() => navigate(-1)}
          title="Go back"
        >
          <ArrowLeftIcon
            size={20}
            className="md:hidden text-neutral-800 block"
          />
          <ArrowLeftIcon
            size={50}
            className="hidden md:block h-full text-neutral-800"
          />
        </button>

        <div
          className="w-full max-w-4xl flex flex-col gap-4 md:gap-6"
          style={waterMarkStyle}
        >
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <h5 className="text-xl md:text-[2rem] font-semibold text-center">
              Manual Measurement
            </h5>
            <p className="text-neutral-500 font-light text-center text-sm md:text-base px-4">
              Enter your measurements to keep your fit just right.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4 md:gap-6">
            {orderedKeys.map((key) => {
              if (key === "skinTones") {
                const tones =
                  ((
                    sizeChart as unknown as Record<
                      string,
                      { name: string; hex: string }[]
                    >
                  )[key] as { name: string; hex: string }[]) || [];
                return (
                  <div
                    key={key}
                    className="w-full flex flex-col gap-2 md:gap-3"
                  >
                    <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                      Skin Tone:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                      {tones.map((tone) => (
                        <Button
                          key={tone.name}
                          style={{ backgroundColor: tone.hex }}
                          className={`w-full md:w-[58px] h-[36px] md:h-[44px] rounded-md border hover:border-neutral-700 focus:border-neutral-700 cursor-pointer ${
                            selectedValues.skinTone === tone.name
                              ? "border-neutral-700 ring-2 ring-neutral-700"
                              : "border-gray-300"
                          }`}
                          onClick={() => handleSelection("skinTone", tone.name)}
                        />
                      ))}
                    </div>
                  </div>
                );
              }

              const items =
                (sizeChart[key] as { id: string; value: number; label?: string }[]) || [];
              console.log("items", items);
              console.log("key", key, sizeChart);
              const label = ["dressSize", "clotheSize"].includes(key)
                ? "Size"
                : key === "hips"
                ? "Hips"
                : key === "chest"
                ? "Chest"
                : key.charAt(0).toUpperCase() + key.slice(1);

              return (
                <div key={key} className="w-full flex flex-col gap-2 md:gap-3">
                  <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                    {label}:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                    {items.map((item) => (
                      <Button
                        key={item.id}
                        type="button"
                        text={item.label || String(item.value)}
                        variant="outline"
                        className={`w-full md:w-[58px] h-[36px] md:h-[44px] text-xs md:text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                          selectedValues[key] === item.value
                            ? "border-primary-950 bg-primary-50"
                            : ""
                        }`}
                        onClick={() => handleSelection(key, item.value)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            <Button
              variant="solid"
              onClick={saveData}
              disabled={measurementNotSelected || createMeasurements.isPending}
              className="w-full md:w-[175px] self-end mt-4 md:mt-2 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-1">
                {!createMeasurements.isPending && (
                  <span className="text-sm md:text-base">Save</span>
                )}
                <Spinner
                  size="md"
                  speed="fast"
                  isLoading={
                    createMeasurements.isPending && !createMeasurements.isError
                  }
                  circleColor="#55322e"
                />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
