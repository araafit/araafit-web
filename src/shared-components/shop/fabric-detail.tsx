import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProduct } from "../../hooks/user-dashboard.hooks";
import Button from "../button";
import { WarningIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { formatPrice } from "../../utils/format-price";
import LoaderView from "../../layouts/user-dashboard/loader";
import { useNavigate } from "react-router-dom";
import { useMeasurements } from "../../hooks/measurements.hooks";

// Available fabric sizes (numeric)
const FABRIC_SIZES = [6, 8, 10, 12, 14, 16, 18, 20] as const;

/* --------------------------------------------------------- */

export function FabricDetail() {
  const navigate = useNavigate();

  const { itemName } = useParams<{ itemName: string }>();
  const productId = itemName || "";

  const { data: product, isLoading, isError, error } = useProduct(productId);
  const { data: measurementMe } = useMeasurements();

  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedYards, setSelectedYards] = useState(3);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [noRefundAccepted, setNoRefundAccepted] = useState(false);
  const [autoSelectedSize, setAutoSelectedSize] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Auto-select size from saved measurements if available and matches fabric sizes
  useEffect(() => {
    if (!selectedSize && measurementMe?.measurements) {
      const base = measurementMe.measurements;
      let derivedSize: number | null = null;
      if (typeof base.dressSize === "number" && !Number.isNaN(base.dressSize)) {
        derivedSize = base.dressSize;
      } else if (base.size) {
        const parsed = parseInt(String(base.size), 10);
        if (!Number.isNaN(parsed)) {
          derivedSize = parsed;
        }
      }

      if (derivedSize && (FABRIC_SIZES as readonly number[]).includes(derivedSize)) {
        setSelectedSize(String(derivedSize));
        setAutoSelectedSize(true);
      }
    }
  }, [measurementMe, selectedSize]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <LoaderView />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading fabric</p>
          <p className="text-gray-600">
            {error?.message || "Fabric not found"}
          </p>
        </div>
      </div>
    );
  }

  const dressStyle = [
    "Corset",
    "Peplum top",
    "A-gown",
    "Puffy sleeves",
    "Off-shoulder",
    "Flay dresses",
    "Boubou",
    "Jumpsuits",
    "Long gown",
  ];

  return (
    <div className="w-full max-w-[72rem] flex flex-col gap-4">
      <div className="flex items-start gap-2 bg-[#FFF8EB] rounded-md border border-[#B47409] py-2 px-4">
        <WarningIcon className="text-[#F59E0B]" />

        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2 text-[#F59E0B]">
            <span>Important Notice</span>
          </div>

          <p className="text-[#B47409]">
            Your measurements have been saved securely. You're all set to get
            personalized dress and fabric recommendations!
          </p>

          <Link
            to="/dashboard/profile/get-measured"
            className="flex items-center gap-2 font-light text-[#F59E0B]"
          >
            <p>Enter measurement manually</p>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      <div className="h-auto bg-white rounded-md p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            {/* Item preview with selectable fabric color */}
            <div className="rounded-md flex flex-col gap-4 w-full lg:w-1/2">
              <img
                src={
                  product.images?.[selectedImageIndex]?.url ||
                  product.images?.[0]?.url ||
                  "/placeholder-image.jpg"
                }
                alt={product.name}
                className="w-full rounded-md object-cover h-[33rem]"
              />

              <div className="w-full flex gap-3 flex-wrap">
                {(product.images || []).map((image, idx) => (
                  <button
                    key={image.id ?? idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-[88px] h-[60px] rounded-md overflow-hidden border transition-colors ${
                      selectedImageIndex === idx
                        ? "border-primary-500 ring-2 ring-primary-200"
                        : "border-[#E8E8E8] hover:border-primary-300"
                    }`}
                    title={`Select color ${idx + 1}`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} option ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-neutral-700 font-semibold text-[1.5rem]">
                  {product.name}
                </h3>
                <p className="text-neutral-700 font-light">
                  {product.description}
                </p>
                <span className="font-semibold text-neutral-900 font-lora">
                  ₦{formatPrice(Number(product.price ?? 0))}/yd
                </span>
                <span className="text-sm text-neutral-600">
                  Total: ₦{formatPrice(Number(product.price ?? 0) * selectedYards)} (
                  {selectedYards} yards)
                </span>
              </div>

              {/* Dress size */}
              <div className="flex flex-col gap-3 border-b border-gray-100 pb-3">
                <div>
                  <div className="w-full flex items-center justify-between text-[12px]">
                    <span className="text-neutral-900">Dress size</span>
                    <span className="text-neutral-400">Size Guide</span>
                  </div>
                </div>

                {autoSelectedSize && (
                  <div className="bg-[#FFF8EB] rounded-md p-2">
                    <h5 className="mb-4 font-inter text-[#F59E0B]">
                      We’ve Got Your Size Covered
                    </h5>

                    <p className="w-full text-[#B47409] font-light">
                      No need to choose a size—our AI has already selected the
                      perfect fit for you based on your measurements.
                    </p>
                  </div>
                )}

                <div className="w-full flex items-center justify-between">
                  {(FABRIC_SIZES as readonly number[]).map((item, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center border rounded-md text-sm cursor-pointer transition-colors ${
                        selectedSize === item.toString()
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-[#E8E8E8] text-[#494949]  hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedSize(item.toString())}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Dress style */}
              <div className="w-full flex flex-col gap-3">
                <span className="text-[14px]">Select Dress Style</span>

                <div className="grid grid-cols-3 gap-4">
                  {dressStyle.map((style) => (
                    <div
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`w-[10rem] border py-2 px-3 rounded-md text-center cursor-pointer transition-colors ${
                        selectedStyle === style
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-[#E8E8E8] text-[#494949] hover:border-gray-300"
                      }`}
                    >
                      {style}
                    </div>
                  ))}
                </div>
              </div>

              {/* Yard estimate */}
              <div className="w-full flex flex-col gap-3">
                <span className="text-[14px] text-[#494949]">
                  Yard Estimate (based on measurement & style)
                </span>

                <input
                  type="number"
                  min="1"
                  max="20"
                  value={selectedYards}
                  onChange={(e) => setSelectedYards(Number(e.target.value))}
                  className="h-[75px] w-full p-2 border border-gray-300 rounded outline-none focus:border-primary-500 placeholder:text-[14px]"
                  title="Select number of yards"
                  placeholder="Number of yards based on your measurement and preferred choice of style."
                />

                <p className="text-xs text-gray-500">
                  Estimated based on your measurements and selected style. You
                  can adjust as needed.
                </p>
              </div>
            </div>
          </div>

          {/* TC */}
          <div className="flex items-center justify-center gap-[1.5rem] py-[40px] px-[24px] rounded-md">
            <div className="w-full bg-[#F6F7F9] flex flex-col gap-2 p-3">
              <span className="text-[#667A91] font-semibold">
                No Refund Policy
              </span>

              <p className="text-[#333B47] font-normal">
                Each piece is custom-made using your unique body measurements.
                Because of this personalized process, we are unable to offer
                refunds. Please double-check your entries before placing your
                order.
              </p>

              <div className="w-full flex items-center gap-4 text-[#516278] ">
                <input
                  type="checkbox"
                  name="no-refund-checkbox"
                  className="size-[1rem] border border-[#B9B9B9] rounded focus:outline-none cursor-pointer"
                  title="I understand and accept the no refund policy."
                  onClick={(e) => setNoRefundAccepted(e.currentTarget.checked)}
                />

                <label className="font-medium" htmlFor="terms-and-conditions">
                  I understand and accept the no refund policy.
                </label>
              </div>
            </div>
          </div>

          {/* Proceed */}
          <div className="w-full flex items-center justify-center gap-4">
            <Button
              text="Proceed"
              variant="solid"
              className="w-full max-w-[24rem] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-opacity-50"
              disabled={!noRefundAccepted}
              onClick={() =>
                navigate({
                  pathname: `/shop/${productId}/summary`,
                  search: `?yards=${selectedYards}&style=${
                    selectedStyle || ""
                  }&size=${selectedSize || ""}`,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
