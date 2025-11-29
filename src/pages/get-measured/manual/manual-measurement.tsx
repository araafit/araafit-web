import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared-components/button";
import { useCreateMeasurements, useMeasurements } from "../../../hooks/measurements.hooks";
import { useSkinTonesList } from "../../../hooks/admin-settings.hooks";
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
  const gender = (searchParams.get("gender") || undefined) as "male" | "female" | undefined;

  // API hooks
  const { data: skinTones } = useSkinTonesList();
  const { data: existingMeasurements } = useMeasurements();
  const createMeasurements = useCreateMeasurements();
  const updateMeasurement = useMeasurementsStore(
    (state) => state.updateMeasurement
  );

  // Local state for selected measurements
  const [selectedValues, setSelectedValues] = useState<
    Record<string, number | string>
  >({});

  // Optional name for the measurement set (authenticated users)
  const [measurementName, setMeasurementName] = useState<string>("");

  // Prefill existing measurements if available (from the aggregated measurements object)
  useEffect(() => {
    if (existingMeasurements?.measurements) {
      const base = existingMeasurements.measurements;
      setSelectedValues((prev) => {
        const updated: Record<string, number | string> = { ...prev };
        updated.skinTone = (base.skinTone as string) || "";

        const chestOrBust =
          (base as unknown as Record<string, number | null>).chest ??
          (base.bust as number) ??
          0;

        if (gender === "male") updated.chest = chestOrBust;
        else updated.bust = chestOrBust;

        const keys =
          (gender || "female") === "male"
            ? (["waist", "height", "shoulder", "neck"] as const)
            : (["waist", "hips", "height", "shoulder", "neck"] as const);

        keys.forEach((k) => {
          const v = (base as unknown as Record<string, number | null>)[k];
          if (typeof v === "number") updated[k] = v;
        });

        return updated;
      });
    }
  }, [existingMeasurements, gender]);

  const handleSelection = (type: string, value: number | string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Required fields per gender
  const requiredFields =
    (gender || "female") === "male"
      ? (["chest", "waist", "height"] as const)
      : (["bust", "waist", "hips", "height"] as const);

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
      const skinToneVal = (selectedValues["skinTone"] as string) ?? "";

      updateMeasurement("bust", bustVal);
      updateMeasurement("waist", waistVal);
      updateMeasurement("hip", hipsVal);
      updateMeasurement("height", heightVal);
      updateMeasurement("skinTone", skinToneVal);

      navigate(`/get-measured/summary?gender=${gender}`);
      return;
    }

    const payload = {
      gender,
      bust:
        (selectedValues["bust"] as number) ??
        (selectedValues["chest"] as number) ??
        0,
      waist: (selectedValues["waist"] as number) ?? 0,
      hips: (selectedValues["hips"] as number) ?? 0,
      height: (selectedValues["height"] as number) ?? 0,
      skinTone: (selectedValues["skinTone"] as string) ?? "",
      name: measurementName || undefined,
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
          navigate("/dashboard/profile?tab=measurement");
        }
      },
    });
  };

  if (!gender) {
    return (
      <section className="min-h-screen px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
        <div className="w-full min-h-[809px] bg-white flex justify-center items-center border rounded-md p-4 md:p-14">
          <div className="flex flex-col items-center justify-center gap-3">
            <h5 className="text-lg md:text-xl font-semibold text-center">
              Gender not selected
            </h5>
            <p className="text-neutral-500 text-sm md:text-base text-center px-4">
              Please go back and select your gender to continue manual measurement.
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
            {/* Measurement set name (optional, for authenticated users) */}
            {isAuthenticated && (
              <div className="w-full flex flex-col gap-2 md:gap-3">
                <span className="text-sm md:text-base text-[#1C1C1C] font-medium">
                  Measurement set name (optional)
                </span>
                <input
                  type="text"
                  className="w-full h-12 border border-[#D0D5DD] rounded-md px-3 text-sm"
                  placeholder="e.g. Evening Gown, Workwear, Casual"
                  value={measurementName}
                  onChange={(e) => setMeasurementName(e.target.value)}
                />
              </div>
            )}

            {/* Skin tones */}
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                Skin Tone:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                {(skinTones ?? []).map((tone) => (
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

            {/* Numeric inputs per gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(requiredFields as readonly string[]).map((f) => (
                <div key={f} className="space-y-1">
                  <label className="text-sm text-[#676767] capitalize">
                    {f}
                  </label>
                  <input
                    type="number"
                    className="w-full h-12 border border-[#D0D5DD] rounded-md px-3 text-sm"
                    value={String(selectedValues[f] ?? "")}
                    onChange={(e) =>
                      handleSelection(f, e.target.value === "" ? "" : Number(e.target.value))
                    }
                    min={0}
                  />
                </div>
              ))}
              {/* Optional fields */}
              {["neck", "shoulder"].map((f) => (
                <div key={f} className="space-y-1">
                  <label className="text-sm text-[#676767] capitalize">{f} (optional)</label>
                  <input
                    type="number"
                    className="w-full h-12 border border-[#D0D5DD] rounded-md px-3 text-sm"
                    value={String(selectedValues[f] ?? "")}
                    onChange={(e) =>
                      handleSelection(f, e.target.value === "" ? "" : Number(e.target.value))
                    }
                    min={0}
                  />
                </div>
              ))}
            </div>

            <Button
              variant="solid"
              onClick={saveData}
              disabled={
                requiredFields.some((k) => {
                  const v = selectedValues[k as string];
                  return v === "" || v === undefined || v === null || Number(v) <= 0;
                }) || createMeasurements.isPending
              }
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
  );
}
