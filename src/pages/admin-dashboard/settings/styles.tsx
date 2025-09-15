import { useState } from "react";
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashSimpleIcon,
  CloudArrowUpIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import Button from "../../../shared-components/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "../../ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import emptyFolder from "../images/empty 1.png";
import { useDressStyles, useCreateDressStyle, useDeleteDressStyle } from "../../../hooks/admin-settings.hooks";
import Spinner from "../../../shared-components/spinner";

export default function StylesTabs() {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [yardEstimate, setYardEstimate] = useState("");
  const [contributorPhotos, setContributorPhotos] = useState<File[]>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // API hooks
  const { data: styles, isLoading, error } = useDressStyles();
  const createDressStyleMutation = useCreateDressStyle();
  const deleteDressStyleMutation = useDeleteDressStyle();

  const handleDelete = async (id: string) => {
    try {
      await deleteDressStyleMutation.mutateAsync(id);
    } catch (err) {
      // Error handled in hook
      console.error('Failed to delete dress style:', err);
    }
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const maxFiles = 10;
    
    // Check total file limit
    const currentCount = contributorPhotos.length;
    const availableSlots = maxFiles - currentCount;
    
    if (availableSlots <= 0) {
      console.warn(`Maximum ${maxFiles} files allowed`);
      e.target.value = '';
      return;
    }
    
    // Take only the files that fit within the limit
    const filesToProcess = files.slice(0, availableSlots);
    
    // Validate file types and sizes
    const validFiles = filesToProcess.filter(file => {
      const isValidType = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        console.warn(`Invalid file type: ${file.name} (${file.type})`);
        return false;
      }
      
      if (!isValidSize) {
        console.warn(`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length !== filesToProcess.length) {
      console.warn(`${filesToProcess.length - validFiles.length} files were rejected due to validation`);
    }

    if (files.length > availableSlots) {
      console.warn(`Only ${availableSlots} files can be added (limit: ${maxFiles})`);
    }

    setContributorPhotos((prev) => [...prev, ...validFiles]);
    
    // Reset input value to allow re-uploading the same file if needed
    e.target.value = '';
  };

  const handleDeleteImage = (index: number) => {
    setContributorPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    if (!selectedStyle || !selectedSize || !yardEstimate || contributorPhotos.length === 0) {
      console.warn('Form validation failed:', {
        selectedStyle: !!selectedStyle,
        selectedSize: !!selectedSize,
        yardEstimate: !!yardEstimate,
        hasPhotos: contributorPhotos.length > 0
      });
      return;
    }

    const yardNumber = Number(yardEstimate);
    if (isNaN(yardNumber) || yardNumber <= 0) {
      console.warn('Invalid yard estimate:', yardEstimate);
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
      console.error('Failed to create dress style:', error);
    }
  };

  return (
    <>
      <div className="bg-white w-full h-full px-4 py-6 pb-44">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="font-semibold text-[28px] capitalize">
            Manage Styles
          </h2>
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
                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    multiple
                    onChange={handlePhotosChange}
                    id="file-upload"
                    style={{ display: "none" }}
                    disabled={createDressStyleMutation.isPending}
                  />
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
                      <div className="h-12 w-12 bg-[#F0F2F5] rounded-full flex items-center justify-center mx-auto">
                        <CloudArrowUpIcon
                          className="text-[#475367]"
                          size={32}
                        />
                      </div>
                      <span className="text-[#9A6C50]">Click to upload</span> or
                      drag and drop
                      <span className="block mt-2 text-[#888888] font-light text-sm">
                        PNG, JPG (max. 5MB per file)
                      </span>
                      {contributorPhotos.length > 0 && (
                        <span className="block mt-1 text-[#9A6C50] text-sm font-medium">
                          {contributorPhotos.length} file{contributorPhotos.length !== 1 ? 's' : ''} selected
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
                      />
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
                      <div className="bg-black opacity-40 rounded-2xl absolute w-full h-full z-10 flex justify-center items-center">
                        <TrashSimpleIcon
                          className="z-40 cursor-pointer text-white"
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
                      <SelectItem value="Puffy sleeves">
                        Puffy sleeves
                      </SelectItem>
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
                  <label className="text-sm text-[#676767]">
                    Yard Estimate
                  </label>
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
                  text={createDressStyleMutation.isPending ? "Adding..." : "Add"}
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
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] my-4 bg-[#F0F2F5]" />
        <div className="px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" speed="fast" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-6">
              <p className="text-red-600">Failed to load dress styles</p>
            </div>
          ) : !styles || styles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src={emptyFolder}
                alt="Empty folder"
                className="w-32 h-32 mb-4"
              />
              <p className="text-[#4F4F4F] text-sm">No styles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {styles.map((style) => (
                <div
                  key={style.id}
                  className="bg-white shadow rounded-xl overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <img
                    src={style.images?.[0]?.url || emptyFolder}
                    alt={style.dressStyle}
                    className="w-full h-40 object-cover"
                  />

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-[#1C1C1C]">
                        {style.dressStyle}
                      </h3>
                      <div className="flex gap-2">
                        {/* Edit Button - View Style Details */}
                        <Drawer>
                          <DrawerTrigger asChild>
                            <button 
                              className="text-[#4F4F4F] hover:text-[#7B523F] p-1 rounded hover:bg-gray-100 transition-colors"
                              title="View style details"
                            >
                              <PencilSimpleIcon size={18} />
                            </button>
                          </DrawerTrigger>

                          <DrawerContent className="bg-white rounded-t-xl w-[500px] h-[52.75rem] flex flex-col">
                            {/* Header */}
                            <DrawerHeader className="flex items-center gap-3 pb-3">
                              <DrawerClose>
                                <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
                                  <ArrowLeftIcon />
                                </div>
                              </DrawerClose>
                              <DrawerTitle className="text-lg font-semibold text-[#1C1C1C]">
                                Style Details: {style.dressStyle}
                              </DrawerTitle>
                            </DrawerHeader>

                            {/* Body */}
                            <div className="p-6 flex-1 overflow-y-auto pb-20 space-y-6">
                              {/* Style Images */}
                              <div className="space-y-3">
                                <label className="text-sm text-[#676767] font-medium">Style Images</label>
                                <div className="grid grid-cols-2 gap-4">
                                  {style.images.map((image, idx) => (
                                    <div key={image.id} className="relative">
                                      <img
                                        src={image.url}
                                        alt={`${style.dressStyle} ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-[#D0D5DD]"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Dress Style */}
                              <div className="space-y-1">
                                <label className="text-sm text-[#676767]">Dress Style</label>
                                <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#1C1C1C]">
                                  {style.dressStyle}
                                </div>
                              </div>

                              {/* Dress Size */}
                              <div className="space-y-1">
                                <label className="text-sm text-[#676767]">Dress Size</label>
                                <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#1C1C1C]">
                                  {style.dressSize}
                                </div>
                              </div>

                              {/* Yard Estimate */}
                              <div className="space-y-1">
                                <label className="text-sm text-[#676767]">Yard Estimate</label>
                                <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#1C1C1C]">
                                  {style.yardEstimate} yards
                                </div>
                              </div>

                              {/* Style ID */}
                              <div className="space-y-1">
                                <label className="text-sm text-[#676767]">Style ID</label>
                                <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#888888]">
                                  {style.id}
                                </div>
                              </div>
                            </div>

                            {/* Footer Note */}
                            <div className="border-t border-[#E8E8E8] bg-gray-50 p-4 h-16 flex items-center justify-center">
                              <p className="text-sm text-[#676767] italic">
                                Style details are read-only. To modify, delete and create a new style.
                              </p>
                            </div>
                          </DrawerContent>
                        </Drawer>

                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete style"
                            >
                              <TrashSimpleIcon size={18} />
                            </button>
                          </DialogTrigger>

                          <DialogContent className="max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle className="my-2">
                                Delete {style.dressStyle}?
                              </DialogTitle>
                              <DialogDescription className="text-[#4F4F4F] ">
                                Are you sure you want to delete this style and
                                its information? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter className="flex">
                              <DialogClose asChild className="flex-1">
                                <Button
                                  text="Cancel"
                                  variant="outline"
                                  className="border border-[#E7E7E7] text-[#3D3D3D]"
                                />
                              </DialogClose>
                              <Button
                                text={deleteDressStyleMutation.isPending ? "Deleting..." : "Delete"}
                                type="submit"
                                variant="solid"
                                onClick={() => handleDelete(style.id)}
                                disabled={deleteDressStyleMutation.isPending}
                                className="text-white flex-1 bg-[#DC2626]"
                              />
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Quick View Style */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        <button className="text-sm text-[#9A6C50] mt-auto flex gap-1 items-center self-start hover:text-[#7B523F] transition-colors">
                          Quick View
                          <ArrowRightIcon size={14} />
                        </button>
                      </DrawerTrigger>
                      <DrawerContent className="p-6 bg-white rounded-t-xl max-h-[80vh]">
                        <DrawerHeader>
                          <DrawerTitle className="text-xl">{style.dressStyle}</DrawerTitle>
                          <DrawerDescription className="text-base">
                            Size: <span className="font-medium">{style.dressSize}</span> | 
                            Yard Estimate: <span className="font-medium">{style.yardEstimate} yards</span>
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                          {style.images.map((image, idx) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt={`${style.dressStyle} ${idx + 1}`}
                                className="w-full h-60 object-cover rounded-lg border border-[#D0D5DD] group-hover:shadow-md transition-shadow"
                              />
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                {idx + 1} of {style.images.length}
                              </div>
                            </div>
                          ))}
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
