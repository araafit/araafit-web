import {
  CaretRightIcon,
  CloudArrowUpIcon,
  PlusIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useState, useEffect, useMemo } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "../../../hooks/admin-inventory.hooks";
import type { CreateProductRequest } from "../../../services/admin-inventory.service";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import Spinner from "../../../shared-components/spinner";
import showToast from "../../../utils/notification";
import { notificationStyles } from "../../../style/custom";
// import { TableButton } from "../../ui/button";
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
import NotificationBell from "../admin-components/top-bar/notification";
import TopBar from "../admin-components/top-bar/top-bar";
import { SkinToneSelectField } from "./skin-tone-selection-field";
import { GenderRadio } from "./gender-radio";
import { useChartsByGender, useSkinTonesList } from "../../../hooks/admin-settings.hooks";

/* ---------------------------------------------------------------------------------------------------- */

type Audience = "men" | "women" | "kids";
type SizeChartGender = "male" | "female";
//const categories = ["dress", "fabric"];
//const discountTypes = ["percentage", "fixed"];

interface ProductFormData {
  category: "dress" | "fabric";
  audience: Audience[];
  name: string;
  description: string;
  materialType: string;
  // Dress-specific fields
  price: number;
  // Fabric-specific fields
  pricePerYard: number;
  patternType: string;
  totalSize: string;
  // Shared fields
  weight: number;
  thickness: string;
  skinTone: string[];
  quantityInStock: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountStart: string;
  discountEnd: string;
  sizeChartEntryIds: string[];
}

