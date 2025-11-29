import UserDashboardLayout from "../../../../layouts/user-dashboard/dashboard-layout";
import Button from "../../../../shared-components/button";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useAuthenticatedSizeChart,
  useMeasurements,
  useUpdateMeasurements,
} from "../../../../hooks/measurements.hooks";
import Spinner from "../../../../shared-components/spinner";

/* ------------------------------------------------------------------------------------------------- */

const skinToneOptions = [
  { name: "deep", color: "#33251c" },
  { name: "dark", color: "#55322e" },
  { name: "medium", color: "#8c5a47" },
  { name: "tan", color: "#b0522d" },
  { name: "light", color: "#c4976c" },
  { name: "fair", color: "#deb588" },
];

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

/**
 * Edit measurements
 *
 * @returns ReactElement
 */
export function DashboardEditMeasurementPage() {
  const navigate = useNavigate();
  const { data: currentMeasurements, isLoading: measurementsLoading } =
    useMeasurements();
  const { data: sizeChart, isLoading: sizeChartLoading } =
    useAuthenticatedSizeChart();
  const updateMeasurements = useUpdateMeasurements();

  const [selectedValues, setSelectedValues] = useState({
    bust: 0,
    waist: 0,
    hips: 0,
    height: 0,
    dressSize: 0,
    skinTone: "",
  });

  // Set pre-existing measurements
  useEffect(() => {
    if (currentMeasurements?.measurements) {
      const base = currentMeasurements.measurements;
      setSelectedValues({
        bust: (base.bust as number) ?? 0,
        waist: (base.waist as number) ?? 0,
        hips: (base.hips as number) ?? 0,
        height: (base.height as number) ?? 0,
        dressSize: (base.dressSize as number) ?? 0,
        skinTone: (base.skinTone as string) ?? "",
      });
    }
  }, [currentMeasurements]);

  const handleValueSelect = (
    type: keyof typeof selectedValues,
    value: number | string
  ) => {
    setSelectedValues((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleUpdate = () => {
    updateMeasurements.mutate(selectedValues, {
      onSuccess: () => {
        navigate("/dashboard/profile");
      },
    });
  };

  if (measurementsLoading || sizeChartLoading) {
    return (
      <UserDashboardLayout>
        <div className="min-h-screen bg-white py-5 px-8 rounded-md flex flex-col items-center justify-center gap-6 overflow-y-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2">Loading measurements...</span>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="min-h-screen bg-white py-5 px-8 rounded-md flex flex-col items-center gap-6 relative overflow-y-auto">
        <Button
          type="button"
          variant="clear"
          className="absolute top-[32px] left-4 lg:left-[200px] w-[40px] h-[40px] rounded-md border border-[#E8E8E8] flex flex-col items-center justify-center bg-white text-neutral-800 z-10"
          onClick={() => navigate("/dashboard/profile")}
        >
          <ArrowLeftIcon size={50} className=" text-neutral-800" />
        </Button>

        <div className="w-full max-w-[32.5rem] flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4">
            <h5 className="text-[2rem] font-semibold">Edit Measurement</h5>
            <p className="text-neutral-500 font-light text-center">
              Edit your saved measurements to keep your fit just right.
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
                        ? "border-neutral-700 bg-neutral-100"
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
                {sizeChart?.waist?.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    text={String(item.value)}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.waist === item.value
                        ? "border-neutral-700 bg-neutral-100"
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
                {sizeChart?.hips?.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    text={String(item.value)}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.hips === item.value
                        ? "border-neutral-700 bg-neutral-100"
                        : ""
                    }`}
                    onClick={() => handleValueSelect("hips", item.value)}
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
                {heightOptions?.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    text={option.label}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.height === option.value
                        ? "border-neutral-700 bg-neutral-100"
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
                {sizeChart?.dressSize?.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    text={String(item.label ?? item.value)}
                    variant="outline"
                    className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700 ${
                      selectedValues.dressSize === item.value
                        ? "border-neutral-700 bg-neutral-100"
                        : ""
                    }`}
                    onClick={() => handleValueSelect("dressSize", item.value)}
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
                {skinToneOptions?.map((tone) => (
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
              text="Update"
              className="w-[175px] self-end mt-2"
              variant="solid"
              onClick={handleUpdate}
              disabled={updateMeasurements.isPending}
            >
              <div className="flex items-center justify-center gap-1">
                {" "}
                {updateMeasurements.isPending ? (
                  <Spinner
                    size="sm"
                    speed="fast"
                    isLoading={updateMeasurements.isPending}
                  />
                ) : (
                  "Update"
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
