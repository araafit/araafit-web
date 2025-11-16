import { useState } from "react";
import { PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "../../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { Input } from "../../ui/input";
import Button from "../../../shared-components/button";
import {
  useSizeChart,
  useCreateSizeChart,
  useUpdateSizeChart,
} from "../../../hooks/admin-settings.hooks";
import type {
  SizeType,
  SizeChartResponse,
} from "../../../services/admin-settings.service";
import Spinner from "../../../shared-components/spinner";

/* --------------------------------------------------------------------------- */

export default function SizeTabs() {
  const [editItemId, setEditItemId] = useState("");
  const [newValue, setNewValue] = useState("");
  const [addChartType, setAddChartType] = useState<SizeType | "">("");
  const [addNewValue, setAddNewValue] = useState("");
  const [addGender, setAddGender] = useState<"male" | "female" | "">("female");
  const [editGender, setEditGender] = useState<"male" | "female" | "">(
    "female"
  );
  const [editType, setEditType] = useState<SizeType | "">("");
  const [addSizeLabel, setAddSizeLabel] = useState<
    "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | ""
  >("");
  const [editSizeLabel, setEditSizeLabel] = useState<
    "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | ""
  >("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // API hooks
  const {
    data: femaleChart,
    isLoading: isLoadingFemale,
    error: errorFemale,
  } = useSizeChart("female");
  const {
    data: maleChart,
    isLoading: isLoadingMale,
    error: errorMale,
  } = useSizeChart("male");
  const createSizeChartMutation = useCreateSizeChart();
  const updateSizeChartMutation = useUpdateSizeChart();

  const handleAdd = async () => {
    if (!addChartType || !addNewValue || !addGender) return;
    if (addChartType === "clotheSize" && !addSizeLabel) return;

    try {
      await createSizeChartMutation.mutateAsync({
        type: addChartType,
        value: Number(addNewValue),
        gender: addGender,
        label: ["clotheSize", "dressSize"].includes(addChartType)
          ? addSizeLabel
          : undefined,
      });
      setAddChartType("");
      setAddNewValue("");
      setAddGender("");
      setAddSizeLabel("");
      setIsAddDialogOpen(false);
    } catch {
      // Error handled in hook
    }
  };

  const handleEdit = async () => {
    if (!editItemId || !newValue) return;

    try {
      await updateSizeChartMutation.mutateAsync({
        id: editItemId,
        request: {
          value: Number(newValue),
          gender: editGender || undefined,
          type: (editType as SizeType) || undefined,
          label: ["clotheSize", "dressSize"].includes(editType)
            ? editSizeLabel || undefined
            : undefined,
        },
      });

      setEditItemId("");
      setNewValue("");
      setEditGender("");
      setEditType("");
      setEditSizeLabel("");
      setIsEditDialogOpen(false);
    } catch {
      // Error handled in hook
    }
  };

  const openEditDialog = (
    id: string,
    currentValue: number,
    gender: "male" | "female",
    label: string
  ) => {
    setEditItemId(id);
    setNewValue(currentValue.toString());
    setEditGender(gender);
    setEditType((label as SizeType) || "");
    setIsEditDialogOpen(true);
  };

  const femaleTypeOptions: { value: SizeType; label: string }[] = [
    { value: "bust", label: "Bust" },
    { value: "waist", label: "Waist" },
    { value: "hips", label: "Hips (inches)" },
    { value: "dressSize", label: "Dress Size" },
    { value: "height", label: "Height" },
  ];

  const maleTypeOptions: { value: SizeType; label: string }[] = [
    { value: "chest", label: "Chest" },
    { value: "shoulder", label: "Shoulder" },
    { value: "waist", label: "Waist" },
    { value: "inseam", label: "Inseam" },
    { value: "clotheSize", label: "Size" },
    { value: "height", label: "Height" },
  ];

  const renderSection = (
    gender: "female" | "male",
    chart?: SizeChartResponse
  ) => {
    const isEmpty =
      !chart ||
      (typeof chart === "object" &&
        chart !== null &&
        Object.keys(chart).length === 0);

    return (
      <div className="space-y-6 max-w-[530px] mx-auto">
        <h3 className="font-semibold text-[20px]">
          {gender === "female" ? "Female" : "Male"}
        </h3>
        {isEmpty ? (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center text-sm text-gray-600">
            No size chart configured for {gender}.
          </div>
        ) : (
          Object.entries(chart!).map(([label, values]) => {
            if (label === "skinTones") {
              return (
                <div
                  key={label}
                  className="w-full flex flex-col gap-2 md:gap-3"
                >
                  <span className="capitalize text-[#676767] text-sm">
                    Skin Tone
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 md:flex md:items-center md:justify-between gap-2 md:gap-4 flex-wrap">
                    {(values as unknown as { name: string; hex: string }[]).map(
                      (tone) => (
                        <Button
                          key={tone.name}
                          style={{ backgroundColor: tone.hex }}
                          className={`w-full md:w-[58px] h-[36px] md:h-[44px] rounded-md border hover:border-neutral-700 focus:border-neutral-700 cursor-pointer border-gray-300`}
                        />
                      )
                    )}
                  </div>
                </div>
              );
            }

            const displayLabel =
              label === "dressSize"
                ? "Dress Size"
                : label === "hips"
                ? "Hips(inches)"
                : label.charAt(0).toUpperCase() + label.slice(1);

            return (
              <div key={label}>
                {/* Label */}
                <div className="flex justify-between items-center ">
                  <span className="capitalize text-[#676767] text-sm">
                    {displayLabel}
                  </span>
                </div>

                {/* Sizes */}
                <div className="flex gap-2 flex-wrap mt-2">
                  {values.map(
                    (item: { id: string; value: number; label?: string }) => (
                      <div
                        key={item.id}
                        className="relative group w-16 h-10 flex items-center justify-center border border-[#D0D5DD] rounded-md text-sm text-[#1C1C1C] bg-white hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          openEditDialog(item.id, item.value, gender, label)
                        }
                      >
                        {item.label || item.value}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-gray-900 bg-opacity-75 rounded-md transition-opacity">
                          <PencilSimpleIcon size={12} className="text-white" />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white w-full h-full px-4 py-6 pb-44">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="font-semibold text-[28px] capitalize">
            Size Chart Management
          </h2>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex gap-1 items-center cursor-pointer">
                <PlusIcon className="text-[#9A6C50]" />
                <p className="font-light text-[#9A6C50]">Add</p>
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              {/* Header */}
              <DialogHeader>
                <DialogTitle className="text-[#1C1C1C] text-lg font-inter">
                  Add a New Size Value
                </DialogTitle>
                <DialogDescription className="text-[#4F4F4F] font-inter mt-3">
                  Add the size label and measurement to update your chart.
                </DialogDescription>
              </DialogHeader>

              {/* Form fields */}
              <div className="space-y-4 py-4">
                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">Gender</label>
                  <Select
                    value={addGender}
                    onValueChange={(value) =>
                      setAddGender(value as "male" | "female")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">Chart Type</label>

                  <Select
                    onValueChange={(value) =>
                      setAddChartType(value as SizeType)
                    }
                    value={addChartType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {((addGender || "female") === "male"
                        ? maleTypeOptions
                        : femaleTypeOptions
                      ).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Size Label (only for type=size) */}
                {["clotheSize", "dressSize"].includes(addChartType) && (
                  <div className="space-y-1">
                    <label className="text-sm text-[#676767]">Label</label>
                    <Select
                      value={addSizeLabel}
                      onValueChange={(value) =>
                        setAddSizeLabel(
                          value as
                            | "XS"
                            | "S"
                            | "M"
                            | "L"
                            | "XL"
                            | "XXL"
                            | "XXXL"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select label" />
                      </SelectTrigger>
                      <SelectContent>
                        {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(
                          (lbl) => (
                            <SelectItem key={lbl} value={lbl}>
                              {lbl}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* New Value */}
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">New Value</label>
                  <Input
                    type="text"
                    value={addNewValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Only allow non-negative numbers
                      if (val === "" || Number(val) >= 0) {
                        setAddNewValue(val);
                      }
                    }}
                    placeholder="Enter new value"
                  />
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="flex">
                <DialogClose asChild className="flex-1">
                  <Button
                    text="Cancel"
                    variant="outline"
                    className="border border-[#E7E7E7] text-[#3D3D3D]"
                  />
                </DialogClose>

                <Button
                  text={createSizeChartMutation.isPending ? "Adding..." : "Add"}
                  type="submit"
                  variant="solid"
                  className="bg-[#9A6C50] text-white flex-1"
                  disabled={
                    !addChartType ||
                    !addNewValue ||
                    !addGender ||
                    createSizeChartMutation.isPending
                  }
                  onClick={handleAdd}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] my-4 bg-[#F0F2F5]" />

        {isLoadingFemale || isLoadingMale ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" speed="fast" />
          </div>
        ) : errorFemale || errorMale ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <p className="text-red-600">Failed to load size chart</p>
          </div>
        ) : (
          <div className="space-y-10">
            {renderSection("female", femaleChart)}
            {renderSection("male", maleChart)}
          </div>
        )}

        {/* Edit Dialog - Outside the loop */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1C1C1C] text-lg font-inter">
                Edit Size Value
              </DialogTitle>
              <DialogDescription className="text-[#4F4F4F] font-inter mt-3">
                Update the size value.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Gender (optional for update) */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">Gender</label>
                <Select
                  value={editGender}
                  onValueChange={(value) =>
                    setEditGender(value as "male" | "female")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Type (optional for update) */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">Type</label>
                <Select
                  value={editType}
                  onValueChange={(value) => setEditType(value as SizeType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {((editGender || "female") === "male"
                      ? maleTypeOptions
                      : femaleTypeOptions
                    ).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Size Label (only for type=size) */}
              {["clotheSize", "dressSize"].includes(editType) && (
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">Label</label>
                  <Select
                    value={editSizeLabel}
                    onValueChange={(value) =>
                      setEditSizeLabel(
                        value as "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((lbl) => (
                        <SelectItem key={lbl} value={lbl}>
                          {lbl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* New Value */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">New Value</label>
                <Input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter new value"
                />
              </div>
            </div>

            <DialogFooter className="flex">
              <DialogClose asChild className="flex-1">
                <Button
                  text="Cancel"
                  className="border border-[#E7E7E7] text-[#3D3D3D]"
                  variant="outline"
                />
              </DialogClose>
              <Button
                text={
                  updateSizeChartMutation.isPending ? "Updating..." : "Update"
                }
                type="submit"
                variant="solid"
                className="text-white flex-1 bg-[#9A6C50]"
                onClick={handleEdit}
                disabled={
                  !newValue ||
                  updateSizeChartMutation.isPending ||
                  (editType === "clotheSize" && !editSizeLabel)
                }
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
