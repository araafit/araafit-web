import {
  CaretRightIcon,
  CloudArrowUpIcon,
  TrashSimpleIcon,
  XIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import { useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { TableButton } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { CaretDownIcon } from "@phosphor-icons/react";
// import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";

const skinTone = ["Porcelin", "Ivory", "Sand", "Espresso", "Chestnut", "Honey"];

export function AdminDashboardUploadInventory() {
  //   const { inventoryId } = useParams();
  const [contributorPhotos, setContributorPhotos] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [discountsEnabled, setDiscountsEnabled] = useState(false);

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
  const [selectedTone, setSelectedTone] = useState<string[]>([]);

  const toggleTone = (size: string) => {
    setSelectedTone((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const removeTone = (size: string) => {
    setSelectedTone((prev) => prev.filter((s) => s !== size));
  };
  const title = (
    <div className="font-lora font-medium text-[#1C1C1C]">Inventory</div>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-primary-900" />
      <span className="text-primary-900">Inventory</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Dress</span>
    </div>
  );
  return (
    <AdminDashboardLayout>
      <div className="h-screen">
        <div className="flex flex-col gap-2  relative">
          <TopBar
            title={title}
            breadCrumb={<BreadCrumb />}
            rightSide={
              <>
                <NotificationBell />

                <Button
                  text="Add"
                  icon={<PlusIcon className="size-[1.25rem] text-white" />}
                  variant="solid"
                  className="text-white shadow-sm"
                />
              </>
            }
          />
        </div>
        <div className="w-full  flex flex-col  p-4 mt-20 overflow-y-scroll px-10">
          <div>
            <h2 className="font-semibold text-[28px]">Upload a Dress</h2>
            <span className="capitalize text-[#5D5D5D] font-light cursor-pointer text-sm font-inter">
              Upload dresses your clients will love to explore and choose from.
            </span>
          </div>
          <section className="flex justify-between gap-10 mt-8">
            {" "}
            <div className="w-full max-w-[448px] relative">
              {/* Upload Box */}
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
                    className="text-base font-sans mb-2 text-center w-full cursor-pointer "
                  >
                    <div className="h-12 w-12 bg-[#F0F2F5] rounded-full flex items-center justify-center mx-auto">
                      <CloudArrowUpIcon className="text-[#475367]" size={32} />
                    </div>
                    <span className="text-[#9A6C50]">Click to upload</span> or
                    drag and drop
                    <span className="block mt-2 text-[#888888] font-light text-sm">
                      PNG, JPG (max. 800x400px)
                    </span>
                    {/* DividerWithText */}
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
              {contributorPhotos.length > 0 && (
                <div className="flex gap-4 flex-wrap mt-4">
                  {contributorPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="w-[142px] h-[108px] relative overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover rounded-[6px] "
                      />
                      {/* Trash Icon */}
                      <button
                        onClick={() => handleDeleteImage(idx)}
                        className="absolute bottom-2 right-2 rounded-full p-1 "
                      >
                        <TrashSimpleIcon className="text-red-500" size={24} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Information section */}
            <div className="flex-1 max-w-[654px]">
              {/* generals */}
              <div className="bg-white rounded-[6px] py-6 px-4">
                <h4 className="font-semibold">General Information</h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px] ">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="h-14 w-full border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <DropdownMenu>
                      <label
                        htmlFor="name"
                        className="block text-[#4F4F4F] font-light text-sm"
                      >
                        Category
                      </label>
                      <DropdownMenuTrigger asChild>
                        <TableButton
                          variant="outline"
                          size="sm"
                          className="w-full h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3"
                        >
                          <span className="font-light">Dress</span>
                          <CaretDownIcon className="text-[#676767]" size={20} />
                        </TableButton>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-52 h-full flex flex-col items-start gap-3 p-3">
                        {/* {orderStatuses.map((status) => (
                      <DropdownMenuItem
                        className={`${status.bgColor} ${status.textColor} px-2 cursor-pointer text-xs py-1   w-auto  block  rounded-full`}
                        key={status.status}
                      >
                        {status.status}
                      </DropdownMenuItem>
                    ))} */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="w-full mt-4">
                  <label
                    htmlFor="name"
                    className="block text-[#4F4F4F] font-light"
                  >
                    Product Description
                  </label>
                  <input
                    type="text"
                    className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                  />
                </div>
              </div>
              {/* Dress Info */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <h4 className="font-semibold">Dress Information</h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px] ">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Material Type
                    </label>
                    <input
                      type="text"
                      className="h-14 w-full border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <DropdownMenu>
                      <label
                        htmlFor="name"
                        className="block text-[#4F4F4F] font-light text-sm"
                      >
                        General Dress Size
                      </label>
                      <DropdownMenuTrigger asChild>
                        <TableButton
                          variant="outline"
                          size="sm"
                          className="w-full h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3"
                        >
                          <span className="font-light">14</span>
                          <CaretDownIcon className="text-[#676767]" size={20} />
                        </TableButton>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-52 h-full flex flex-col items-start gap-3 p-3">
                        {/* {orderStatuses.map((status) => (
                      <DropdownMenuItem
                        className={`${status.bgColor} ${status.textColor} px-2 cursor-pointer text-xs py-1   w-auto  block  rounded-full`}
                        key={status.status}
                      >
                        {status.status}
                      </DropdownMenuItem>
                    ))} */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px] ">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Weight (gsm)
                    </label>
                    <input
                      type="text"
                      className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Thickness (mm)
                    </label>
                    <input
                      type="text"
                      className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              {/* skintone Info */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <h4 className="font-semibold">Skin Tone Recommendation</h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-full ">
                    <DropdownMenu>
                      <label
                        htmlFor="name"
                        className="block text-[#4F4F4F] font-light  text-sm"
                      >
                        Skin Tone
                      </label>

                      <DropdownMenuTrigger asChild>
                        <TableButton
                          variant="outline"
                          size="sm"
                          className="w-full min-h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3"
                        >
                          <div className="flex flex-wrap gap-2">
                            {selectedTone.length > 0 ? (
                              selectedTone.map((size) => (
                                <span
                                  key={size}
                                  className="flex items-center gap-1 border border-[#E7E7E7] p-2 rounded-[4px]  text-sm"
                                >
                                  {size}
                                  <XIcon
                                    size={16}
                                    className="text-red-500 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeTone(size);
                                    }}
                                  />
                                </span>
                              ))
                            ) : (
                              <span className="text-[#9A9A9A] font-light">
                                Skin Tone
                              </span>
                            )}
                          </div>

                          <CaretDownIcon
                            className="text-[#676767] ml-auto"
                            size={20}
                          />
                        </TableButton>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-52 flex flex-col items-start gap-2 p-3">
                        {skinTone.map((tone) => (
                          <DropdownMenuItem
                            key={tone}
                            onClick={() => toggleTone(tone)}
                            className={`cursor-pointer w-full px-2 py-1 rounded-md ${
                              selectedTone.includes(tone)
                                ? "bg-[#9A6C50] text-white"
                                : ""
                            }`}
                          >
                            {tone}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              {/* Quantity/Price */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <h4 className="font-semibold">Quantity/Price</h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px] ">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Quantity Available
                    </label>
                    <input
                      type="text"
                      className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Price (₦)
                    </label>
                    <input
                      type="text"
                      className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              {/* Discounts */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Discounts</h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        discountsEnabled ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {/* {discountsEnabled ? "Active" : "Inactive"} */}
                    </span>
                    <Switch
                      checked={discountsEnabled}
                      onCheckedChange={setDiscountsEnabled}
                    />
                  </div>
                </div>

                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
                    <DropdownMenu>
                      <label
                        className={`block text-sm font-light mb-1 ${
                          discountsEnabled ? "text-[#4F4F4F]" : "text-gray-400"
                        }`}
                      >
                        Discount Type
                      </label>
                      <DropdownMenuTrigger asChild disabled={!discountsEnabled}>
                        <TableButton
                          variant="outline"
                          size="sm"
                          className={`w-full h-14 border text-sm flex items-center justify-between px-3
                  ${
                    discountsEnabled
                      ? "border-[#D0D5DD] text-[#676767] bg-white"
                      : "border-gray-200 text-gray-400 bg-white"
                  }
                `}
                        >
                          <span className="font-light">Select type</span>
                          <CaretDownIcon size={20} />
                        </TableButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-52 flex flex-col items-start gap-3 p-3">
                        {/* Dropdown items here */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex-1">
                    <label
                      className={`block text-sm font-light mb-1 ${
                        discountsEnabled ? "text-[#4F4F4F]" : "text-gray-400"
                      }`}
                    >
                      Discount Value
                    </label>
                    <input
                      type="text"
                      disabled={!discountsEnabled}
                      placeholder="Araafit"
                      className={`h-14 w-full pl-2 rounded-lg outline-none placeholder:font-light font-light
    ${
      discountsEnabled
        ? "border border-[#D0D5DD] bg-white text-[#4F4F4F]"
        : "border border-gray-200 bg-white text-gray-400 cursor-not-allowed"
    }
  `}
                    />
                  </div>
                </div>

                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
                    <label
                      className={`block font-light text-sm mb-1 ${
                        discountsEnabled ? "text-[#4F4F4F]" : "text-gray-400"
                      }`}
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      disabled={!discountsEnabled}
                      className={`h-14 w-full pl-2 rounded-lg outline-none
        ${
          discountsEnabled
            ? "border border-[#D0D5DD] bg-white text-[#4F4F4F]"
            : "border border-gray-200 bg-white text-gray-400 cursor-not-allowed"
        }
      `}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      className={`block font-light text-sm mb-1 ${
                        discountsEnabled ? "text-[#4F4F4F]" : "text-gray-400"
                      }`}
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      disabled={!discountsEnabled}
                      className={`h-14 w-full pl-2 rounded-lg outline-none
        ${
          discountsEnabled
            ? "border border-[#D0D5DD] bg-white text-[#4F4F4F]"
            : "border border-gray-200 bg-white text-gray-400 cursor-not-allowed"
        }
      `}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <Button
                  text="Add"
                  icon={<PlusIcon className="size-[1.25rem] text-white" />}
                  variant="solid"
                  className="text-white self-end shadow-sm mt-12 relative right-0"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
