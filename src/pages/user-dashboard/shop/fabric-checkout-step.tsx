import { FabricRequestStepperLines } from "./fabric-request-stepper";
import { useMakeSewingRequest } from "../../../hooks/requests.hooks";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../../../shared-components/button";
import Spinner from "../../../shared-components/spinner";
import { useSearchParams } from "react-router-dom";
import { useFabricRequestStore } from "../../../shared-hooks/state-store";
import { formatNumber } from "../../../utils/admin-dashboard-utils";

/* ------------------------------------------------------------------------------ */

export interface SewingRequestPayload {
  size: string;
  dressStyle: string;
  yardEstimate: string | number;
  noteForTailor: string;
  gender: string;
  fabricId: string;
}

export function DashboardFabricCheckoutStepPage() {
  const params = useParams<{ itemName: string }>();
  const rawParam = params.itemName || "";
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, _] = useSearchParams();

  const { discountApplied: discount } = useFabricRequestStore((state) => state);

  const fabricId = searchParams.get("fabricId") || "";
  const selectedStyleId = searchParams.get("styleId") || "";
  const selectedMeasurementSetId = searchParams.get("measurementId") || "";
  const yardsNeeded = Number(searchParams.get("yardsNeeded") || "0");
  const gender = searchParams.get("gender") || "";
  const noteForTailor = searchParams.get("noteForTailor") || "";
  const totalCost = Number(searchParams.get("totalCost") || "0");

  const makeRequest = useMakeSewingRequest();

  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const hasDiscount = discount?.value && discount.value > 0;
  const percentageDiscountAmount =
    discount?.type === "percentage"
      ? Math.floor((totalCost * discount.value) / 100)
      : 0;
  const fixedDiscountAmount = discount?.type === "fixed" ? discount.value : 0;
  const finalCostIfIsPercentage = totalCost
    ? totalCost - percentageDiscountAmount
    : 0;
  const finalCostIfIsFixed = totalCost ? totalCost - fixedDiscountAmount : 0;

  const onPolicyChange = (checked: boolean) => {
    setAgreedToPolicy(checked);
  };

  const checkoutMutation = async () => {
    await makeRequest.mutateAsync({
      fabricId,
      dressStyle: selectedStyleId.toString(),
      size: selectedMeasurementSetId.toString(),
      yardEstimate: yardsNeeded as number,
      gender: gender,
      noteForTailor,
    });
  };

  // console.log(discount, yardsNeeded);

  return (
    <section className="min-h-screen bg-[#F5F5F5] flex items-start justify-center px-4 py-6 md:px-8">
      <div className="h-full max-w-[72rem] bg-white rounded-md shadow-sm p-4 md:p-6 flex flex-col items-center justify-center gap-6">
        {/* Header row */}
        <div className="flex flex-col gap-4">
          <FabricRequestStepperLines stepIndex={4} />

          {/* ... rest of the component code ... */}
          <div className="w-full flex items-center justify-around gap-5 my-5">
            <button
              type="button"
              onClick={() =>
                navigate(`/dashboard/shop/fabric/${rawParam}/review`)
              }
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
              title="Back button"
            >
              <ArrowLeftIcon size={18} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
                Checkout
              </h1>
              <span className="text-xs md:text-sm text-neutral-500 mt-0.5">
                Step 4 of 4 ·Make payment for your request.
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[800px]">
          <div className="p-4 rounded-[6px] mb-3 bg-[#FFF8EB] border border-[#F59E0B] text-[#B47409]">
            <h3 className="font-semibold mb-1 font-inter">No Refund Policy</h3>
            <p className="text-sm leading-relaxed">
              All custom wear and tailoring orders are final. Once production
              has begun, we cannot accept refunds or cancellations. Please
              ensure all measurements, styles, and fabric selections are correct
              before proceeding to payment.
            </p>
          </div>

          <label className="flex items-center gap-3 p-4 bg-card border border-border rounded-[6px] cursor-pointer hover:bg-secondary transition-colors mb-3">
            <input
              type="checkbox"
              checked={agreedToPolicy}
              onChange={(e) => onPolicyChange(e.target.checked)}
              className="mt-1 w-5 h-5 rounded-[4px] border-2 border-border text-primary focus:ring-2 focus:ring-accent cursor-pointer"
            />

            <span className="text-sm text-foreground">
              I understand and agree to the no refund policy for this custom
              order.
            </span>
          </label>

          {/* Payment Summary */}
          <div className="mt-8 p-6 bg-secondary border border-border rounded-[6px] mb-5">
            <div className={`flex justify-between items-center ${hasDiscount ? "mb-4" : "mb-0"}`}>
              <span className={`${hasDiscount?"text-muted-foreground":"text-lg font-bold"}`}>Total cost</span>
              <span className={`${hasDiscount ? "font-semibold text-md" : "text-lg font-bold"} text-foreground`}>
                &#8358;{formatNumber(totalCost) || 0}
              </span>
            </div>

            {hasDiscount && (
              <div className="flex justify-between items-center mb-4 text-[#B47409]">
                <span className="text-muted-foreground">
                  Discount{" "}
                  {discount?.type === "percentage"
                    ? `(${discount.value}%)`
                    : `${discount.value}`}
                </span>
                <span className="font-semibold">
                  - &#8358;
                  {discount?.type === "percentage"
                    ? percentageDiscountAmount
                    : fixedDiscountAmount}
                </span>
              </div>
            )}

            {hasDiscount && ( <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-lg font-bold text-foreground">
                Final cost
              </span>
              <span className="text-2xl font-bold text-primary">
                &#8358;
                {discount?.type === "percentage"
                  ? formatNumber(finalCostIfIsPercentage)
                  : formatNumber(finalCostIfIsFixed)}
              </span>
            </div>)}

          </div>

          <Button
            variant="solid"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
            disabled={!agreedToPolicy || makeRequest.isPending}
            onClick={checkoutMutation}
          >
            <div className="flex items-center gap-2">
              <span>Make payment</span>

              <Spinner
                arcColor="#ffff"
                size="sm"
                speed="fast"
                isLoading={makeRequest.isPending}
              />
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}
