import {
  CaretDownIcon,
  CaretRightIcon,
  CloudArrowUpIcon,
  PlusIcon,
  TrashSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  Controller,
  useForm,
  type Control,
  type SubmitHandler,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "../../../hooks/admin-inventory.hooks";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import Spinner from "../../../shared-components/spinner";
import { TableButton } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Switch } from "../../ui/switch";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import TopBar from "../admin-components/top-bar/top-bar";

/* -------------------------------------------------------------------------------------------------- */

const skinTone = ["porcelin", "ivory", "sand", "espresso", "chestnut", "honey"];
//const categories = ["dress", "fabric"];
//const discountTypes = ["percentage", "fixed"];

interface ProductFormData {
  gender: "men" | "women" | "kids";
  name: string;
  category: "dress" | "fabric";
  description: string;
  materialType: string;
  dressSize: string;
  weight: number;
  thickness: string;
  skinTone: string[];
  quantityInStock: number;
  price: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountStart: string;
  discountEnd: string;
}

export function AdminDashboardUploadInventory() {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const [contributorPhotos, setContributorPhotos] = useState<File[]>([]);
  const [isUploadingImage] = useState(false);
  const [discountsEnabled, setDiscountsEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    mode: "all",
    defaultValues: {
      category: "dress",
      discountType: "percentage",
      gender:"men"
    },
  });

  const selectedGender = watch("gender"); // Watch value to style the checked state

  const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setContributorPhotos((prev) => [...prev, ...files]);
  };

  const handleDeleteImage = (index: number) => {
    setContributorPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    const payload = {
      files: contributorPhotos,
      name: data.name,
      ageGroup: data.gender,
      category: data.category,
      description: data.description,
      materialType: data.materialType,
      dressSize: data.dressSize,
      weight: data.weight,
      thickness: data.thickness,
      quantityInStock: data.quantityInStock,
      price: data.price,
      discountType: discountsEnabled ? data.discountType : undefined,
      discountValue: discountsEnabled ? data.discountValue : undefined,
      discountStart: discountsEnabled ? data.discountStart : undefined,
      discountEnd: discountsEnabled ? data.discountEnd : undefined,
      skinToneRecommendation: data.skinTone,
    };

    try {
      await createProductMutation.mutateAsync(payload);

      // Navigate back to inventory on success
      navigate("/admin-dashboard/inventory");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-primary-900" />
      <span className="text-primary-900">Inventory</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Dress</span>
    </div>
  );

  const SkinToneSelectField: React.FC<{
    name: "skinTone";
    label: string;
    options: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<ProductFormData, any, ProductFormData>;
  }> = ({ name, label, options, control }) => (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <DropdownMenu>
          <label
            htmlFor="name"
            className="block text-[#4F4F4F] font-light  text-sm"
          >
            {label}
          </label>

          {/* Tags outside to prevent event bubbling */}
          <div className="flex flex-wrap gap-2 mb-2">
            {field.value.length > 0 &&
              field.value.map((tone) => (
                <span
                  key={tone}
                  className="flex items-center gap-1 border border-[#E7E7E7] p-2 rounded-[4px] text-sm capitalize"
                >
                  {tone}
                  <XIcon
                    size={16}
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      field.onChange(field.value.filter((t) => t !== tone));
                    }}
                  />
                </span>
              ))}
          </div>

          <DropdownMenuTrigger asChild>
            <TableButton
              variant="outline"
              size="sm"
              className="w-full min-h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3"
            >
              <span className="text-[#9A9A9A] font-light">
                {field.value.length > 0
                  ? `${field.value.length} selected`
                  : "Skin Tone"}
              </span>

              <CaretDownIcon className="text-[#676767] ml-auto" size={20} />
            </TableButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52 flex flex-col items-start gap-2 p-3">
            {options.map((tone) => (
              <DropdownMenuItem
                key={tone}
                onClick={() => {
                  // Toggle tone in array
                  const currentValues = field.value || [];
                  const newValues = currentValues.includes(tone)
                    ? currentValues.filter((t) => t !== tone)
                    : [...currentValues, tone];
                  field.onChange(newValues);
                }}
                className={`cursor-pointer w-full px-2 py-1 rounded-md capitalize ${
                  field.value?.includes(tone) ? "bg-[#9A6C50] text-white" : ""
                }`}
              >
                {tone}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );

  return (
    <AdminDashboardLayout>
      <div className="h-screen">
        <div className="flex flex-col gap-2  relative">
          <TopBar
            title={
              <div className="font-lora font-medium text-[#1C1C1C]">
                Inventory
              </div>
            }
            breadCrumb={<BreadCrumb />}
            rightSide={
              <>
                <NotificationBell />

                <Button
                  icon={<PlusIcon className="size-[1.25rem] text-white" />}
                  variant="solid"
                  disabled={createProductMutation.isPending}
                  onClick={handleSubmit(onSubmit)}
                  className="text-white shadow-sm"
                >
                  <div className="w-full flex items-center justify-center gap-2">
                    <span>Add</span>
                    <Spinner
                      size="sm"
                      speed="fast"
                      arcColor="#ffff"
                      isLoading={createProductMutation.isPending}
                    />
                  </div>
                </Button>
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
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
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
                        src={URL.createObjectURL(photo)}
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
            {/* ----- Inventory fields ----- */}
            <div className="flex-1 max-w-[654px]">
              {/* Gender selection */}
              <div className="w-full bg-white rounded-[6px] py-6 px-4 mb-4">
                <h2 className="mb-4 text-[1.4rem] font-semibold">
                  Who Is This For?
                </h2>

                <div className="flex items-center gap-12">
                  <label
                    htmlFor="for-men"
                    className="cursor-pointer flex items-center"
                  >
                    <input
                      type="radio"
                      id="for-men"
                      className="hidden"
                      value="men"
                      {...register("gender")}
                    />
                    <div
                      className={`border rounded-full p-1 flex items-center justify-center ${
                        selectedGender === "men"
                          ? "border-primary-500"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedGender === "men"
                            ? "bg-primary-500"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-sm">For Men</span>
                  </label>

                  <label
                    htmlFor="for-women"
                    className="cursor-pointer flex items-center"
                  >
                    <input
                      type="radio"
                      id="for-women"
                      className="hidden"
                      value="female"
                      {...register("gender")}
                    />
                    <div
                      className={`border rounded-full p-1 flex items-center justify-center ${
                        selectedGender === "women"
                          ? "border-primary-500"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedGender === "women"
                            ? "bg-primary-500"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-sm">For Women</span>
                  </label>

                  <label
                    htmlFor="for-kids"
                    className="cursor-pointer flex items-center"
                  >
                    <input
                      type="radio"
                      id="for-kids"
                      className="hidden"
                      value="kids"
                      {...register("gender")}
                    />
                    <div
                      className={`border rounded-full p-1 flex items-center justify-center ${
                        selectedGender === "kids"
                          ? "border-primary-500"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedGender === "kids"
                            ? "bg-primary-500"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-sm">For Kids</span>
                  </label>
                </div>
              </div>

              {/* General Information */}
              <div className="bg-white rounded-[6px] py-6 px-4">
                <h4 className="font-semibold">General Information</h4>
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-[303px] ">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Product Name
                    </label>
                    <input
                      {...register("name", {
                        required: "Product name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      type="text"
                      className="h-14 w-full border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="category"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Category
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              <SelectItem value="fabric">Fabric</SelectItem>
                              <SelectItem value="dress">Dress</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
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
                    {...register("description")}
                    placeholder="Enter product description"
                    className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                  />
                </div>
              </div>

              {/* Dress Information */}
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
                      {...register("materialType")}
                      type="text"
                      placeholder="Enter material type"
                      className="h-14 w-full border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      General Dress Size
                    </label>
                    <Controller
                      name="dressSize"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3">
                            <SelectValue placeholder="Select a dress size" />
                          </SelectTrigger>
                          <SelectContent {...register("dressSize")}>
                            <SelectGroup>
                              <SelectLabel>Dress Sizes</SelectLabel>
                              {[6, 8, 10, 12, 14, 16, 18, 20].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
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
                      type="number"
                      {...register("weight")}
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
                      type="number"
                      {...register("thickness")}
                      className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* skin tone Info */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <h4 className="font-semibold">Skin Tone Recommendation</h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-full ">
                    <SkinToneSelectField
                      name="skinTone"
                      label="Skin Tone"
                      options={skinTone}
                      control={control}
                    />
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
                      type="number"
                      {...register("quantityInStock")}
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
                      type="number"
                      {...register("price")}
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
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm"
                    >
                      Discount Type
                    </label>
                    <Controller
                      name="discountType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          disabled={!discountsEnabled}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="percentage">
                                Percentage
                              </SelectItem>
                              <SelectItem value="fixed">
                                Fixed Amount
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
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
                      title="date"
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
                      title="date"
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

              {/* <div className="w-full flex justify-end">
                <Button
                  icon={<PlusIcon className="size-[1.25rem] text-white" />}
                  variant="solid"
                  disabled={createProductMutation.isPending}
                  onClick={handleSubmit(onSubmit)}
                  className="text-white shadow-sm"
                >
                  <div className="w-full flex items-center justify-center gap-2">
                    <span>Add</span>
                    <Spinner
                      size="sm"
                      speed="fast"
                      arcColor="#ffff"
                      isLoading={createProductMutation.isPending}
                    />
                  </div>
                </Button>
              </div> */}
            </div>
          </section>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
