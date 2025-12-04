import React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "../../ui/drawer";
import Button from "../../../shared-components/button";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import {
  useUpdateMeasurements,
  useAuthenticatedSizeChart,
} from "../../../hooks/measurements.hooks";
import { useSkinTonesList } from "../../../hooks/admin-settings.hooks";
import type { MeasurementResult } from "../../../services/measurement";

interface EditMeasurementsDrawerProps {
  trigger: React.ReactNode;
  measurements: MeasurementResult | null;
  accurateMeasurements: {
    bust: { width: number; depth: number; circumference: number };
    waist: { width: number; depth: number; circumference: number };
    hip: { width: number; depth: number; circumference: number };
    pixelToCmRatio: number;
  } | null;
  gender: "male" | "female";
  skinTone: { hex: string; rgb: { r: number; g: number; b: number }; name: string } | null;
  onSave?: (updatedMeasurements: {
    bust?: number;
    chest?: number;
    waist: number;
    hips?: number;
    height: number;
    skinTone: string;
    dressSize?: string;
  }) => void;
}

export function EditMeasurementsDrawer({
  trigger,
  measurements,
  accurateMeasurements,
  gender,
  skinTone,
  onSave,
}: EditMeasurementsDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [selectedSkinTone, setSelectedSkinTone] = React.useState<string>("");

  const updateMeasurements = useUpdateMeasurements();
  const { data: sizeChart } = useAuthenticatedSizeChart();
  const { data: skinTones } = useSkinTonesList();

  const isMale = gender === "male";

  // Prefill values when drawer opens
  React.useEffect(() => {
    if (!open || (!measurements && !accurateMeasurements)) return;

    const initial: Record<string, string> = {};

    // Use accurate measurements if available, otherwise fall back to original
    if (accurateMeasurements) {
      // Convert from cm to inches
      const bustInches = Math.round(accurateMeasurements.bust.circumference / 2.54);
      const waistInches = Math.round(accurateMeasurements.waist.circumference / 2.54);
      const hipsInches = Math.round(accurateMeasurements.hip.circumference / 2.54);

      if (isMale) {
        initial.chest = String(bustInches);
      } else {
        initial.bust = String(bustInches);
        initial.hips = String(hipsInches);
      }
      initial.waist = String(waistInches);
    } else if (measurements) {
      // Original measurements are already in cm, convert to inches
      const bustInches = Math.round(measurements.measurements.bust / 2.54);
      const waistInches = Math.round(measurements.measurements.waist / 2.54);
      const hipsInches = Math.round(measurements.measurements.hip / 2.54);

      if (isMale) {
        initial.chest = String(bustInches);
      } else {
        initial.bust = String(bustInches);
        initial.hips = String(hipsInches);
      }
      initial.waist = String(waistInches);
    }

    // Height: convert from cm to inches
    if (measurements?.measurements.height) {
      const heightInches = Math.round(measurements.measurements.height / 2.54);
      initial.height = String(heightInches);
    }

    // Optional fields
    if (measurements?.measurements.neck) {
      const neckInches = Math.round((measurements.measurements.neck || 0) / 2.54);
      if (neckInches > 0) initial.neck = String(neckInches);
    }
    if (measurements?.measurements.shoulderWidth) {
      const shoulderInches = Math.round((measurements.measurements.shoulderWidth || 0) / 2.54);
      if (shoulderInches > 0) initial.shoulder = String(shoulderInches);
    }

    // Dress size (for females)
    if (!isMale && measurements?.dressSize?.us) {
      initial.dressSize = String(measurements.dressSize.us);
    }

    setValues(initial);
    setSelectedSkinTone(skinTone?.name || "");
  }, [open, measurements, accurateMeasurements, gender, isMale, skinTone]);

  const requiredFields = isMale
    ? (["chest", "waist", "height"] as const)
    : (["bust", "waist", "hips", "height"] as const);

  const handleFieldChange = (field: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isInvalid =
    requiredFields.some((field) => {
      const v = values[field];
      if (v === undefined || v === "") return true;
      const num = Number(v);
      return Number.isNaN(num) || num <= 0;
    }) || (updateMeasurements.isPending && !onSave);

  const handleSubmit = async () => {
    if (isInvalid) return;

    const updatedValues = {
      bust: isMale ? undefined : Number(values.bust),
      chest: isMale ? Number(values.chest) : undefined,
      waist: Number(values.waist),
      hips: isMale ? undefined : Number(values.hips),
      height: Number(values.height),
      skinTone: selectedSkinTone,
      dressSize: !isMale && values.dressSize ? values.dressSize : undefined,
      neck: values.neck ? Number(values.neck) : undefined,
      shoulder: values.shoulder ? Number(values.shoulder) : undefined,
    };

    // If onSave callback is provided, use it (for guest users or local editing)
    if (onSave) {
      onSave(updatedValues);
      setOpen(false);
      return;
    }

    // Otherwise, update via API (for authenticated users)
    const payload: import("../../../services/measurements.service").UpdateMeasurementsRequest = {
      gender,
      waist: Number(values.waist),
      height: Number(values.height),
      skinTone: selectedSkinTone || undefined,
    };

    if (isMale) {
      payload.chest = Number(values.chest);
    } else {
      payload.bust = Number(values.bust);
      payload.hips = Number(values.hips);
      if (values.dressSize) {
        payload.dressSize = values.dressSize;
      }
    }

    if (values.neck) {
      payload.neck = Number(values.neck);
    }
    if (values.shoulder) {
      payload.shoulder = Number(values.shoulder);
    }

    try {
      await updateMeasurements.mutateAsync(payload);
      setOpen(false);
    } catch {
      // errors handled in hook
    }
  };

  const renderNumberInput = (field: string, label: string) => {
    // For height, show dropdown options if available from size chart
    if (field === "height" && sizeChart?.height) {
      return (
        <div key={field} className="space-y-1">
          <label className="text-sm text-[#676767] capitalize">{label}</label>
          <select
            className="w-full h-10 border border-[#D0D5DD] rounded-md px-3 text-sm"
            value={values[field] ?? ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          >
            <option value="">Select height</option>
            {sizeChart.height.map((item) => (
              <option key={item.id} value={String(item.value)}>
                {item.label || `${item.value}"`}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // For dress size (females only)
    if (field === "dressSize" && !isMale && sizeChart?.dressSize) {
      return (
        <div key={field} className="space-y-1">
          <label className="text-sm text-[#676767] capitalize">{label}</label>
          <select
            className="w-full h-10 border border-[#D0D5DD] rounded-md px-3 text-sm"
            value={values[field] ?? ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          >
            <option value="">Select dress size</option>
            {sizeChart.dressSize.map((item) => (
              <option key={item.id} value={String(item.label ?? item.value)}>
                {item.label ?? item.value}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Regular number input
    return (
      <div key={field} className="space-y-1">
        <label className="text-sm text-[#676767] capitalize">{label}</label>
        <input
          type="number"
          className="w-full h-10 border border-[#D0D5DD] rounded-md px-3 text-sm"
          value={values[field] ?? ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          min={0}
          step="0.1"
        />
      </div>
    );
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="bg-white rounded-none w-full max-w-[420px] h-full max-h-screen flex flex-col">
        <DrawerHeader className="flex items-center gap-3 pb-3 border-b border-[#E8E8E8]">
          <DrawerClose asChild>
            <button
              type="button"
              className="border h-10 w-10 rounded-md cursor-pointer border-[#E8E8E8] flex items-center justify-center bg-white"
            >
              <ArrowLeftIcon />
            </button>
          </DrawerClose>
          <DrawerTitle className="text-lg font-semibold text-[#1C1C1C]">
            Edit Measurements
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-4 flex-1 overflow-y-auto space-y-5">
          {/* Skin Tone */}
          <div className="space-y-2">
            <span className="text-sm text-[#676767]">Skin Tone</span>
            <div className="grid grid-cols-3 gap-2">
              {(skinTones ?? []).map((tone) => (
                <button
                  key={tone.name}
                  type="button"
                  onClick={() => setSelectedSkinTone(tone.name)}
                  className={`h-10 rounded-md border transition-colors ${
                    selectedSkinTone === tone.name
                      ? "border-[#1C1C1C] ring-2 ring-neutral-700"
                      : "border-[#D0D5DD] hover:border-neutral-500"
                  }`}
                  style={{ backgroundColor: tone.hex }}
                  title={tone.name}
                />
              ))}
            </div>
          </div>

          {/* Measurements */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#1C1C1C]">
              Measurements (inches)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {isMale
                ? [
                    renderNumberInput("chest", "Chest"),
                    renderNumberInput("waist", "Waist"),
                    renderNumberInput("height", "Height"),
                    renderNumberInput("neck", "Neck (optional)"),
                    renderNumberInput("shoulder", "Shoulder (optional)"),
                  ]
                : [
                    renderNumberInput("bust", "Bust"),
                    renderNumberInput("waist", "Waist"),
                    renderNumberInput("hips", "Hips"),
                    renderNumberInput("height", "Height"),
                    renderNumberInput("dressSize", "Dress Size"),
                    renderNumberInput("neck", "Neck (optional)"),
                    renderNumberInput("shoulder", "Shoulder (optional)"),
                  ]}
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-[#E8E8E8] bg-white">
          <Button
            text={updateMeasurements.isPending ? "Saving..." : "Save changes"}
            variant="solid"
            className="w-full"
            type="button"
            disabled={isInvalid}
            onClick={handleSubmit}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

