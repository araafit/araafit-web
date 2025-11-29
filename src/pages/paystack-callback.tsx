import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyPayment } from "../hooks/orders.hooks";

/**
 * Paystack callback page for handling popup redirects
 * This page communicates with the parent window to pass callback data
 */
export default function PaystackCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyPaymentMutation = useVerifyPayment();

  // Extract parameters from URL
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");
  const success = searchParams.get("success") === "true";


  const ref = reference || trxref;
  const context = searchParams.get("context") || "dashboard";

  useEffect(() => {

    // If opened as a popup, keep legacy postMessage behavior
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "paystack_callback",
          success,
          reference: ref,
          searchParams: Object.fromEntries(searchParams.entries()),
        },
        window.location.origin
      );

      setTimeout(() => {
        window.close();
      }, 500);
      return;
    }

    // Direct redirect flow - verify payment before sending user to success page
    if (!ref) {
      // Missing reference – send user back to appropriate cart
      setTimeout(() => {
        navigate(context === "guest" ? "/cart" : "/dashboard/cart");
      }, 2000);
      return;
    }

    verifyPaymentMutation.mutate(ref, {
      onSuccess: () => {
        const targetPath =
          context === "guest"
            ? "/cart/checkout/success"
            : "/dashboard/cart/checkout/success";
        navigate(targetPath + `?reference=${encodeURIComponent(ref)}`);
      },
      onError: () => {
        const targetPath = context === "guest" ? "/cart" : "/dashboard/cart";
        navigate(targetPath);
      },
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Processing Payment...
        </h2>
        <p className="text-gray-600">
          Please wait while we process your payment authorization.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          This window will close automatically.
        </p>
      </div>
    </div>
  );
}