export function AdminDashboardUploadInventory() {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const [contributorPhotos, setContributorPhotos] = useState<File[]>([]);
  const [isUploadingImage] = useState(false);
  const [discountsEnabled, setDiscountsEnabled] = useState(false);
  const [sizeChartGender, setSizeChartGender] =
    useState<SizeChartGender>("female");
  const [selectedChartIds, setSelectedChartIds] = useState<string[]>([]);
  const [selectedSizeEntryIds, setSelectedSizeEntryIds] = useState<string[]>(
    []
  );

  const chartsList = useChartsByGender(sizeChartGender);
  const skinTonesQuery = useSkinTonesList();
  const skinToneOptions = skinTonesQuery.data ?? [];

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ProductFormData>({
    mode: "all",
    defaultValues: {
      category: "dress",
      discountType: "percentage",
      audience: [],
      sizeChartEntryIds: [],
    },
  });

  const category = watch("category");
  const audience = watch("audience");
  const name = watch("name");
  const price = watch("price");
  const pricePerYard = watch("pricePerYard");
  const patternType = watch("patternType");
  const totalSize = watch("totalSize");
  
  // Re-validate when category changes
  useEffect(() => {
    if (category === "dress") {
      trigger(["price"]);
    } else if (category === "fabric") {
      trigger(["pricePerYard", "patternType", "totalSize"]);
    }
  }, [category, trigger]);
  
  // Validate form based on category using useMemo
  const formIsValid = useMemo(() => {
    // Basic required fields
    const hasName = name?.trim().length >= 2;
    const hasAudience = audience && audience.length > 0;
    const hasFiles = contributorPhotos.length > 0;
    
    if (!hasName || !hasAudience || !hasFiles) {
      return false;
    }
    
    // Category-specific validation
    if (category === "dress") {
      const hasPrice = price !== undefined && price !== null && price > 0;
      const hasSizeEntries = selectedSizeEntryIds.length > 0;
      return hasPrice && hasSizeEntries;
    } else if (category === "fabric") {
      const hasPricePerYard = pricePerYard !== undefined && pricePerYard !== null && pricePerYard > 0;
      const hasPatternType = patternType?.trim().length > 0;
      const hasTotalSize = totalSize?.trim().length > 0;
      return hasPricePerYard && hasPatternType && hasTotalSize;
    }
    
    return false;
  }, [name, audience, contributorPhotos.length, category, price, pricePerYard, patternType, totalSize, selectedSizeEntryIds.length]);

  const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const maxFiles = 10;
    const maxFileSize = 5 * 1024 * 1024; // 5MB per file
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

    // Check total file limit
    const currentCount = contributorPhotos.length;
    const availableSlots = maxFiles - currentCount;

    if (availableSlots <= 0) {
      showToast.error(`Maximum ${maxFiles} images allowed`, {
        icon: null,
        style: notificationStyles.alertError,
      });
      e.target.value = "";
      return;
    }

    // Take only the files that fit within the limit
    const filesToProcess = files.slice(0, availableSlots);

    // Validate file types and sizes
    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    filesToProcess.forEach((file) => {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= maxFileSize;

      if (!isValidType) {
        rejectedFiles.push(`${file.name} (invalid file type)`);
        return;
      }

      if (!isValidSize) {
        rejectedFiles.push(
          `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB - max 5MB)`
        );
        return;
      }

      validFiles.push(file);
    });

    // Show warnings for rejected files
    if (rejectedFiles.length > 0) {
      showToast.error(
        `${rejectedFiles.length} file(s) rejected: ${rejectedFiles.join(", ")}`,
        {
          icon: null,
          style: notificationStyles.alertError,
          duration: 5000,
        }
      );
    }

    // Warn if trying to add more files than available slots
    if (files.length > availableSlots) {
      showToast.error(
        `Only ${availableSlots} file(s) can be added (limit: ${maxFiles} total)`,
        {
          icon: null,
          style: notificationStyles.alertError,
        }
      );
    }

    if (validFiles.length > 0) {
      setContributorPhotos((prev) => [...prev, ...validFiles]);
    }

    // Reset input value to allow re-uploading the same file if needed
    e.target.value = "";
  };

  const handleDeleteImage = (index: number) => {
    setContributorPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleSizeEntry = (entryId: string) => {
    setSelectedSizeEntryIds((prev) => {
      const exists = prev.includes(entryId);
      const next = exists ? prev.filter((id) => id !== entryId) : [...prev, entryId];
      setValue("sizeChartEntryIds", next, { shouldDirty: true });
      return next;
    });
  };

  const handleToggleChart = (chartId: string) => {
    setSelectedChartIds((prev) => {
      const exists = prev.includes(chartId);
      const next = exists ? prev.filter((id) => id !== chartId) : [...prev, chartId];
      
      // When unselecting a chart, remove its entries from selection
      if (exists) {
        const chart = chartsList.data?.find((c) => c.id === chartId);
        if (chart?.entries) {
          const entryIdsToRemove = chart.entries.map((e) => e.id);
          setSelectedSizeEntryIds((current) => {
            const filtered = current.filter((id) => !entryIdsToRemove.includes(id));
            setValue("sizeChartEntryIds", filtered, { shouldDirty: true });
            return filtered;
          });
        }
      }
      
      return next;
    });
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    const payload: CreateProductRequest = {
      files: contributorPhotos,
      name: data.name,
      audience: data.audience,
      category: data.category,
      description: data.description,
      materialType: data.materialType,
      weight: data.weight,
      thickness: data.thickness,
      quantityInStock: data.quantityInStock,
      discountType: discountsEnabled ? data.discountType : undefined,
      discountValue: discountsEnabled ? data.discountValue : undefined,
      discountStart: discountsEnabled ? data.discountStart : undefined,
      discountEnd: discountsEnabled ? data.discountEnd : undefined,
      skinToneRecommendation: data.skinTone,
      sizeChartEntryIds: data.sizeChartEntryIds ?? [],
    };

    // Add category-specific fields
    if (data.category === "dress") {
      if (data.price) payload.price = data.price;
    } else if (data.category === "fabric") {
      if (data.pricePerYard) payload.pricePerYard = data.pricePerYard;
      if (data.patternType) payload.patternType = data.patternType;
      if (data.totalSize) payload.totalSize = data.totalSize;
    }

    try {
      await createProductMutation.mutateAsync(payload);

      // Navigate back to inventory on success
      navigate("/admin-dashboard/inventory");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const BreadCrumb = () => {
    const categoryValue = watch("category");
    return (
      <div className="font-inter font-light capitalize flex items-center">
        <span className="text-primary-900">Araafit</span>
        <CaretRightIcon className="text-primary-900" />
        <span className="text-primary-900">Inventory</span>
        <CaretRightIcon className="text-[#979797]" />
        <span className="text-[#979797]">{categoryValue || "Dress"}</span>
      </div>
    );
  };

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
                  disabled={createProductMutation.isPending || !formIsValid}
                  onClick={handleSubmit(onSubmit)}
                  className={`text-white shadow-sm ${
                    !formIsValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
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
            <h2 className="font-semibold text-[28px]">
              {category === "fabric" ? "Upload Fabric" : "Upload a Dress"}
            </h2>
            <span className="capitalize text-[#5D5D5D] font-light cursor-pointer text-sm font-inter">
              {category === "fabric"
                ? "Upload fabrics for sewing requests. Customers will use these for custom tailoring."
                : "Upload dresses your clients will love to explore and choose from."}
            </span>
          </div>

          <section className="flex justify-between gap-10 mt-8">
            {" "}
            <div className="w-full max-w-[448px] relative">
              {/* Upload Box */}
              <div className="mb-2">
                <label className="block text-[#4F4F4F] font-light text-sm mb-2">
                  Product Images <span className="text-red-500">*</span>
                </label>
              </div>
              <div className={`h-[298px] w-full px-6 flex flex-row justify-center items-center border border-dashed rounded-[12px] bg-white ${
                contributorPhotos.length === 0 ? "border-red-300" : "border-[#D0D5DD]"
              }`}>
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
                      PNG, JPG, JPEG (max 5MB per file, up to 10 files)
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
              {contributorPhotos.length === 0 && (
                <p className="text-red-500 text-xs mt-1">
                  At least one product image is required
                </p>
              )}

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
                        title="Trash icon"
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
              {/* General Information */}
              <div className="bg-white rounded-[6px] py-6 px-4 mb-4">
                <h4 className="font-semibold mb-4">General Information</h4>
                
                {/* Category Selection */}
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-[#4F4F4F] font-light text-sm mb-2"
                  >
                    Inventory Type
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
                          <SelectValue placeholder="Select inventory type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Inventory Types</SelectLabel>
                            <SelectItem value="fabric">Fabric</SelectItem>
                            <SelectItem value="dress">Dress</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Audience Selection */}
                <div className="mb-4">
                  <label className="block text-[#4F4F4F] font-light text-sm mb-2">
                    Audience <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-12">
                    <GenderRadio
                      fieldId="for-men"
                      fieldValue="men"
                      fieldLabel="Men"
                      registerField={register}
                      fieldWatch={watch}
                    />
                    <GenderRadio
                      fieldId="for-women"
                      fieldValue="women"
                      fieldLabel="Women"
                      registerField={register}
                      fieldWatch={watch}
                    />
                    <GenderRadio
                      fieldId="for-kids"
                      fieldValue="kids"
                      fieldLabel="Kids"
                      registerField={register}
                      fieldWatch={watch}
                    />
                  </div>
                  {(!audience || audience.length === 0) && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select at least one audience
                    </p>
                  )}
                </div>

                {/* Product Name */}
                <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-[#4F4F4F] font-light text-sm mb-2"
                    >
                      Product Name <span className="text-red-500">*</span>
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

                {/* Product Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-[#4F4F4F] font-light text-sm mb-2"
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

              {/* Material Information */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <h4 className="font-semibold">Material Information</h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
                    <label
                      htmlFor="materialType"
                      className="block text-[#4F4F4F] font-light text-sm mb-2"
                    >
                      Material Type
                    </label>
                    <input
                      {...register("materialType")}
                      type="text"
                      placeholder="e.g., Cotton, Silk, Linen"
                      className="h-14 w-full border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="weight"
                      className="block text-[#4F4F4F] font-light text-sm mb-2"
                    >
                      Weight (gsm)
                    </label>
                    <input
                      type="number"
                      {...register("weight", { valueAsNumber: true })}
                      placeholder="Enter weight"
                      className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
                    <label
                      htmlFor="thickness"
                      className="block text-[#4F4F4F] font-light text-sm mb-2"
                    >
                      Thickness (mm)
                    </label>
                    <input
                      type="number"
                      {...register("thickness")}
                      placeholder="Enter thickness"
                      className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fabric-specific Information */}
              {category === "fabric" && (
                <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                  <h4 className="font-semibold">Fabric Information</h4>
                  <div className="flex gap-4 items-center mt-4">
                    <div className="w-[303px]">
                      <label
                        htmlFor="patternType"
                        className="block text-[#4F4F4F] font-light text-sm mb-2"
                      >
                        Pattern Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("patternType", {
                          required: category === "fabric" ? "Pattern type is required" : false,
                          validate: (value) => {
                            if (category === "fabric" && (!value || value.trim().length === 0)) {
                              return "Pattern type is required";
                            }
                            return true;
                          },
                        })}
                        type="text"
                        placeholder="e.g., Solid, Striped, Floral"
                        className={`h-14 w-full border pl-2 rounded-lg outline-none focus:outline-none ${
                          errors.patternType ? "border-red-300" : "border-[#D0D5DD]"
                        }`}
                      />
                      {errors.patternType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.patternType.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="totalSize"
                        className="block text-[#4F4F4F] font-light text-sm mb-2"
                      >
                        Total Size <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("totalSize", {
                          required: category === "fabric" ? "Total size is required" : false,
                          validate: (value) => {
                            if (category === "fabric" && (!value || value.trim().length === 0)) {
                              return "Total size is required";
                            }
                            return true;
                          },
                        })}
                        type="text"
                        placeholder="e.g., 5 yards, 10 meters"
                        className={`h-14 w-full border pl-2 rounded-lg outline-none focus:outline-none ${
                          errors.totalSize ? "border-red-300" : "border-[#D0D5DD]"
                        }`}
                      />
                      {errors.totalSize && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.totalSize.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Skin Tone Recommendation */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <h4 className="font-semibold">Skin Tone Recommendation</h4>
                <p className="text-xs text-[#676767] mt-1 mb-4">
                  Select skin tones that complement this {category === "fabric" ? "fabric" : "dress"}.
                </p>
                <div className="flex gap-4 items-center">
                  <div className="w-full">
                    <SkinToneSelectField
                      name="skinTone"
                      label="Skin Tone"
                      options={skinToneOptions}
                      control={control}
                    />
                  </div>
                </div>
              </div>

              {/* Size Chart Entries - Only for Dresses */}
              {category === "dress" && (
                <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                  <h4 className="font-semibold">Size Chart Entries <span className="text-red-500">*</span></h4>
                  <p className="text-xs text-[#676767] mt-1">
                    Select multiple size charts and their entries that this dress supports.
                  </p>
                  {selectedSizeEntryIds.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">
                      At least one size chart entry is required
                    </p>
                  )}

                  <div className="flex gap-4 items-center mt-4">
                    <div className="w-[180px]">
                      <label className="block text-[#4F4F4F] font-light text-sm">
                        Gender
                      </label>
                      <Select
                        value={sizeChartGender}
                        onValueChange={(value) => {
                          setSizeChartGender(value as SizeChartGender);
                          // Clear selections when gender changes
                          setSelectedChartIds([]);
                          setSelectedSizeEntryIds([]);
                          setValue("sizeChartEntryIds", [], { shouldDirty: true });
                        }}
                      >
                        <SelectTrigger className="w-full h-12 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Gender</SelectLabel>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Size Charts Selection */}
                  <div className="mt-4">
                    <label className="block text-[#4F4F4F] font-light text-sm mb-2">
                      Size Charts
                    </label>
                    {chartsList.isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Spinner size="sm" speed="fast" />
                      </div>
                    ) : chartsList.data && chartsList.data.length > 0 ? (
                      <div className="border border-[#F0F2F5] rounded-lg p-3 max-h-32 overflow-y-auto">
                        <div className="flex flex-col gap-2">
                          {chartsList.data.map((chart) => {
                            const isSelected = selectedChartIds.includes(chart.id);
                            return (
                              <label
                                key={chart.id}
                                className="flex items-center gap-2 cursor-pointer text-sm text-[#1C1C1C]"
                              >
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={isSelected}
                                  onChange={() => handleToggleChart(chart.id)}
                                />
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    isSelected
                                      ? "border-[#9A6C50] bg-[#9A6C50]"
                                      : "border-[#D0D5DD] bg-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="w-2 h-2 rounded-sm bg-white" />
                                  )}
                                </div>
                                <span>{chart.name}</span>
                                <span className="text-xs text-[#676767] ml-auto">
                                  ({chart.entries?.length ?? 0} entries)
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#676767]">
                        No charts available for this gender.
                      </p>
                    )}
                  </div>

                  {/* Entries from Selected Charts */}
                  {selectedChartIds.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-[#4F4F4F] font-light text-sm mb-2">
                        Chart Entries
                      </label>
                      <div className="max-h-56 overflow-y-auto border border-[#F0F2F5] rounded-lg p-3">
                        {(() => {
                          const selectedCharts = chartsList.data?.filter((c) =>
                            selectedChartIds.includes(c.id)
                          );
                          const allEntries = selectedCharts?.flatMap((chart) =>
                            (chart.entries || []).map((entry) => ({
                              ...entry,
                              chartName: chart.name,
                            }))
                          ) || [];

                          if (allEntries.length === 0) {
                            return (
                              <p className="text-xs text-[#676767]">
                                No entries available in selected charts.
                              </p>
                            );
                          }

                          return (
                            <div className="flex flex-col gap-4">
                              {selectedCharts?.map((chart) => {
                                if (!chart.entries || chart.entries.length === 0) {
                                  return null;
                                }
                                return (
                                  <div key={chart.id} className="space-y-2">
                                    <div className="text-xs font-medium text-[#676767] border-b border-[#F0F2F5] pb-1">
                                      {chart.name}
                                    </div>
                                    {chart.entries.map((entry) => {
                                      const checked = selectedSizeEntryIds.includes(entry.id);
                                      return (
                                        <label
                                          key={entry.id}
                                          className="flex items-center gap-2 cursor-pointer text-sm text-[#1C1C1C] ml-2"
                                        >
                                          <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={checked}
                                            onChange={() => handleToggleSizeEntry(entry.id)}
                                          />
                                          <div
                                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                                              checked
                                                ? "border-[#9A6C50] bg-[#9A6C50]"
                                                : "border-[#D0D5DD] bg-white"
                                            }`}
                                          >
                                            {checked && (
                                              <span className="w-2 h-2 rounded-sm bg-white" />
                                            )}
                                          </div>
                                          <span>{entry.label}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity/Price */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <h4 className="font-semibold">Quantity & Pricing</h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
                    <label
                      htmlFor="quantityInStock"
                      className="block text-[#4F4F4F] font-light text-sm mb-2"
                    >
                      Quantity Available
                    </label>
                    <input
                      type="number"
                      {...register("quantityInStock", { valueAsNumber: true })}
                      placeholder="Enter quantity"
                      className="h-14 w-full font-light border border-[#D0D5DD] pl-2 rounded-lg outline-none focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    {category === "dress" ? (
                      <>
                        <label
                          htmlFor="price"
                          className="block text-[#4F4F4F] font-light text-sm mb-2"
                        >
                          Price (₦) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          {...register("price", {
                            required: category === "dress" ? "Price is required" : false,
                            valueAsNumber: true,
                            min: {
                              value: 0.01,
                              message: "Price must be greater than 0",
                            },
                            validate: (value) => {
                              if (category === "dress" && (value === undefined || value === null || value <= 0)) {
                                return "Price is required and must be greater than 0";
                              }
                              return true;
                            },
                          })}
                          placeholder="Enter price"
                          className={`h-14 w-full font-light border pl-2 rounded-lg outline-none focus:outline-none ${
                            errors.price ? "border-red-300" : "border-[#D0D5DD]"
                          }`}
                        />
                        {errors.price && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.price.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <label
                          htmlFor="pricePerYard"
                          className="block text-[#4F4F4F] font-light text-sm mb-2"
                        >
                          Price Per Yard (₦) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          {...register("pricePerYard", {
                            required: category === "fabric" ? "Price per yard is required" : false,
                            valueAsNumber: true,
                            min: {
                              value: 0.01,
                              message: "Price per yard must be greater than 0",
                            },
                            validate: (value) => {
                              if (category === "fabric" && (value === undefined || value === null || value <= 0)) {
                                return "Price per yard is required and must be greater than 0";
                              }
                              return true;
                            },
                          })}
                          placeholder="Enter price per yard"
                          className={`h-14 w-full font-light border pl-2 rounded-lg outline-none focus:outline-none ${
                            errors.pricePerYard ? "border-red-300" : "border-[#D0D5DD]"
                          }`}
                        />
                        {errors.pricePerYard && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.pricePerYard.message}
                          </p>
                        )}
                      </>
                    )}
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
                      type="number"
                      {...register("discountValue", { valueAsNumber: true })}
                      disabled={!discountsEnabled}
                      placeholder={watch("discountType") === "percentage" ? "Enter percentage" : "Enter amount"}
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
                      {...register("discountStart")}
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
                      {...register("discountEnd")}
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
