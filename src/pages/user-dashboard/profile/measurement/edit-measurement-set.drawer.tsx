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
import {
  useUpdateMeasurements,
  useMeasurements,
} from "../../../../hooks/measurements.hooks";
import { useSkinTonesList } from "../../../../hooks/admin-settings.hooks";
import type {
  Gender,
  MeasurementSet,
} from "../../../../services/measurements.service";

interface EditMeasurementSetDrawerProps {
  trigger: React.ReactNode;
  measurementSet: MeasurementSet;
}

export function EditMeasurementSetDrawer({
  trigger,
  measurementSet,
}: EditMeasurementSetDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [gender, setGender] = React.useState<Gender>(
    (measurementSet.gender || "female").toLowerCase() === "male"
      ? "male"
      : "female"
  );
  const [name, setName] = React.useState(measurementSet.name || "");
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [skinTone, setSkinTone] = React.useState<string>("");

  const updateMeasurements = useUpdateMeasurements();
  const { data: me } = useMeasurements();
  const { data: skinTones } = useSkinTonesList();

  // Prefill when opened
  React.useEffect(() => {
    if (!open) return;

    const initial: Record<string, string> = {};
    const isMale =
      (measurementSet.gender || me?.gender || "female").toLowerCase() ===
      "male";

    const chestSource = measurementSet.chest;

    if (isMale) {
      if (typeof chestSource === "number") initial.chest = String(chestSource);
    } else {
      if (typeof chestSource === "number") initial.bust = String(chestSource);
      if (typeof measurementSet.hips === "number") {
        initial.hips = String(measurementSet.hips);
      }
    }

    if (typeof measurementSet.waist === "number") {
      initial.waist = String(measurementSet.waist);
    }
    if (typeof measurementSet.height === "number") {
      initial.height = String(measurementSet.height);
    }
    if (typeof measurementSet.neck === "number") {
      initial.neck = String(measurementSet.neck);
    }
    if (typeof measurementSet.shoulder === "number") {
      initial.shoulder = String(measurementSet.shoulder);
    }

    setValues(initial);
    setGender(isMale ? "male" : "female");
    setName(measurementSet.name || "");
    
    // Initialize skintone from measurementSet (if available) or base measurements
    const setSkinToneValue = (measurementSet as any).skinTone || me?.measurements?.skinTone || "";
    setSkinTone(setSkinToneValue);
  }, [open, measurementSet, me]);

  const requiredFields =
    gender === "male"
      ? (["chest", "waist", "height"] as const)
      : (["bust", "waist", "hips", "height"] as const);

  const handleFieldChange = (field: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenderChange = (next: Gender) => {
    setGender(next);
    // Keep shared fields, map chest/bust best-effort
    setValues((prev) => {
      const nextValues: Record<string, string> = {
        waist: prev.waist ?? "",
        height: prev.height ?? "",
        neck: prev.neck ?? "",
        shoulder: prev.shoulder ?? "",
      };
      if (next === "male") {
        nextValues.chest = prev.chest || prev.bust || "";
      } else {
        nextValues.bust = prev.bust || prev.chest || "";
        nextValues.hips = prev.hips || "";
      }
      return nextValues;
    });
  };

  const isInvalid =
    requiredFields.some((field) => {
      const v = values[field];
      if (v === undefined || v === "") return true;
      const num = Number(v);
      return Number.isNaN(num) || num <= 0;
    }) || updateMeasurements.isPending;

  const handleSubmit = async () => {
    if (isInvalid) return;

    const payload: import("../../../../services/measurements.service").UpdateMeasurementsRequest =
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

    if (skinTone.trim()) {
      payload.skinTone = skinTone.trim();
    }

    try {
      await updateMeasurements.mutateAsync(payload);
      setOpen(false);
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
            Edit Measurement Set
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-4 flex-1 overflow-y-auto space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm text-[#676767]">Name</label>
            <input
              type="text"
              className="w-full h-10 border border-[#D0D5DD] rounded-md px-3 text-sm"
              placeholder="Set name"
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
                  onClick={() => handleGenderChange(g)}
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

          {/* Skin Tone */}
          <div className="space-y-2">
            <span className="text-sm text-[#676767]">Skin Tone</span>
            <div className="grid grid-cols-3 gap-2">
              {(skinTones ?? []).map((tone) => (
                <button
                  key={tone.name}
                  type="button"
                  onClick={() => setSkinTone(tone.name)}
                  className={`h-10 rounded-md border transition-colors ${
                    skinTone === tone.name
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


