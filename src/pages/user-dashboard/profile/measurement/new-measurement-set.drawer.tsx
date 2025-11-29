import React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "../../../ui/drawer";
import Button from "../../../../shared-components/button";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useCreateMeasurements } from "../../../../hooks/measurements.hooks";
import type { Gender } from "../../../../services/measurements.service";

interface NewMeasurementSetDrawerProps {
  trigger: React.ReactNode;
  defaultGender?: Gender;
}

export function NewMeasurementSetDrawer({
  trigger,
  defaultGender = "female",
}: NewMeasurementSetDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [gender, setGender] = React.useState<Gender>(defaultGender);
  const [name, setName] = React.useState("");
  const [values, setValues] = React.useState<Record<string, string>>({});

  const createMeasurements = useCreateMeasurements();

  const requiredFields =
    gender === "male"
      ? (["chest", "waist", "height"] as const)
      : (["bust", "waist", "hips", "height"] as const);

  const optionalFields = ["neck", "shoulder"] as const;

  const handleFieldChange = (field: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setName("");
    setValues({});
    setGender(defaultGender);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Reset when drawer closes
      resetForm();
    }
  };

  const isInvalid =
    requiredFields.some((field) => {
      const v = values[field];
      if (v === undefined || v === "") return true;
      const num = Number(v);
      return Number.isNaN(num) || num <= 0;
    }) || createMeasurements.isPending;

  const handleSubmit = async () => {
    if (isInvalid) return;

    const payload: import("../../../../services/measurements.service").CreateMeasurementsRequest =
      {
        gender,
        name: name || undefined,
        waist: Number(values.waist),
        height: Number(values.height),
      };

    if (gender === "male") {
      payload.chest = Number(values.chest);
    } else {
      payload.bust = Number(values.bust);
      payload.hips = Number(values.hips);
    }

    if (values.neck) {
      payload.neck = Number(values.neck);
    }
    if (values.shoulder) {
      payload.shoulder = Number(values.shoulder);
    }

    try {
      await createMeasurements.mutateAsync(payload);
      setOpen(false);
      resetForm();
    } catch {
      // errors handled in hook
    }
  };

  const renderNumberInput = (field: string, label: string) => (
    <div key={field} className="space-y-1">
      <label className="text-sm text-[#676767] capitalize">{label}</label>
      <input
        type="number"
        className="w-full h-10 border border-[#D0D5DD] rounded-md px-3 text-sm"
        value={values[field] ?? ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        min={0}
      />
    </div>
  );

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
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
            Add Measurement Set
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-4 flex-1 overflow-y-auto space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm text-[#676767]">Name</label>
            <input
              type="text"
              className="w-full h-10 border border-[#D0D5DD] rounded-md px-3 text-sm"
              placeholder="e.g. Evening Gown, Workwear, Casual"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <span className="text-sm text-[#676767]">Gender</span>
            <div className="flex gap-2">
              {(["female", "male"] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-3 py-2 rounded-md border text-sm capitalize ${
                    gender === g
                      ? "border-[#1C1C1C] bg-neutral-100 text-neutral-900"
                      : "border-[#D0D5DD] text-neutral-700 hover:border-neutral-500"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Measurements */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#1C1C1C]">
              Measurements (inches)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {gender === "male"
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
                    renderNumberInput("neck", "Neck (optional)"),
                    renderNumberInput("shoulder", "Shoulder (optional)"),
                  ]}
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-[#E8E8E8] bg-white">
          <Button
            text={createMeasurements.isPending ? "Saving..." : "Save set"}
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


