import {
  CaretRightIcon,
  CloudArrowUpIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useUpdateProduct,
  useProduct,
} from "../../../hooks/admin-inventory.hooks";
import { useNavigate, useParams } from "react-router-dom";
// import { TableButton } from "../../ui/button";
import { Switch } from "../../ui/switch";
// import { CaretDownIcon } from "@phosphor-icons/react";
import {
  Select,
  SelectLabel,
  SelectGroup,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../../ui/select";
import Spinner from "../../../shared-components/spinner";
import { SkinToneSelectField } from "./skin-tone-selection-field";
import { GenderRadio } from "./gender-radio";

/* -------------------------------------------------------------------------------- */

const skinTone = ["Porcelin", "Ivory", "Sand", "Espresso", "Chestnut", "Honey"];
//const categories = ["dress", "fabric"];
//const discountTypes = ["percentage", "fixed"];

interface ProductFormData {
  name: string;
  audience: "men" | "women" | "kids";
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

interface ImageState {
  id: string;
  url: string;
  isExisting: boolean;
  file?: File;
}

export function AdminDashboardEditInventory() {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const navigate = useNavigate();
  const updateProductMutation = useUpdateProduct();
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useProduct(inventoryId || "");

  const [images, setImages] = useState<ImageState[]>([]);
  const [discountsEnabled, setDiscountsEnabled] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    mode: "all",
    defaultValues: {
      category: "dress",
      discountType: "percentage",
    },
  });

  console.log(errors);

  const watchCategory = watch("category");

  // Load product data when it's fetched
  useEffect(() => {
    if (product) {
      // Set form values
      reset({
        name: product.name,
        category: product.category,
        audience: product.audience,
        description: product.description || "",
        materialType: product.materialType || "",
        dressSize: product.dressSize || "",
        weight: product.weight || 0,
        thickness: product.thickness || "",
        quantityInStock: product.quantityInStock || 0,
        price: product.price || 0,
        discountType:
          (product.discountType as "percentage" | "fixed") || "percentage",
        discountValue: product.discountValue || 0,
        discountStart: product.discountStart?.split("T")[0] || "",
        discountEnd: product.discountEnd?.split("T")[0] || "",
      });

      // Set other state
      setSelectedTone(product.skinToneRecommendation || []);
      setDiscountsEnabled(!!product.discountType);

      // Set existing images
      setImages(
        product.images.map((img, index) => ({
          id: img.id || `existing-${index}`,
          url: img.url,
          isExisting: true,
        }))
      );
    }
  }, [product, reset]);

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newImages: ImageState[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      isExisting: false,
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDeleteImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // const toggleTone = (tone: string) => {
  //   setSelectedTone((prev) =>
  //     prev.includes(tone) ? prev.filter((s) => s !== tone) : [...prev, tone]
  //   );
  // };

  // const removeTone = (tone: string) => {
  //   setSelectedTone((prev) => prev.filter((s) => s !== tone));
  // };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (!inventoryId) return;

    try {
      // Only include new files in the update
      const newFiles = images
        .filter((img) => !img.isExisting && img.file)
        .map((img) => img.file!);

      await updateProductMutation.mutateAsync({
        productId: inventoryId,
        data: {
          audience: data.audience,
          files: newFiles.length > 0 ? newFiles : undefined,
          name: data.name,
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
          skinToneRecommendation: selectedTone,
        },
      });

      // Navigate back to inventory on success
      navigate("/admin-dashboard/inventory");
    } catch (error) {
      console.error("Failed to update product:", error);
    }
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
        <div className="flex flex-col gap-2 relative">
          <TopBar
            title={title}
            breadCrumb={<BreadCrumb />}
            rightSide={
              <>
                <NotificationBell />
                <Button
                  text={
                    updateProductMutation.isPending ? "Updating..." : "Update"
                  }
                  variant="solid"
                  disabled={updateProductMutation.isPending}
                  onClick={handleSubmit(onSubmit)}
                  className="text-white shadow-sm w-44"
                />
              </>
            }
          />
        </div>

        <div className="w-full flex flex-col p-4 mt-20 overflow-y-scroll px-10">
          <div>
            <h2 className="font-semibold text-[28px]">
              Edit {product.category === "dress" ? "Dress" : "Fabric"}
            </h2>
            <span className="capitalize text-[#5D5D5D] font-light cursor-pointer text-sm font-inter">
              Edit and update your stunning {product.category} here.
            </span>
          </div>

          <section className="flex justify-between gap-10 mt-8">
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
                <label
                  htmlFor="file-upload"
                  className="text-base font-sans mb-2 text-center w-full cursor-pointer"
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
              </div>

              {/* Image Previews - Show both existing and new images */}
              {images.length > 0 && (
                <div className="flex gap-4 flex-wrap mt-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="w-[142px] h-[108px] relative overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt="Product image"
                        className="w-full h-full object-cover rounded-[6px]"
                      />
                      {/* Existing image indicator */}
                      {image.isExisting && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Existing
                        </div>
                      )}
                      {/* Trash Icon */}
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute bottom-2 right-2 rounded-full p-1"
                        title="Delete icon"
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
                  <GenderRadio
                    fieldId="for-men"
                    fieldValue="men"
                    fieldLabel="For Men"
                    registerField={register}
                    fieldWatch={watch}
                  />
                  <GenderRadio
                    fieldId="for-women"
                    fieldValue="women"
                    fieldLabel="For Women"
                    registerField={register}
                    fieldWatch={watch}
                  />
                  <GenderRadio
                    fieldId="for-kids"
                    fieldValue="kids"
                    fieldLabel="For Kids"
                    registerField={register}
                    fieldWatch={watch}
                  />
                </div>
              </div>

              {/* General Information */}
              <div className="bg-white rounded-[6px] py-6 px-4">
                <h4 className="font-semibold">General Information</h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
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
                    <Select {...register("category")}>
                      <label
                        htmlFor="name"
                        className="block text-[#4F4F4F] font-light text-sm"
                      >
                        Category
                      </label>
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
                  </div>
                </div>
                <div className="w-full mt-4">
                  <label
                    htmlFor="description"
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

              {/* Product Information */}
              <div className="bg-white rounded-[6px] py-6 px-4 mt-4">
                <h4 className="font-semibold">
                  {watchCategory === "dress" ? "Dress" : "Fabric"} Information
                </h4>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
                    <label
                      htmlFor="materialType"
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
                    <Select>
                      <label
                        htmlFor="dressSize"
                        className="block text-[#4F4F4F] font-light text-sm"
                      >
                        General {watchCategory === "dress" ? "Dress" : "Fabric"}{" "}
                        Size
                      </label>
                      <SelectTrigger className="w-full h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent {...register("dressSize")}>
                        <SelectGroup>
                          <SelectLabel>Sizes</SelectLabel>
                          {[6, 8, 10, 12, 14, 16, 18, 20].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
                    <label
                      htmlFor="weight"
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
                      htmlFor="thickness"
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

              {/* Skin Tone Recommendation */}
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
                  <div className="w-[303px]">
                    <label
                      htmlFor="quantityInStock"
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
                      htmlFor="price"
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
                    <Switch
                      checked={discountsEnabled}
                      onCheckedChange={setDiscountsEnabled}
                    />
                  </div>
                </div>

                <div className="flex gap-4 items-center mt-4">
                  <div className="w-[303px]">
                    <Select disabled={!discountsEnabled}>
                      <label
                        htmlFor="discountType"
                        className="block text-[#4F4F4F] font-light text-sm"
                      >
                        Discount Type
                      </label>
                      <SelectTrigger className="w-full h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent {...register("discountType")}>
                        <SelectGroup>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                      {...register("discountValue")}
                      disabled={!discountsEnabled}
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
