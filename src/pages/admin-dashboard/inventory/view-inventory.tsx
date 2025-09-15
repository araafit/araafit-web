import {
  CaretRightIcon,
  CloudArrowUpIcon,
  XIcon,
} from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import { useState } from "react";
import { useProduct } from "../../../hooks/admin-inventory.hooks";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../../shared-components/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { TableButton } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { CaretDownIcon } from "@phosphor-icons/react";
// import { useParams } from "react-router-dom";

const skinTone = ["Porcelin", "Ivory", "Sand", "Espresso", "Chestnut", "Honey"];

export function AdminDashboardViewInventory() {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading: isLoadingProduct, error: productError } = useProduct(inventoryId || "");
  
  //const [, setContributorPhotos] = useState<string[]>([]);
  //const [, setIsUploadingImage] = useState(false);
  const [discountsEnabled, setDiscountsEnabled] = useState(false);

  //const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //  if (!e.target.files) return;

  //  const files = Array.from(e.target.files);
  //  setIsUploadingImage(true);

  //  try {
  //    const uploadedUrls: string[] = [];

  //    for (const file of files) {
  //      const formData = new FormData();
  //      formData.append("file", file);
  //      formData.append("upload_preset", "oyzsznex"); // your Cloudinary preset

  //      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dbnkyv0ht/upload`;
  //      const response = await axios.post(cloudinaryUrl, formData);

  //      uploadedUrls.push(response.data.secure_url);
  //    }

  //    setContributorPhotos((prev) => [...prev, ...uploadedUrls]);
  //  } catch (error) {
  //    console.error("Error uploading images:", error);
  //  } finally {
  //    setIsUploadingImage(false);
  //  }
  //};

  //const handleDeleteImage = (index: number) => {
  //  setContributorPhotos((prev) => prev.filter((_, i) => i !== index));
  //};
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
      <span className="text-[#979797]">{product?.category || "Product"}</span>
    </div>
  );

  if (isLoadingProduct) {
    return (
      <AdminDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" speed="fast" />
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (productError || !product) {
    return (
      <AdminDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load product</p>
            <Button
              text="Go Back"
              variant="solid"
              onClick={() => navigate("/admin-dashboard/inventory")}
            />
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

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
                  text="Edit"
                  variant="solid"
                  onClick={() => navigate(`/admin-dashboard/inventory/${inventoryId}/edit`)}
                  className="text-white shadow-sm w-44"
                />
              </>
            }
          />
        </div>
        <div className="w-full  flex flex-col  p-4 mt-20 overflow-y-scroll px-10">
          <div>
            <h2 className="font-semibold text-[28px]">View {product.category === "dress" ? "Dress" : "Fabric"}</h2>
            <span className="capitalize text-[#5D5D5D] font-light cursor-pointer text-sm font-inter">
              View, edit, and update your stunning {product.category} here.
            </span>
          </div>
          <section className="flex justify-between gap-10 mt-8">
            {" "}
            <div className="w-full max-w-[448px] relative">
              {/* Product Images */}
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="h-[298px] w-full rounded-[12px] overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Additional Images */}
                  {product.images.length > 1 && (
                    <div className="flex gap-4 flex-wrap">
                      {product.images.slice(1).map((image, idx) => (
                        <div
                          key={image.id || idx}
                          className="w-[142px] h-[108px] relative overflow-hidden"
                        >
                          <img
                            src={image.url}
                            alt={`${product.name} ${idx + 2}`}
                            className="w-full h-full object-cover rounded-[6px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[298px] w-full px-6 flex flex-row justify-center items-center border border-dashed border-[#D0D5DD] rounded-[12px] bg-white">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-[#F0F2F5] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CloudArrowUpIcon className="text-[#475367]" size={32} />
                    </div>
                    <span className="text-[#9A9A9A] font-light">No images available</span>
                  </div>
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
                      value={product.name}
                      readOnly
                      className="h-14 w-full border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none bg-gray-50"
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
            </div>
          </section>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
