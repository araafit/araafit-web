import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  PlusIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  useDressStyles,
  useCreateStyle,
  useChartsByGender,
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
  const [contributorPhotos, setContributorPhotos] = useState<File[]>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("female");
  const [selectedChartId, setSelectedChartId] = useState<string>("");
  const [sizeConfigs, setSizeConfigs] = useState<Record<string, string>>({});

  // API hooks
  const { data: styles, isLoading, isError } = useDressStyles();
  const createStyleMutation = useCreateStyle();
  const chartsList = useChartsByGender(gender);

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
    const sizeConfigsPayload = Object.entries(sizeConfigs)
      .map(([entryId, yardsStr]) => ({
        sizeChartEntryId: entryId,
        fabricYards: Number(yardsStr),
      }))
      .filter((cfg) => !Number.isNaN(cfg.fabricYards) && cfg.fabricYards > 0);

    if (
      !selectedStyle ||
      sizeConfigsPayload.length === 0 ||
      contributorPhotos.length === 0
    ) {
      console.warn("Form validation failed:", {
        selectedStyle: !!selectedStyle,
        hasSizeConfigs: sizeConfigsPayload.length > 0,
        hasPhotos: contributorPhotos.length > 0,
      });
      return;
    }

    try {
      await createStyleMutation.mutateAsync({
        name: selectedStyle,
        sizeConfigs: sizeConfigsPayload,
        files: contributorPhotos,
      });

      // Reset form
      setSelectedStyle("");
      setContributorPhotos([]);
      setGender("female");
      setSelectedChartId("");
      setSizeConfigs({});
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

          <DrawerContent className="bg-white rounded-t-xl w-full max-w-[500px] h-screen max-h-screen flex flex-col">
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
                <input
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  multiple
                  onChange={handlePhotosChange}
                  id="file-upload"
                  style={{ display: "none" }}
                  disabled={createStyleMutation.isPending}
                />
                {createStyleMutation.isPending ? (
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
                      disabled={createStyleMutation.isPending}
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
                    <Button
                      text="Browse Files"
                      variant="solid"
                      className="text-white shadow-sm w-44"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    />
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
                <label className="text-sm text-[#676767]">Style Name</label>
                <input
                  type="text"
                  placeholder="Enter style name (e.g., Corset)"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm"
                  disabled={createStyleMutation.isPending}
                />
              </div>

              {/* Size Configurations */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">
                    Size Chart Gender
                  </label>
                  <Select
                    value={gender}
                    onValueChange={(value) =>
                      setGender(value as "male" | "female")
                    }
                    disabled={createStyleMutation.isPending}
                  >
                    <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">Size Chart</label>
                  <Select
                    value={selectedChartId}
                    onValueChange={(value) => {
                      setSelectedChartId(value);
                      setSizeConfigs({});
                    }}
                    disabled={createStyleMutation.isPending}
                  >
                    <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                      <SelectValue placeholder="Select size chart" />
                    </SelectTrigger>
                    <SelectContent>
                      {chartsList.data?.map((chart) => (
                        <SelectItem key={chart.id} value={chart.id}>
                          {chart.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border border-[#F0F2F5] rounded-lg p-3 max-h-56 overflow-y-auto">
                  {!selectedChartId ? (
                    <p className="text-xs text-[#676767]">
                      Select a size chart to configure fabric yards per size.
                    </p>
                  ) : chartsList.isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Spinner size="sm" speed="fast" />
                    </div>
                  ) : (
                    (() => {
                      const chart = chartsList.data?.find(
                        (c) => c.id === selectedChartId
                      );
                      if (
                        !chart ||
                        !chart.entries ||
                        chart.entries.length === 0
                      ) {
                        return (
                          <p className="text-xs text-[#676767]">
                            No entries available for this chart.
                          </p>
                        );
                      }
                      console.log("chart.entries", chart.entries);
                      return (
                        <div className="space-y-2">
                          {chart.entries.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span className="text-[#1C1C1C]">
                                {entry.label}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#676767]">
                                  Yards
                                </span>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  className="w-20 h-9 border border-[#D0D5DD] rounded-lg px-2 text-xs"
                                  value={sizeConfigs[entry.id] ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSizeConfigs((prev) => {
                                      const next = { ...prev };
                                      if (!value) {
                                        delete next[entry.id];
                                      } else {
                                        next[entry.id] = value;
                                      }
                                      return next;
                                    });
                                  }}
                                  disabled={createStyleMutation.isPending}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="border-t border-[#E8E8E8] bg-white p-4 h-20 flex justify-center items-center sticky bottom-0">
              <Button
                text={createStyleMutation.isPending ? "Adding..." : "Add"}
                type="button"
                variant="solid"
                className="w-full md:max-w-[9.375rem]"
                disabled={
                  !selectedStyle ||
                  contributorPhotos.length === 0 ||
                  createStyleMutation.isPending
                }
                onClick={handleAdd}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Add</span>
                  <Spinner
                    isLoading={createStyleMutation.isPending}
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
