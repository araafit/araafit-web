import { MinusIcon, PlusIcon, InfoIcon } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import {
  useProduct,
  useProductRecommendedSizes,
} from "../../hooks/user-dashboard.hooks";
import { useMeasurements } from "../../hooks/measurements.hooks";
import { useAddToCart } from "../../hooks/cart.hooks";
import { useInstantCheckout } from "../../hooks/orders.hooks";
import Button from "../button";
import { formatPrice } from "../../utils/format-price";
import LoaderView from "../../layouts/user-dashboard/loader";
import showToast from "../../utils/notification";
import { notificationStyles } from "../../style/custom";
import Spinner from "../spinner";

/* ----------------------------------------------------------------- */

export function DressDetail() {
  const { itemName } = useParams<{ itemName: string }>();
  const productId = itemName || "";

  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: measurementsData } = useMeasurements();
  const [selectedMeasurementSetId, setSelectedMeasurementSetId] = useState<
    string | ""
  >("");
  const { data: recommendedSizesData } = useProductRecommendedSizes(
    productId,
    selectedMeasurementSetId || undefined
  );
  const addToCartMutation = useAddToCart();
  const instantCheckoutMutation = useInstantCheckout();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const charts = useMemo(() => {
    if (!product?.availableSizeChartEntries) return [];
    const map = new Map<string, { id: string; name: string; gender: string }>();
    for (const entry of product.availableSizeChartEntries) {
      if (!entry.chart) continue;
      if (!map.has(entry.chart.id)) {
        map.set(entry.chart.id, {
          id: entry.chart.id,
          name: entry.chart.name,
          gender: entry.chart.gender,
        });
      }
    }
    return Array.from(map.values());
  }, [product]);

  const entriesForSelectedChart = useMemo(() => {
    if (!product?.availableSizeChartEntries || !selectedChartId) return [];
    return product.availableSizeChartEntries.filter(
      (e) => e.chart?.id === selectedChartId
    );
  }, [product, selectedChartId]);

  const primaryRecommendation = recommendedSizesData?.recommendedSizes?.[0];

  // Initialize selected chart and size from available entries / recommendations
  useEffect(() => {
    if (!charts.length) return;
    // Prefer chart from primary recommendation
    const recommendedChartId = primaryRecommendation?.chartId;
    const initialChartId =
      (recommendedChartId &&
        charts.find((c) => c.id === recommendedChartId)?.id) ||
      charts[0]?.id;
    setSelectedChartId((prev) => prev ?? initialChartId ?? null);
  }, [charts, primaryRecommendation]);

  useEffect(() => {
    if (!entriesForSelectedChart.length) return;
    // If we have a recommended size within this chart, preselect it
    const recommendedForChart = recommendedSizesData?.recommendedSizes?.find(
      (r) => r.chartId === selectedChartId
    );
    if (recommendedForChart) {
      setSelectedSize((prev) => prev ?? recommendedForChart.label);
      return;
    }
    // Otherwise keep existing selection if still valid
    if (
      selectedSize &&
      entriesForSelectedChart.some((e) => e.label === selectedSize)
    ) {
      return;
    }
    // Fallback to first entry
    setSelectedSize(entriesForSelectedChart[0]?.label ?? null);
  }, [
    entriesForSelectedChart,
    recommendedSizesData,
    selectedChartId,
    selectedSize,
  ]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      showToast.info("Select a size before proceeding to checkout.", {
        icon: null,
        position: "top-center",
        style: notificationStyles.alertInfo,
      });
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      size: selectedSize,
    });
  };

  const handlePayNow = () => {
    // console.log("Pay Now clicked");
    if (!product || !selectedSize) {
      showToast.warning("Select a size before proceeding to checkout.", {
        icon: null,
        position: "top-center",
        style: notificationStyles.alertWarning,
      });
      return;
    }

    const callbackUrl = `${window.location.origin}/paystack-callback?context=dashboard`;

    instantCheckoutMutation.mutate({
      productId: product.id,
      quantity,
      size: selectedSize,
      callbackUrl,
    });
  };

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
          <p className="text-neutral-700 mb-3">Unable to load dress</p>
          {/* <p className="text-gray-600">{error?.message || "Dress not found"}</p> */}
          <Button text="Retry" variant="solid" className="w-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[72rem] flex flex-col gap-4">
      <div className="h-auto bg-white rounded-md p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="relative w-full lg:w-1/2 aspect-square max-w-[35.4375rem] bg-gray-100 rounded-md">
              <img
                src={product.images?.[0]?.url || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-full rounded-md object-cover"
              />
              <div className="absolute left-3 top-40 flex flex-col gap-[1rem]">
                {product.images?.slice(0, 4).map((image, idx) => (
                  <img
                    key={idx}
                    src={image.url}
                    alt={`${product.name} view ${idx + 2}`}
                    className="w-[101px] h-[67px] rounded-md object-cover border border-white cursor-pointer hover:border-primary-500 transition-colors"
                  />
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
                <span className="font-semibold text-neutral-900">
                  ₦{formatPrice(Number(product.price ?? 0))}
                </span>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <div className="mb-3">Color</div>
                <div className="size-[40px] bg-[#2280B3] rounded-full" />
              </div>

              {/* Measurement set selector */}
              {measurementsData?.measurementSets?.length ? (
                <div className="flex flex-col gap-2 border-b border-gray-100 pb-3">
                  <span className="text-[13px] text-neutral-700">
                    Shopping for
                  </span>
                  <select
                    className="h-10 w-full border border-[#E8E8E8] rounded-md px-3 text-sm bg-white"
                    value={selectedMeasurementSetId}
                    onChange={(e) =>
                      setSelectedMeasurementSetId(e.target.value || "")
                    }
                  >
                    <option value="">
                      Latest measurements (auto-detect)
                    </option>
                    {measurementsData.measurementSets.map((set) => (
                      <option key={set.id} value={set.id}>
                        {set.name || "Unnamed set"} •{" "}
                        {set.gender?.toLowerCase() === "male"
                          ? "Male"
                          : "Female"}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Size chart + recommended sizes */}
              <div className="flex flex-col gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#1C1C1C] text-[14px]">Size</span>
                  <span className="text-[#979797] text-[12px]">Size Guide</span>
                </div>

                {primaryRecommendation && (
                  <div className="bg-[#FFF8EB] rounded-md p-3 flex gap-2">
                    <InfoIcon className="mt-1 text-[#F59E0B]" size={18} />
                    <div className="flex flex-col gap-1 text-[13px]">
                      <h5 className="font-medium text-[#F59E0B]">
                        Recommended size for you
                      </h5>
                      <p className="text-[#B47409]">
                        {primaryRecommendation.chartName}:{" "}
                        <span className="font-semibold">
                          {primaryRecommendation.label}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Chart selector */}
                {charts.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-neutral-600">
                      Size chart
                    </label>
                    <select
                      className="h-10 w-full border border-[#E8E8E8] rounded-md px-3 text-sm bg-white"
                      value={selectedChartId ?? ""}
                      onChange={(e) =>
                        setSelectedChartId(
                          e.target.value || charts[0]?.id || null
                        )
                      }
                    >
                      {charts.map((chart) => (
                        <option key={chart.id} value={chart.id}>
                          {chart.name} ({chart.gender})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Size options */}
                <div className="w-full flex flex-wrap gap-2 mt-1">
                  {entriesForSelectedChart.length > 0
                    ? entriesForSelectedChart.map((entry) => {
                        const isRecommendedForEntry =
                          recommendedSizesData?.recommendedSizes?.some(
                            (r) =>
                              r.chartId === entry.chart.id &&
                              r.label === entry.label
                          );
                        return (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => setSelectedSize(entry.label)}
                            className={`min-w-[3rem] px-3 h-[2.5rem] text-[14px] border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                              selectedSize === entry.label
                                ? "border-primary-500 bg-primary-50 text-primary-700"
                                : "border-[#E8E8E8] hover:border-gray-300 text-[#494949]"
                            } ${
                              isRecommendedForEntry && selectedSize !== entry.label
                                ? "border-dashed border-primary-400"
                                : ""
                            }`}
                          >
                            {entry.label}
                          </button>
                        );
                      })
                    : ["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[3rem] px-3 h-[2.5rem] text-[14px] border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                            selectedSize === size
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-[#E8E8E8] hover:border-gray-300 text-[#494949]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[14px]">Quality</span>

                <div className="w-[121px] flex items-center justify-between gap-2 border border-neutral-100 py-[10px] px-[12px] rounded-md">
                  <MinusIcon
                    className="cursor-pointer hover:text-primary-500"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  />
                  <span>{quantity}</span>
                  <PlusIcon
                    className="cursor-pointer hover:text-primary-500"
                    onClick={() => setQuantity(quantity + 1)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 flex items-center justify-center gap-[1.5rem] py-[40px] px-[24px]">
            <Button
              variant="outline"
              className="w-[23.4375rem] border border-neutral-500 text-neutral-900 cursor-pointer"
              disabled={addToCartMutation.isPending}
              onClick={handleAddToCart}
            >
              <div className="w-full flex items-center justify-center gap-2">
                <span>
                  {addToCartMutation.isPending ? "Adding" : "Add to Cart"}
                </span>
                <Spinner
                  isLoading={addToCartMutation.isPending}
                  size="sm"
                  speed="fast"
                  circleColor="#3D3D3D"
                />
              </div>
            </Button>

            <Button
              type="button"
              variant="solid"
              className="w-[23.4375rem] cursor-pointer"
              disabled={
                addToCartMutation.isPending || instantCheckoutMutation.isPending
              }
              onClick={handlePayNow}
            >
              <div className="w-full flex items-center justify-center gap-2">
                {instantCheckoutMutation.isPending ? (
                  <span>Processing</span>
                ) : (
                  <span>Pay Now</span>
                )}
                <Spinner
                  isLoading={instantCheckoutMutation.isPending}
                  size="sm"
                  speed="fast"
                  circleColor="#9A6C50"
                />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
