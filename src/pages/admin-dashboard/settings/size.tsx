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
import { useSizeChart, useCreateSizeChart, useUpdateSizeChart } from "../../../hooks/admin-settings.hooks";
import type { SizeType } from "../../../services/admin-settings.service";
import Spinner from "../../../shared-components/spinner";

export default function SizeTabs() {
  const [editItemId, setEditItemId] = useState("");
  const [newValue, setNewValue] = useState("");
  const [addChartType, setAddChartType] = useState<SizeType | "">("");
  const [addNewValue, setAddNewValue] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // API hooks
  const { data: sizeChart, isLoading, error } = useSizeChart();
  const createSizeChartMutation = useCreateSizeChart();
  const updateSizeChartMutation = useUpdateSizeChart();

  const handleAdd = async () => {
    if (!addChartType || !addNewValue) return;

    try {
      await createSizeChartMutation.mutateAsync({
        type: addChartType,
        value: Number(addNewValue),
      });
      setAddChartType("");
      setAddNewValue("");
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
        request: { value: Number(newValue) },
      });
      setEditItemId("");
      setNewValue("");
      setIsEditDialogOpen(false);
    } catch {
      // Error handled in hook
    }
  };

  const openEditDialog = (id: string, currentValue: number) => {
    setEditItemId(id);
    setNewValue(currentValue.toString());
    setIsEditDialogOpen(true);
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
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">Chart Type</label>
                  <Select
                    onValueChange={(value) => setAddChartType(value as SizeType)}
                    value={addChartType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bust">Bust</SelectItem>
                      <SelectItem value="waist">Waist</SelectItem>
                      <SelectItem value="hips">Hips</SelectItem>
                      <SelectItem value="dressSize">Dress Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* New Value */}
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">New Value</label>
                  <Input
                    type="number"
                    value={addNewValue}
                    onChange={(e) => setAddNewValue(e.target.value)}
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
                  disabled={!addChartType || !addNewValue || createSizeChartMutation.isPending}
                  onClick={handleAdd}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] my-4 bg-[#F0F2F5]" />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" speed="fast" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <p className="text-red-600">Failed to load size chart</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-[530px] mx-auto">
            {sizeChart && Object.entries(sizeChart).map(([label, values]) => (
            <div key={label}>
              {/* Label */}
              <div className="flex justify-between items-center ">
                <span className="capitalize text-[#676767] text-sm">
                  {label === 'dressSize' ? 'Dress Size' : label}
                </span>

              </div>

              {/* Sizes */}
              <div className="flex gap-2 flex-wrap mt-2">
                {values.map((item: { id: string; value: number }) => (
                  <div
                    key={item.id}
                    className="relative group w-16 h-10 flex items-center justify-center border border-[#D0D5DD] rounded-md text-sm text-[#1C1C1C] bg-white hover:bg-gray-50 cursor-pointer"
                    onClick={() => openEditDialog(item.id, item.value)}
                  >
                    {item.value}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-gray-900 bg-opacity-75 rounded-md transition-opacity">
                      <PencilSimpleIcon size={12} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
              {/* New Value */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">
                  New Value
                </label>
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
                text={updateSizeChartMutation.isPending ? "Updating..." : "Update"}
                type="submit"
                variant="solid"
                className="text-white flex-1 bg-[#9A6C50]"
                onClick={handleEdit}
                disabled={!newValue || updateSizeChartMutation.isPending}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
