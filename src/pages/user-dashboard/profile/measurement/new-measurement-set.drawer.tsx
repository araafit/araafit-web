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
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const createMeasurements = useCreateMeasurements();

  const requiredFields =
    gender === "male"
      ? (["chest", "waist", "height"] as const)
      : (["bust", "waist", "hips", "height"] as const);

  // const optionalFields = ["neck", "shoulder"] as const;

  const validateField = (field: string, value: string): string => {
    const isRequired = (requiredFields as readonly string[]).includes(field);
    if (isRequired) {
      const trimmed = value.trim();
      if (!trimmed) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
      const num = Number(trimmed);
      if (Number.isNaN(num)) {
        return "Please enter a valid number";
      }
      if (num <= 0) {
        return "Value must be greater than 0";
      }
    }
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const resetForm = () => {
    setName("");
    setValues({});
    setErrors({});
    setGender(defaultGender);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Reset when drawer closes
      resetForm();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach((field) => {
      const value = values[field];
      const error = validateField(field, value || "");
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isInvalid =
    requiredFields.some((field) => {
      const v = values[field];
      if (v === undefined || v === "" || v.trim() === "") return true;
      const num = Number(v.trim());
      return Number.isNaN(num) || num <= 0;
    }) || createMeasurements.isPending;

  const handleSubmit = async () => {
    // Validate all required fields
    if (!validateForm()) {
      return;
    }

    if (isInvalid) {
      return;
    }

    // Use trimmed values to ensure no whitespace issues
    const payload: import("../../../../services/measurements.service").CreateMeasurementsRequest =
      {
        gender,
        name: name.trim() || undefined,
        waist: Number((values.waist || "").trim()),
        height: Number((values.height || "").trim()),
      };

    if (gender === "male") {
      payload.chest = Number((values.chest || "").trim());
    } else {
      payload.bust = Number((values.bust || "").trim());
      payload.hips = Number((values.hips || "").trim());
    }

    if (values.neck?.trim()) {
      payload.neck = Number(values.neck.trim());
    }
    if (values.shoulder?.trim()) {
      payload.shoulder = Number(values.shoulder.trim());
    }

    try {
      await createMeasurements.mutateAsync(payload);
      setOpen(false);
      resetForm();
    } catch {
      // errors handled in hook
    }
  };

  const renderNumberInput = (field: string, label: string) => {
    const isRequiredField = (requiredFields as readonly string[]).includes(field);
    const hasError = !!errors[field];
    
    return (
      <div key={field} className="space-y-1">
        <label className="text-sm text-[#676767] capitalize">
          {label}
          {isRequiredField && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="number"
          className={`w-full h-10 border rounded-md px-3 text-sm ${
            hasError
              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-[#D0D5DD] focus:border-[#9A6C50] focus:ring-1 focus:ring-[#9A6C50]"
          } focus:outline-none`}
          value={values[field] ?? ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          onBlur={(e) => {
            if (isRequiredField) {
              const error = validateField(field, e.target.value);
              if (error) {
                setErrors((prev) => ({ ...prev, [field]: error }));
              } else {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next[field];
                  return next;
                });
              }
            }
          }}
          min={0}
          step="0.1"
          required={isRequiredField}
        />
        {hasError && (
          <p className="text-xs text-red-600">{errors[field]}</p>
        )}
      </div>
    );
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="bg-white rounded-none w-full max-w-[420px] h-full max-h-screen flex flex-col">
        <DrawerHeader className="flex items-center gap-3 pb-3 border-b border-[#E8E8E8]">
          <DrawerClose asChild>
            <button
              type="button"
              className="border h-10 w-10 rounded-md cursor-pointer border-[#E8E8E8] flex items-center justify-center bg-white"
              title="Add measurements"
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


