import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyPayment } from "../../../../hooks/orders.hooks";
import { useSaveAfterPayment } from "../../../../hooks/cards.hooks";
import Button from "../../../../shared-components/button";
import Spinner from "../../../../shared-components/spinner";
import checkMark from "../../checkmark.png";

/* ------------------------------------------------------------------------- */

/**
 * Checkout success page for handling payment callbacks
 * This page verifies payment and saves cards if needed
 *
 * @returns ReactElement
 */
export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const verifyPaymentMutation = useVerifyPayment();
  const saveAfterPaymentMutation = useSaveAfterPayment();

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");
    const success = searchParams.get("success");

    if ((reference || trxref) && success === "true") {
      const paymentReference = reference || trxref;
      
      if (paymentReference) {
        // First verify the payment
        verifyPaymentMutation.mutate(paymentReference, {
          onSuccess: () => {
            setPaymentVerified(true);
            
            // Check if we need to save the card
            // This could be determined by a query parameter or other means
            const shouldSaveCard = searchParams.get("saveCard") === "true";
            
            if (shouldSaveCard) {
              // Save the card after payment verification
              saveAfterPaymentMutation.mutate(
                { reference: paymentReference },
                {
                  onSuccess: () => {
                    setCardSaved(true);
                    setLoading(false);
                  },
                  onError: (error) => {
                    console.error("Failed to save card after payment:", error);
                    // Still consider success since payment was verified
                    setCardSaved(false);
                    setLoading(false);
                  }
                }
              );
            } else {
              setLoading(false);
            }
          },
          onError: (error) => {
            console.error("Payment verification failed:", error);
            setError("Payment verification failed. Please contact support.");
            setLoading(false);
          }
        });
      }
    } else if ((reference || trxref) && success === "false") {
      // Payment failed
      setError("Payment was not successful. Please try again.");
      setLoading(false);
    } else {
      // No payment parameters found
      setError("Invalid payment callback. Redirecting to cart...");
      setTimeout(() => {
        navigate("/dashboard/cart");
      }, 3000);
      setLoading(false);
    }
  }, [searchParams, verifyPaymentMutation, saveAfterPaymentMutation, navigate]);

  const handleContinueShopping = () => {
    navigate("/dashboard/shop");
  };

  const handleViewOrders = () => {
    navigate("/dashboard/orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" speed="normal" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
            Processing Payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment and complete your order.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <Button
            text="Return to Cart"
            variant="solid"
            className="w-full bg-primary-500 text-white"
            onClick={() => navigate("/dashboard/cart")}
          />
        </div>
      </div>
    );
  }

  if (paymentVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <img src={checkMark} alt="Success" className="size-[100px] mx-auto mb-6" />
          
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-semibold text-[2rem] text-neutral-950">
              Payment Successful!
            </h2>

            <p className="font-light text-neutral-700 text-center leading-snug mb-2">
              Your payment has been processed successfully and your order has been created.
            </p>

            {cardSaved && (
              <p className="font-light text-green-600 text-center text-sm">
                ✓ Your card has been saved for future purchases.
              </p>
            )}

            <div className="flex flex-col gap-3 w-full mt-6">
              <Button
                text="View Orders"
                variant="solid"
                className="w-full bg-primary-500 text-white"
                onClick={handleViewOrders}
              />
              
              <Button
                text="Continue Shopping"
                variant="outline"
                className="w-full"
                onClick={handleContinueShopping}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
