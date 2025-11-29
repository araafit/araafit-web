import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../hooks/user-dashboard.hooks";
import { FabricRequestStepperLines } from "./fabric-request-stepper";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useFabricRequestStore } from "../../../shared-hooks/state-store";
import { formatPrice } from "../../../utils/format-price";

/* ---------------------------------------------------------------------- */

export function DashboardFabricRequestFlowPage() {
  const params = useParams<{ itemName: string }>();
  const rawParam = params.itemName || "";
  const { data: product } = useProduct(rawParam);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();
  const setSelection = useFabricRequestStore((state) => state.setSelection);

  const crumbLabel =
    (product?.slug || product?.name || rawParam).replaceAll("-", " ");

  // Persist selection in fabric request store for later steps
  useEffect(() => {
    if (!product) return;
    const selectedImage = product.images?.[selectedImageIndex];
    setSelection({
      fabricId: product.id,
      imageIndex: selectedImageIndex,
      imageUrl: selectedImage?.url,
    });
  }, [product, selectedImageIndex, setSelection]);

  return (
    <section className="min-h-screen bg-[#F5F5F5] flex items-start justify-center px-4 py-6 md:px-8">
      <div className="w-full max-w-[72rem] bg-white rounded-md shadow-sm p-4 md:p-6 flex flex-col gap-6">
        {/* Header row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/shop/fabrics")}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeftIcon size={18} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
                Sew with this fabric
              </h1>
              <span className="text-xs md:text-sm text-neutral-500 mt-0.5">
                Step 1 of 4 · Select your preferred fabric colour/variation
              </span>
            </div>
          </div>

          <FabricRequestStepperLines stepIndex={0} />
        </div>

        {!product ? (
          <p className="text-sm text-neutral-500">
            Loading fabric details...
          </p>
        ) : (
          <>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Images */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="rounded-lg overflow-hidden bg-neutral-100 border border-neutral-100">
                <img
                  src={
                    product.images?.[selectedImageIndex]?.url ||
                    product.images?.[0]?.url ||
                    "/placeholder-image.jpg"
                  }
                  alt={crumbLabel}
                  className="w-full h-[18rem] md:h-[24rem] lg:h-[26rem] object-cover"
                />
              </div>

              <div className="w-full flex flex-wrap gap-3">
                {(product.images || []).map((image, idx) => (
                  <button
                    key={image.id ?? idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-[80px] h-[60px] rounded-md overflow-hidden border transition-colors ${
                      selectedImageIndex === idx
                        ? "border-primary-500 ring-2 ring-primary-200"
                        : "border-[#E8E8E8] hover:border-primary-300"
                    }`}
                    title={`Select option ${idx + 1}`}
                  >
                    <img
                      src={image.url}
                      alt={`${crumbLabel} option ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Basic info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg md:text-xl font-semibold text-neutral-900">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-sm text-neutral-600">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-neutral-500">Price per yard</span>
                <span className="text-2xl font-semibold text-neutral-900">
                  ₦{formatPrice(Number(product.price ?? 0))}
                  <span className="ml-1 text-base text-neutral-600">/yd</span>
                </span>
              </div>

              <p className="text-xs md:text-sm text-neutral-500 mt-4">
                Choose the fabric colour/variation that best matches your
                vision. Next, you&apos;ll pick a style and let us tailor it to
                your measurements.
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end pt-4 border-t border-neutral-100 mt-2">
            <button
              type="button"
              className="px-5 py-2.5 rounded-md bg-[#9A6C50] text-white text-sm font-medium hover:bg-[#7B523F] transition-colors"
              onClick={() =>
                navigate(`/dashboard/shop/fabric/${rawParam}/style`)
              }
            >
              Continue
            </button>
          </div>
          </>
        )}
      </div>
    </section>
  );
}


