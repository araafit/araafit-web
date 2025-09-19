import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared-components/button";
import {
  useSizeChart,
  useCreateMeasurements,
  useMeasurements,
} from "../../../hooks/measurements.hooks";
import { useAuthStore } from "../../../stores/auth-store";
import Spinner from "../../../shared-components/spinner";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

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
  const { isAuthenticated, isGuest } = useAuthStore();

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
    if (existingMeasurements?.measurements) {
      setSelectedValues({
        bust: existingMeasurements.measurements.bust,
        waist: existingMeasurements.measurements.waist,
        hips: existingMeasurements.measurements.hips,
        height: existingMeasurements.measurements.height,
        dressSize: existingMeasurements.measurements.dressSize,
        skinTone: existingMeasurements.measurements.skinTone,
      });
    }
  }, [existingMeasurements]);

  const handleValueSelect = (
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
    if (!isAuthenticated) {
      toast.error("Please log in to save measurements");
      navigate("/auth/login");
      return;
    }

    createMeasurements.mutate(selectedValues, {
      onSuccess: () => {
        if (isGuest) {
          // For guests, stay on the measurement page or redirect to continue guest flow
          toast.success("Measurements saved! Continue shopping as guest.");
          navigate("/shop");
        } else {
          // For authenticated users, redirect to dashboard
          navigate("/dashboard/profile");
        }
      },
    });
  };

  if (sizeChartLoading) {
    return (
      <section className="h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
        <div className="w-full h-[809px] bg-white flex justify-center items-center border rounded-md p-14">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2">Loading measurement options...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
      <div className="w-full h-[809px] bg-white flex justify-center border rounded-md p-14">
        <Button
          type="button"
          variant="clear"
          className="absolute top-[32px] left-[200px] w-[40px] h-[40px] rounded-md border border-[#E8E8E8] flex flex-col items-center justify-center bg-white text-neutral-800 cursor-pointer"
          onClick={() => navigate("/get-measured")}
        >
          <ArrowLeftIcon size={50} className="h-full text-neutral-800 block" />
        </Button>

        <div className="w-auto flex flex-col gap-4" style={waterMarkStyle}>
          <div className="flex flex-col items-center gap-4">
            <h5 className="text-[2rem] font-semibold">Manual Measurement</h5>
            <p className="text-neutral-500 font-light text-center">
              Enter your measurements to keep your fit just right.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            {/* Bust */}
            <div className="w-full flex flex-col gap-3">
              <span className="font-medium capitalize text-[#1C1C1C]">
                Bust:
              </span>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {sizeChart?.bust?.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    text={String(item.value)}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.bust === item.value
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleValueSelect("bust", item.value)}
                  />
                ))}
              </div>
            </div>

            {/* Waist */}
            <div className="w-full flex flex-col gap-3">
              <span className="font-medium capitalize text-[#1C1C1C]">
                Waist:
              </span>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {waistOptions.map((item, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    text={String(item.label)}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.waist === item.value
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleValueSelect("waist", item.value)}
                  />
                ))}
              </div>
            </div>

            {/* Hips */}
            <div className="w-full flex flex-col gap-3">
              <span className="font-medium capitalize text-[#1C1C1C]">
                Hips:
              </span>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {hipsOptions.map((item, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    text={String(item)}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.hips === Number(item)
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleValueSelect("hips", Number(item))}
                  />
                ))}
              </div>
            </div>

            {/* Height */}
            <div className="w-full flex flex-col gap-3">
              <span className="font-medium capitalize text-[#1C1C1C]">
                Height:
              </span>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {heightOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    text={option.label}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.height === option.value
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleValueSelect("height", option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Dress Size */}
            <div className="w-full flex flex-col gap-3">
              <span className="font-medium capitalize text-[#1C1C1C]">
                Dress Size:
              </span>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {dressSizeOptions.map((item, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    text={String(item)}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.dressSize === Number(item)
                        ? "border-primary-950 bg-primary-50"
                        : ""
                    }`}
                    onClick={() => handleValueSelect("dressSize", Number(item))}
                  />
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div className="w-full flex flex-col gap-3">
              <span className="font-medium capitalize text-[#1C1C1C]">
                Skin Tone:
              </span>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {skinToneOptions.map((tone) => (
                  <Button
                    key={tone.name}
                    style={{ backgroundColor: tone.color }}
                    className={`w-[58px] h-[44px] rounded-md border hover:border-neutral-700 focus:border-neutral-700 cursor-pointer ${
                      selectedValues.skinTone === tone.name
                        ? "border-neutral-700 ring-2 ring-neutral-700"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleValueSelect("skinTone", tone.name)}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="solid"
              onClick={saveData}
              disabled={measurementNotSelected || createMeasurements.isPending}
              className="w-[175px] self-end mt-2 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-1">
                {!createMeasurements.isPending && (
                  <span>Save</span>
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
