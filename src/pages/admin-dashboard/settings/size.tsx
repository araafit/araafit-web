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

const sizes = {
  bust: [34, 35, 36, 37, 38, 40],
  waist: [28, 29, 30, 31, 32],
  hips: [36, 37, 38, 39, 40],
  "dress size": [6, 8, 10, 12, 14],
};

export default function SizeTabs() {
  const [chartType, setChartType] = useState("");
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [AddchartType, setAddChartType] = useState("");
  const [AddnewValue, setAddNewValue] = useState("");

  const handleAdd = () => {
    console.log("Adding:", { chartType, newValue });
  };
  return (
    <>
      <div className="bg-white w-full h-full px-4 py-6 pb-44">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="font-semibold text-[28px] capitalize">
            Manage Orders & Requests
          </h2>
          <Dialog>
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
                    onValueChange={setAddChartType}
                    defaultValue={AddchartType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bust">Bust</SelectItem>
                      <SelectItem value="waist">Waist</SelectItem>
                      <SelectItem value="hips">Hips</SelectItem>
                      <SelectItem value="dress">Dress Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* New Value */}
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">New Value</label>
                  <Input
                    type="number"
                    value={AddnewValue}
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
                  text="Add"
                  type="submit"
                  variant="solid"
                  className="bg-[#9A6C50] text-white flex-1"
                  disabled={!AddchartType || !AddnewValue}
                  onClick={handleAdd}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] my-4 bg-[#F0F2F5]" />
        <div className="space-y-6 max-w-[530px] mx-auto">
          {Object.entries(sizes).map(([label, values]) => (
            <div key={label}>
              {/* Label */}
              <div className="flex justify-between items-center ">
                <span className="capitalize text-[#676767] text-sm">
                  {label}
                </span>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="ml-auto p-2 text-sm flex gap-2  text-[#4F4F4F] hover:text-[#7B523F]">
                      <PencilSimpleIcon size={20} />
                      Edit
                    </button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-lg">
                    <DialogHeader>
                      <DialogTitle className="text-[#1C1C1C] text-lg font-inter">
                        Edit Size Chart
                      </DialogTitle>
                      <DialogDescription className="text-[#4F4F4F] font-inter mt-3">
                        Edit the size label and measurement to update your
                        chart.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      {/* Dropdown for chart type */}
                      <div className="space-y-1">
                        <label className="text-sm text-[#676767]">
                          Chart Type
                        </label>
                        <Select
                          onValueChange={setChartType}
                          defaultValue={chartType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bust">Bust</SelectItem>
                            <SelectItem value="waist">Waist</SelectItem>
                            <SelectItem value="hips">Hips</SelectItem>
                            <SelectItem value="dress size">
                              Dress Size
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Old Value */}
                      <div className="space-y-1">
                        <label className="text-sm text-[#676767]">
                          Old Value
                        </label>
                        <Input
                          type="number"
                          value={oldValue}
                          onChange={(e) => setOldValue(e.target.value)}
                          placeholder="Enter old value"
                        />
                      </div>

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
                          type="submit"
                          variant="outline"
                        />
                      </DialogClose>
                      <Button
                        text=" Update"
                        type="submit"
                        variant="solid"
                        className="text-white flex-1"
                        // onClick={handleUpdate}
                        disabled={!chartType || !oldValue || !newValue}
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Sizes */}
              <div className="flex gap-2 flex-wrap mt-2">
                {values.map((v) => (
                  <div
                    key={v}
                    className="w-16 h-10 flex items-center justify-center border border-[#D0D5DD] rounded-md text-sm text-[#1C1C1C] bg-white"
                  >
                    {v}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
