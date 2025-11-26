import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  PlusIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  useCreateDressStyle,
  useDressStyles,
} from "../../../../hooks/admin-settings.hooks";
import Button from "../../../../shared-components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import StylesList from "./style-list";
import Spinner from "../../../../shared-components/spinner";

/* -------------------------------------------------------------------------------------------------------------------- */

export default function StylesTabs() {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [yardEstimate, setYardEstimate] = useState("");
  const [contributorPhotos, setContributorPhotos] = useState<File[]>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // API hooks
  const { data: styles, isLoading, isError } = useDressStyles();
  const createDressStyleMutation = useCreateDressStyle();

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const maxFiles = 10;

    // Check total file limit
    const currentCount = contributorPhotos.length;
    const availableSlots = maxFiles - currentCount;

    if (availableSlots <= 0) {
      console.warn(`Maximum ${maxFiles} files allowed`);
      e.target.value = "";
      return;
    }

    // Take only the files that fit within the limit
    const filesToProcess = files.slice(0, availableSlots);

    // Validate file types and sizes
    const validFiles = filesToProcess.filter((file) => {
      const isValidType = ["image/png", "image/jpg", "image/jpeg"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        console.warn(`Invalid file type: ${file.name} (${file.type})`);
        return false;
      }

      if (!isValidSize) {
        console.warn(
          `File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(
            2
          )}MB)`
        );
        return false;
      }

      return true;
    });

    if (validFiles.length !== filesToProcess.length) {
      console.warn(
        `${
          filesToProcess.length - validFiles.length
        } files were rejected due to validation`
      );
    }

    if (files.length > availableSlots) {
      console.warn(
        `Only ${availableSlots} files can be added (limit: ${maxFiles})`
      );
    }

    setContributorPhotos((prev) => [...prev, ...validFiles]);

    // Reset input value to allow re-uploading the same file if needed
    e.target.value = "";
  };

  const handleDeleteImage = (index: number) => {
    setContributorPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    if (
      !selectedStyle ||
      !selectedSize ||
      !yardEstimate ||
      contributorPhotos.length === 0
    ) {
      console.warn("Form validation failed:", {
        selectedStyle: !!selectedStyle,
        selectedSize: !!selectedSize,
        yardEstimate: !!yardEstimate,
        hasPhotos: contributorPhotos.length > 0,
      });
      return;
    }

    const yardNumber = Number(yardEstimate);
    if (isNaN(yardNumber) || yardNumber <= 0) {
      console.warn("Invalid yard estimate:", yardEstimate);
      return;
    }

    try {
      await createDressStyleMutation.mutateAsync({
        dressStyle: selectedStyle,
        dressSize: selectedSize,
        yardEstimate: yardNumber,
        files: contributorPhotos,
      });

      // Reset form
      setSelectedStyle("");
      setSelectedSize("");
      setYardEstimate("");
      setContributorPhotos([]);
      setIsAddDrawerOpen(false);
    } catch (error) {
      console.error("Failed to create dress style:", error);
    }
  };

  return (
    <div className="bg-white w-full h-full px-4 py-6 pb-44">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="font-semibold text-[28px] capitalize">Manage Styles</h2>
        <Drawer open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
          <DrawerTrigger asChild>
            <div className="flex gap-1 items-center cursor-pointer">
              <PlusIcon className="text-[#9A6C50]" />
              <p className="font-light text-[#9A6C50]">Add new style</p>
            </div>
          </DrawerTrigger>

          <DrawerContent className="bg-white rounded-t-xl w-[500px]  h-[52.75rem] flex flex-col">
            {/* Header */}
            <DrawerHeader className="flex items-center gap-3  pb-3">
              <DrawerClose>
                <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
                  <ArrowLeftIcon />
                </div>
              </DrawerClose>
              <DrawerTitle className="text-lg font-semibold text-[#1C1C1C]">
                Add New Style
              </DrawerTitle>
            </DrawerHeader>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto pb-20 space-y-6">
              {/* Upload Section */}
              <div className="h-[298px] w-full px-6 flex flex-row justify-center items-center border border-dashed border-[#D0D5DD] rounded-[12px] bg-white">
                {createDressStyleMutation.isPending ? (
                  <div className="flex items-center gap-2 text-[#9A6C50] font-medium">
                    <span className="relative flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9A6C50] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-[#9A6C50]"></span>
                    </span>
                    Creating Style...
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="text-base font-sans mb-2 text-center w-full cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      multiple
                      onChange={handlePhotosChange}
                      id="file-upload"
                      className="hidden"
                      disabled={createDressStyleMutation.isPending}
                    />
                    <div className="h-12 w-12 bg-[#F0F2F5] rounded-full flex items-center justify-center mx-auto">
                      <CloudArrowUpIcon className="text-[#475367]" size={32} />
                    </div>
                    <span className="text-[#9A6C50]">Click to upload</span> or
                    drag and drop
                    <span className="block mt-2 text-[#888888] font-light text-sm">
                      PNG, JPG (max. 5MB per file)
                    </span>
                    {contributorPhotos.length > 0 && (
                      <span className="block mt-1 text-[#9A6C50] text-sm font-medium">
                        {contributorPhotos.length} file
                        {contributorPhotos.length !== 1 ? "s" : ""} selected
                      </span>
                    )}
                    <div className="flex items-center w-full my-7 gap-2">
                      <div className="flex-grow border-t border-[#F0F2F5]"></div>
                      <span className="text-[#5D5D5D]">OR</span>
                      <div className="flex-grow border-t border-[#F0F2F5]"></div>
                    </div>
                    <span className="h-12 py-3 px-5 bg-primary-500 rounded-[0.375rem] text-white shadow-sm w-44">
                      Browser file
                    </span>
                  </label>
                )}
              </div>

              {/* Previews */}
              <div className="flex gap-4 flex-wrap mt-4">
                {contributorPhotos.map((file, idx) => (
                  <div
                    key={idx}
                    className="w-[172px] h-[122px] rounded-2xl relative"
                  >
                    <div className="bg-[#0006] rounded-2xl absolute w-full h-full z-10 flex justify-center items-center">
                      <TrashSimpleIcon
                        className="z-40 cursor-pointer text-red-800"
                        onClick={() => handleDeleteImage(idx)}
                      />
                    </div>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Image ${idx + 1}`}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-[#676767]">Dress Style</label>
                <Select
                  value={selectedStyle}
                  onValueChange={setSelectedStyle}
                  disabled={createDressStyleMutation.isPending}
                >
                  <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                    <SelectValue placeholder="Select Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corset">Corset</SelectItem>
                    <SelectItem value="Peplum top">Peplum top</SelectItem>
                    <SelectItem value="A-gowns">A-gowns</SelectItem>
                    <SelectItem value="Puffy sleeves">Puffy sleeves</SelectItem>
                    <SelectItem value="Off-shoulder">Off-shoulder</SelectItem>
                    <SelectItem value="Flay dresses">Flay dresses</SelectItem>
                    <SelectItem value="Boubou">Boubou</SelectItem>
                    <SelectItem value="Jumpsuit">Jumpsuit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dress Size Dropdown */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">Dress Size</label>
                <Select
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  disabled={createDressStyleMutation.isPending}
                >
                  <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Yard Estimate */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">Yard Estimate</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Enter yard estimate (e.g., 3.5)"
                  value={yardEstimate}
                  onChange={(e) => setYardEstimate(e.target.value)}
                  className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm"
                  disabled={createDressStyleMutation.isPending}
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="border-t border-[#E8E8E8] bg-white p-4 h-20 flex justify-center items-center sticky bottom-0">
              <Button
                type="button"
                variant="solid"
                className="w-full md:max-w-[9.375rem]"
                disabled={
                  !selectedStyle ||
                  !selectedSize ||
                  !yardEstimate ||
                  contributorPhotos.length === 0 ||
                  createDressStyleMutation.isPending
                }
                onClick={handleAdd}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Add</span>
                  <Spinner
                    isLoading={createDressStyleMutation.isPending}
                    speed="fast"
                    size="sm"
                    arcColor="#ffff"
                  />
                </div>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] my-4 bg-[#F0F2F5]" />

      <StylesList isLoading={isLoading} isError={isError} styles={styles} />
    </div>
  );
}
