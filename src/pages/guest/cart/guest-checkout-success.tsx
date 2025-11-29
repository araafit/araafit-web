import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyPayment } from "../../../hooks/orders.hooks";
import GuestPageLayout from "../../../layouts/guest/guest-page-layout";
import Button from "../../../shared-components/button";
import Spinner from "../../../shared-components/spinner";
import { checkMark } from "../../../shared-images/image-entry";

/* ------------------------------------------------------------------------- */

export default function GuestCheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyPaymentMutation = useVerifyPayment();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setError("Missing payment reference. Redirecting to cart...");
      setTimeout(() => navigate("/cart"), 3000);
      setLoading(false);
      return;
    }

    verifyPaymentMutation.mutate(reference, {
      onSuccess: () => {
        setPaymentVerified(true);
        setLoading(false);
      },
      onError: () => {
        setError("Payment verification failed. Please contact support.");
        setLoading(false);
      },
    });
  }, [searchParams, navigate, verifyPaymentMutation]);

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  const handleLoginToViewOrders = () => {
    navigate("/auth/login");
  };

  if (loading) {
    return (
      <GuestPageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" speed="normal" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
              Processing Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment.
            </p>
          </div>
        </div>
      </GuestPageLayout>
    );
  }

  if (error) {
    return (
      <GuestPageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Payment Error
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              text="Return to Cart"
              variant="solid"
              className="w-full bg-primary-500 text-white"
              onClick={() => navigate("/cart")}
            />
          </div>
        </div>
      </GuestPageLayout>
    );
  }

  if (!paymentVerified) {
    return null;
  }

  return (
    <GuestPageLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <img
            src={checkMark}
            alt="Success"
            className="size-[100px] mx-auto mb-6"
          />

          <div className="flex flex-col items-center gap-3">
            <h2 className="font-semibold text-[2rem] text-neutral-950">
              Payment Successful!
            </h2>

            <p className="font-light text-neutral-700 text-center leading-snug mb-2">
              Your payment has been processed successfully. You can continue
              shopping or log in to track your orders.
            </p>

            <div className="flex flex-col gap-3 w-full mt-6">
              <Button
                text="Continue Shopping"
                variant="solid"
                className="w-full bg-primary-500 text-white"
                onClick={handleContinueShopping}
              />

              <Button
                text="Log in to View Orders"
                variant="outline"
                className="w-full"
                onClick={handleLoginToViewOrders}
              />
            </div>
          </div>
        </div>
      </div>
    </GuestPageLayout>
  );
}


