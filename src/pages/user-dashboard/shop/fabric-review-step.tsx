import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { FabricRequestStepperLines } from "./fabric-request-stepper";
import { useFabricRequestStore } from "../../../shared-hooks/state-store";
import { useProduct } from "../../../hooks/user-dashboard.hooks";
import { useDressStyle } from "../../../hooks/admin-settings.hooks";
import { useMeasurements } from "../../../hooks/measurements.hooks";
import type { MeasurementSet } from "../../../services/measurements.service";
import Spinner from "../../../shared-components/spinner";
import { formatPrice } from "../../../utils/format-price";
import Button from "../../../shared-components/button";
import { useSewingRequestReview } from "../../../hooks/requests.hooks";
import { useEffect } from "react";

/* ---------------------------------------------------------------------- */

export function DashboardFabricReviewStepPage() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const params = useParams<{ itemName: string }>();
  const rawParam = params.itemName || "";
  const navigate = useNavigate();
  const {
    fabricId,
    selectedImageUrl,
    selectedStyleId,
    selectedStyleName,
    selectedStyleImageUrl,
    selectedMeasurementSetId,
    selectedMeasurementSetName,
    discountApplied: discount,
    setDiscount,
  } = useFabricRequestStore((state) => state);

  const requestReview = useSewingRequestReview();

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
  } = useProduct(rawParam);

  const {
    data: style,
    isLoading: isStyleLoading,
    isError: isStyleError,
    error: styleError,
  } = useDressStyle(selectedStyleId ? String(selectedStyleId) : "");

  const {
    data: measurementsData,
    isLoading: isMeasurementsLoading,
    isError: isMeasurementsError,
    error: measurementsError,
  } = useMeasurements();

  const measurementSets: MeasurementSet[] = useMemo(
    () => measurementsData?.measurementSets ?? [],
    [measurementsData]
  );

  const selectedMeasurementSet: MeasurementSet | null = useMemo(() => {
    if (!selectedMeasurementSetId) return null;
    if (selectedMeasurementSetId === "__base__") return null;
    return (
      measurementSets.find((s) => s.id === selectedMeasurementSetId) ?? null
    );
  }, [measurementSets, selectedMeasurementSetId]);

  const assignedSize = selectedMeasurementSet?.assignedSize ?? null;

  const matchedSizeConfig = useMemo(() => {
    if (!style || !assignedSize?.entryId) return null;
    return (
      style.sizeChartEntries?.find(
        (entry) => entry.sizeChartEntry.id === assignedSize.entryId
      ) ?? null
    );
  }, [style, assignedSize]);

  const yardsNeeded = useMemo(() => {
    if (!matchedSizeConfig) return null;
    const n = Number(matchedSizeConfig.fabricYards);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n.toFixed(0);
  }, [matchedSizeConfig]);

  const pricePerYard = useMemo(() => {
    if (!product) return null;
    const n = Number(product.pricePerYard ?? product.price ?? 0);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  }, [product]);

  const sewingPrice = useMemo(() => {
    if (!style) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (style as any).sewingPrice;
    const n = typeof raw === "number" ? raw : Number(raw ?? 0);
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
  }, [style]);

  const fabricCost = useMemo(() => {
    if (!yardsNeeded || !pricePerYard) return null;
    return Number(yardsNeeded) * pricePerYard;
  }, [yardsNeeded, pricePerYard]);

  const totalCost = useMemo(() => {
    const fabric = fabricCost ?? 0;
    const sewing = sewingPrice ?? 0;
    const sum = fabric + sewing;
    if (!Number.isFinite(sum) || sum <= 0) return null;
    return sum;
  }, [fabricCost, sewingPrice]);

  const [noteForTailor, setNoteForTailor] = useState("");

  const isLoading = isProductLoading || isStyleLoading || isMeasurementsLoading;

  const hasHardError = isProductError || isStyleError || isMeasurementsError;

  useEffect(() => {
    if (
      !fabricId ||
      !selectedStyleId ||
      !selectedMeasurementSetId ||
      !yardsNeeded
    )
      return;

    setHasSubmitted(true);

    requestReview.mutate({
      fabricId: fabricId,
      styleId: selectedStyleId,
      measurementId: selectedMeasurementSetId as string,
      yardEstimate: yardsNeeded ? Number(yardsNeeded) : 0,
      noteForTailor: noteForTailor,
    });

    if (requestReview.isSuccess) {
      // console.log(requestReview.data.data.discountApplied);
      setDiscount(requestReview.data.data.discountApplied);
    }
  }, [
    fabricId,
    selectedMeasurementSetId,
    selectedStyleId,
    yardsNeeded,
    hasSubmitted,
  ]);

  // Guards: ensure previous steps completed
  if (!fabricId) {
    return (
      <Navigate to={`/dashboard/shop/fabric/${rawParam}/request`} replace />
    );
  }

  if (!selectedStyleId) {
    return <Navigate to={`/dashboard/shop/fabric/${rawParam}/style`} replace />;
  }

  if (!selectedMeasurementSetId) {
    return (
      <Navigate to={`/dashboard/shop/fabric/${rawParam}/measurement`} replace />
    );
  }

  const handleContinue = () => {
    // Next: Checkout step
    navigate(
      `/dashboard/shop/fabric/${rawParam}/checkout?fabricId=${fabricId}&selectedStyleId=${selectedStyleId}&selectedMeasurementSetId=${selectedMeasurementSetId}&yardsNeeded=${yardsNeeded}&gender=${measurementsData?.gender}&noteForTailor=${noteForTailor}&totalCost=${totalCost}`
    );
  };

  return (
    <section className="min-h-screen bg-[#F5F5F5] flex items-start justify-center px-4 py-6 md:px-8">
      <div className="w-full max-w-[72rem] bg-white rounded-md shadow-sm p-4 md:p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-2">
          <FabricRequestStepperLines stepIndex={3} />

          <div className="w-full flex items-center justify-evenly gap-5 my-5">
            <button
              type="button"
              onClick={() =>
                navigate(`/dashboard/shop/fabric/${rawParam}/measurement`)
              }
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
              title="Back button"
            >
              <ArrowLeftIcon size={18} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
                Review request
              </h1>
              <span className="text-xs md:text-sm text-neutral-500 mt-0.5">
                Step 4 of 4 · Confirm fabric, style, measurements and cost
              </span>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Spinner size="md" speed="fast" isLoading arcColor="#9A6C50" />
          </div>
        )}

        {!isLoading && hasHardError && (
          <div className="flex items-center justify-center py-16">
            <div className="max-w-md text-center">
              <p className="text-red-600 mb-2">
                Something went wrong while loading your request details.
              </p>
              <p className="text-xs md:text-sm text-neutral-500 mb-4">
                {productError instanceof Error
                  ? productError.message
                  : styleError instanceof Error
                  ? styleError.message
                  : measurementsError instanceof Error
                  ? measurementsError.message
                  : "Please go back and try again."}
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50"
                onClick={() =>
                  navigate(`/dashboard/shop/fabric/${rawParam}/request`)
                }
              >
                Back to start
              </button>
            </div>
          </div>
        )}

        {!isLoading && !hasHardError && (
          <>
            {/* Summary grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left: Fabric & style */}
              <div className="lg:col-span-2 space-y-4">
                {/* Fabric */}
                <div className="border border-neutral-100 rounded-md p-4 flex gap-4">
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={
                        selectedImageUrl ||
                        product?.images?.[0]?.url ||
                        "/placeholder-image.jpg"
                      }
                      alt={product?.name || "Selected fabric"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 gap-1">
                    <div>
                      <p className="text-xs uppercase text-neutral-400">
                        Fabric
                      </p>
                      <p className="text-sm md:text-base font-semibold text-neutral-900 line-clamp-2">
                        {product?.name || "Selected fabric"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xs text-neutral-500">
                        Price per yard:{" "}
                        {pricePerYard
                          ? `₦${formatPrice(pricePerYard)}`
                          : "Not available"}
                      </div>

                      {discount && (
                        <div className="text-xs bg-primary-500 p-1 rounded-md text-white">
                          {discount.type === "percentage"
                            ? ` ${discount.value}% OFF`
                            : `₦${discount.value} OFF`}{" "}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Style */}
                <div className="border border-neutral-100 rounded-md p-4 flex gap-4">
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={
                        selectedStyleImageUrl ||
                        style?.images?.[0]?.url ||
                        "/placeholder-image.jpg"
                      }
                      alt={selectedStyleName || style?.name || "Selected style"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 gap-1">
                    <div>
                      <p className="text-xs uppercase text-neutral-400">
                        Style
                      </p>
                      <p className="text-sm md:text-base font-semibold text-neutral-900 line-clamp-2">
                        {selectedStyleName || style?.name || "Selected style"}
                      </p>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Sewing cost:{" "}
                      {sewingPrice
                        ? `₦${formatPrice(sewingPrice)}`
                        : "Not specified"}
                    </div>
                  </div>
                </div>

                {/* Measurements */}
                <div className="border border-neutral-100 rounded-md p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase text-neutral-400">
                        Measurements
                      </p>
                      <p className="text-sm md:text-base font-semibold text-neutral-900 line-clamp-2">
                        {selectedMeasurementSetId === "__base__"
                          ? "Default measurements"
                          : selectedMeasurementSetName || "Selected set"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-primary-600 hover:text-primary-700 underline"
                      onClick={() =>
                        navigate(
                          `/dashboard/shop/fabric/${rawParam}/measurement`
                        )
                      }
                    >
                      Change
                    </button>
                  </div>

                  {assignedSize ? (
                    <p className="text-xs text-neutral-600">
                      Size for this request:{" "}
                      <span className="font-medium">
                        {assignedSize.label} ({assignedSize.chartName})
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <WarningCircleIcon size={14} />
                      This measurement set is not linked to a size entry yet, so
                      we can&apos;t estimate fabric yards automatically.
                    </p>
                  )}
                </div>

                {/* Note for tailor */}
                <div className="border border-neutral-100 rounded-md p-4 flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-900">
                    Note for tailor (optional)
                  </p>
                  <textarea
                    rows={3}
                    className="w-full border border-[#D0D5DD] rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Add any specific instructions for the tailor."
                    value={noteForTailor}
                    onChange={(e) => setNoteForTailor(e.target.value)}
                  />
                </div>
              </div>

              {/* Right: Cost breakdown */}
              <div className="border border-neutral-100 rounded-md p-4 flex flex-col gap-3 bg-neutral-50/60">
                <h2 className="text-sm md:text-base font-semibold text-neutral-900">
                  Cost breakdown
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Yards needed</span>
                    <span className="font-medium text-neutral-900">
                      {yardsNeeded
                        ? `${formatPrice(Number(yardsNeeded))} yd`
                        : "Not available"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Fabric cost</span>
                    <span className="font-medium text-neutral-900">
                      {fabricCost
                        ? `₦${formatPrice(fabricCost)}`
                        : "Not available"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Sewing cost</span>
                    <span className="font-medium text-neutral-900">
                      {sewingPrice
                        ? `₦${formatPrice(sewingPrice)}`
                        : "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-3 mt-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">
                    Total estimate
                  </span>
                  <span className="text-lg font-semibold text-neutral-900">
                    {totalCost ? `₦${formatPrice(totalCost)}` : "Not available"}
                  </span>
                </div>

                {!yardsNeeded && (
                  <p className="mt-1 text-[11px] text-amber-700 flex items-start gap-1">
                    <WarningCircleIcon
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span>
                      We couldn&apos;t automatically map your measurement set to
                      a size entry for this style. The yard estimate and fabric
                      cost may need to be confirmed by an admin.
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Footer actions (placeholder for actual checkout) */}
            <div className="flex items-center justify-end pt-4 border-t border-neutral-100 mt-2">
              <Button
                variant="solid"
                text="Confirm to proceed"
                type="button"
                className="px-5 py-2.5 rounded-md bg-[#9A6C50] text-white text-sm font-medium hover:bg-[#7B523F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || hasHardError || requestReview.isPending}
                onClick={handleContinue}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
