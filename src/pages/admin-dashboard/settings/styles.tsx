import { useState } from "react";
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashSimpleIcon,
  CloudArrowUpIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import axios from "axios";
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
import { rtw1, rtw2, rtw3 } from "../../user-dashboard/images/image-entry";

type Style = {
  id: number;
  name: string;
  image: string;
  description: string;
  dressStyle: string;
  dressSize: string;
  yardEstimate: string;
};

const stylesData: Style[] = [
  {
    id: 1,
    name: "Summer Dress",
    image: rtw1,
    description: "Light and breezy dress for summer outings.",
    dressStyle: "A-Line",
    dressSize: "8",
    yardEstimate: "3 yards",
  },
  {
    id: 2,
    name: "Evening Gown",
    image: rtw2,
    description: "Elegant evening gown with lace details.",
    dressStyle: "Mermaid",
    dressSize: "10",
    yardEstimate: "5 yards",
  },
  {
    id: 3,
    name: "Casual Fit",
    image: rtw3,
    description: "Comfortable everyday wear.",
    dressStyle: "Shift",
    dressSize: "6",
    yardEstimate: "2.5 yards",
  },
];
export default function StylesTabs() {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [yardEstimate, setYardEstimate] = useState("");
  const [contributorPhotos, setContributorPhotos] = useState<string[]>([]);
  const [styles, setStyles] = useState<Style[]>(stylesData);

  const handleDelete = (id: number) => {
    setStyles((prev) => prev.filter((s) => s.id !== id));
  };
  const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setIsUploadingImage(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "oyzsznex"); // your Cloudinary preset

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dbnkyv0ht/upload`;
        const response = await axios.post(cloudinaryUrl, formData);

        uploadedUrls.push(response.data.secure_url);
      }

      setContributorPhotos((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    setContributorPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  //   const handleAdd = () => {
  //     console.log("Adding:", { chartType, newValue });
  //     // 🔗 here’s where API integration will happen
  //   };

  return (
    <>
      <div className="bg-white w-full h-full px-4 py-6 pb-44">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="font-semibold text-[28px] capitalize">
            Manage Styles
          </h2>
          <Drawer>
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
                  />
                  {isUploadingImage ? (
                    <div className="flex items-center gap-2 text-[#9A6C50] font-medium">
                      <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9A6C50] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-[#9A6C50]"></span>
                      </span>
                      Uploading...
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
                        PNG, JPG (max. 800x400px)
                      </span>
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
                  {contributorPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="w-[172px] h-[122px] rounded-2xl relative"
                    >
                      <div className="bg-black opacity-40 rounded-2xl absolute w-full h-full z-10 flex justify-center items-center">
                        <TrashSimpleIcon
                          className="z-40 cursor-pointer"
                          onClick={() => handleDeleteImage(idx)}
                        />
                      </div>
                      <img
                        src={photo}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full rounded-2xl"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">Dress Style</label>
                  <Select
                    value={selectedStyle}
                    onValueChange={setSelectedStyle}
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
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
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
                    type="text"
                    placeholder="Enter yard estimate (e.g., 3 yards)"
                    value={yardEstimate}
                    onChange={(e) => setYardEstimate(e.target.value)}
                    className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="border-t border-[#E8E8E8] bg-white p-4 h-20 flex justify-center items-center sticky bottom-0">
                <Button
                  text="Add"
                  type="button"
                  variant="solid"
                  className="w-full md:max-w-[9.375rem]"
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] my-4 bg-[#F0F2F5]" />
        <div className="px-4 py-6">
          {styles.length === 0 ? (
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
                    src={style.image}
                    alt={style.name}
                    className="w-full h-40 object-cover"
                  />

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-[#1C1C1C]">
                        {style.name}
                      </h3>
                      <div className="flex gap-2">
                        <Drawer>
                          <DrawerTrigger asChild>
                            <button className="text-[#4F4F4F] hover:text-[#7B523F]">
                              <PencilSimpleIcon size={18} />
                            </button>
                          </DrawerTrigger>

                          <DrawerContent className="w-[500px] flex flex-col h-[52.75rem]">
                            {/* Header */}
                            <DrawerHeader className="flex items-center gap-3  pb-3">
                              <DrawerClose>
                                <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
                                  <ArrowLeftIcon />
                                </div>
                              </DrawerClose>
                              <DrawerTitle className="text-lg font-semibold text-[#1C1C1C]">
                                Edit New Style
                              </DrawerTitle>
                            </DrawerHeader>

                            {/* Body */}
                            <div className="p-6 flex-1 overflow-y-auto pb-36 space-y-6">
                              {/* Upload Section */}
                              <div className="h-[298px] w-full px-6 flex flex-row justify-center items-center border border-dashed border-[#D0D5DD] rounded-[12px] bg-white">
                                <input
                                  type="file"
                                  accept="image/png, image/jpg, image/jpeg"
                                  multiple
                                  onChange={handlePhotosChange}
                                  id="file-upload"
                                  style={{ display: "none" }}
                                />
                                {isUploadingImage ? (
                                  <div className="flex items-center gap-2 text-[#9A6C50] font-medium">
                                    <span className="relative flex h-5 w-5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9A6C50] opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-5 w-5 bg-[#9A6C50]"></span>
                                    </span>
                                    Uploading...
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
                                    <span className="text-[#9A6C50]">
                                      Click to upload
                                    </span>{" "}
                                    or drag and drop
                                    <span className="block mt-2 text-[#888888] font-light text-sm">
                                      PNG, JPG (max. 800x400px)
                                    </span>
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
                                {contributorPhotos.map((photo, idx) => (
                                  <div
                                    key={idx}
                                    className="w-[172px] h-[122px] rounded-2xl relative"
                                  >
                                    <div className="bg-black opacity-40 rounded-2xl absolute w-full h-full z-10 flex justify-center items-center">
                                      <TrashSimpleIcon
                                        className="z-40 cursor-pointer"
                                        onClick={() => handleDeleteImage(idx)}
                                      />
                                    </div>
                                    <img
                                      src={photo}
                                      alt={`Image ${idx + 1}`}
                                      className="w-full h-full rounded-2xl"
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="space-y-1">
                                <label className="text-sm text-[#676767]">
                                  Dress Style
                                </label>
                                <Select
                                  value={selectedStyle}
                                  onValueChange={setSelectedStyle}
                                >
                                  <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                                    <SelectValue placeholder="Select Style" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Corset">
                                      Corset
                                    </SelectItem>
                                    <SelectItem value="Peplum top">
                                      Peplum top
                                    </SelectItem>
                                    <SelectItem value="A-gowns">
                                      A-gowns
                                    </SelectItem>
                                    <SelectItem value="Puffy sleeves">
                                      Puffy sleeves
                                    </SelectItem>
                                    <SelectItem value="Off-shoulder">
                                      Off-shoulder
                                    </SelectItem>
                                    <SelectItem value="Flay dresses">
                                      Flay dresses
                                    </SelectItem>
                                    <SelectItem value="Boubou">
                                      Boubou
                                    </SelectItem>
                                    <SelectItem value="Jumpsuit">
                                      Jumpsuit
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Dress Size Dropdown */}
                              <div className="space-y-1">
                                <label className="text-sm text-[#676767]">
                                  Dress Size
                                </label>
                                <Select
                                  value={selectedSize}
                                  onValueChange={setSelectedSize}
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
                                  type="text"
                                  placeholder="Enter yard estimate (e.g., 3 yards)"
                                  value={yardEstimate}
                                  onChange={(e) =>
                                    setYardEstimate(e.target.value)
                                  }
                                  className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm"
                                />
                              </div>
                            </div>
                            <div className="border-t border-[#E8E8E8] bg-white p-4 h-20 flex justify-center items-center sticky bottom-0">
                              <Button
                                text="Save"
                                type="button"
                                variant="solid"
                                className="w-full md:max-w-[9.375rem]"
                              />
                            </div>
                          </DrawerContent>
                        </Drawer>

                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="text-[#4F4F4F] hover:text-red-500"
                              // onClick={() => handleDelete(style.id)}
                            >
                              <TrashSimpleIcon
                                className="text-red-500 cursor-pointer"
                                size={18}
                              />
                            </button>
                          </DialogTrigger>

                          <DialogContent className="max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle className="my-2">
                                Delete {style.name}?
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
                                text="Delete"
                                type="submit"
                                variant="solid"
                                onClick={() => handleDelete(style.id)}
                                //  onClick={() => {
                                //   onDelete();
                                // }}
                                className={` text-white flex-1  bg-[#DC2626]
              }`}
                              />
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* View Style Drawer */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        <button className="text-sm text-[#9A6C50]  mt-auto flex gap-1 items-center self-start">
                          View Style
                          <ArrowRightIcon />
                        </button>
                      </DrawerTrigger>
                      <DrawerContent className="p-6 bg-white rounded-t-xl">
                        <DrawerHeader>
                          <DrawerTitle>{style.name}</DrawerTitle>
                          <DrawerDescription>
                            {style.description}
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="mt-4">
                          <img
                            src={style.image}
                            alt={style.name}
                            className="w-full h-60 object-cover rounded-lg"
                          />
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
