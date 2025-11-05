import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
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

/* ------------------------------------------------------------- */

// Endpoint doesn't return complete measurement for Waist, Hips, Height and Dress size

const waistOptions = [
  { value: 26, label: "24" },
  { value: 28, label: "28" },
  { value: 30, label: "30" },
  { value: "33/34", label: "34/34" },
  { value: "35/36", label: "35/36" },
  { value: "37/38", label: "37/38" },
  { value: "40", label: "40" },
];

const hipsOptions = ["36", "38", "40", "42", "44", "46", "48", "50"];

const heightOptions = [
  { value: 58, label: "4'10\"" },
  { value: 61, label: "5'1\"" },
  { value: 63, label: "5'3\"" },
  { value: 64, label: "5'4\"" },
  { value: 65, label: "5'5\"" },
  { value: 67, label: "5'7\"" },
  { value: 69, label: "5'9\"" },
  { value: 72, label: "6'0\"" },
];

const dressSizeOptions = ["6", "8", "10", "12", "14", "16", "18", "20"];

const skinToneOptions = [
  { name: "deep", color: "#33251c" },
  { name: "dark", color: "#55322e" },
  { name: "medium", color: "#8c5a47" },
  { name: "tan", color: "#b0522d" },
  { name: "light", color: "#c4976c" },
  { name: "fair", color: "#deb588" },
];

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
  const {isAuthenticated, isGuest } = useAuth();

  // API hooks
  const { data: sizeChart, isLoading: sizeChartLoading } = useSizeChart();
  const { data: existingMeasurements } = useMeasurements();
  const createMeasurements = useCreateMeasurements();

  // Local state for selected measurements
  const [selectedValues, setSelectedValues] = useState({
    bust: 0,
    waist: 0,
    hips: 0,
    height: 0,
    dressSize: 0,
    skinTone: "",
  });

  // Prefill existing measurements if available
  useEffect(() => {
    if (existingMeasurements) {
      setSelectedValues({
        bust: existingMeasurements.bust as number,
        waist: existingMeasurements.waist as number,
        hips: existingMeasurements.hips as number,
        height: existingMeasurements.height as number,
        dressSize: existingMeasurements.dressSize as number,
        skinTone: existingMeasurements.skinTone as string,
      });
    }
  }, [existingMeasurements]);

  const handleSelection = (
    type: keyof typeof selectedValues,
    value: number | string
  ) => {
    setSelectedValues((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Check if all measurements are selected
  const measurementNotSelected = Object.values(selectedValues).some(
    (value) => value === 0 || value === ""
  );

  const saveData = async () => {
    if (!isAuthenticated && !isGuest) {
      toast.error("Please log in to continue");
      navigate("/auth/login");
      return;
    }

    createMeasurements.mutate(selectedValues, {
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
            <span className="text-sm md:text-base">Loading measurement options</span>
            <Spinner isLoading={sizeChartLoading} speed="fast" size="lg" arcColor="#9A6C50" />
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
          onClick={() => navigate("/get-measured")}
          title="Go back"
        >
          <ArrowLeftIcon size={20} className="md:hidden text-neutral-800 block" />
          <ArrowLeftIcon size={50} className="hidden md:block h-full text-neutral-800" />
        </button>

        <div className="w-full max-w-4xl flex flex-col gap-4 md:gap-6" style={waterMarkStyle}>
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <h5 className="text-xl md:text-[2rem] font-semibold text-center">Manual Measurement</h5>
            <p className="text-neutral-500 font-light text-center text-sm md:text-base px-4">
              Enter your measurements to keep your fit just right.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4 md:gap-6">
            {/* Bust */}
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                Bust:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                {sizeChart?.bust?.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    text={String(item.value)}
                    variant="outline"
                    className={`w-full md:w-[58px] h-[36px] md:h-[44px] text-xs md:text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.bust === item.value
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleSelection("bust", item.value)}
                  />
                ))}
              </div>
            </div>

            {/* Waist */}
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                Waist:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                {waistOptions.map((item, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    text={String(item.label)}
                    variant="outline"
                    className={`w-full md:w-[58px] h-[36px] md:h-[44px] text-xs md:text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.waist === item.value
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleSelection("waist", item.value)}
                  />
                ))}
              </div>
            </div>

            {/* Hips */}
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                Hips:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                {hipsOptions.map((item, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    text={String(item)}
                    variant="outline"
                    className={`w-full md:w-[58px] h-[36px] md:h-[44px] text-xs md:text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.hips === Number(item)
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleSelection("hips", Number(item))}
                  />
                ))}
              </div>
            </div>

            {/* Height */}
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                Height:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                {heightOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    text={option.label}
                    variant="outline"
                    className={`w-full md:w-[58px] h-[36px] md:h-[44px] text-xs md:text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.height === option.value
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleSelection("height", option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Dress Size */}
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                Dress Size:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                {dressSizeOptions.map((item, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    text={String(item)}
                    variant="outline"
                    className={`w-full md:w-[58px] h-[36px] md:h-[44px] text-xs md:text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.dressSize === Number(item)
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleSelection("dressSize", Number(item))}
                  />
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <span className="font-medium capitalize text-[#1C1C1C] text-sm md:text-base">
                Skin Tone:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                {skinToneOptions.map((tone) => (
                  <Button
                    key={tone.name}
                    style={{ backgroundColor: tone.color }}
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
