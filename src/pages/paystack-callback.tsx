import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Paystack callback page for handling popup redirects
 * This page communicates with the parent window to pass callback data
 */
export default function PaystackCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract parameters from URL
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");
    const success = searchParams.get("success") === "true";

    // Send message to parent window (popup opener)
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "paystack_callback",
          success,
          reference: reference || trxref,
          searchParams: Object.fromEntries(searchParams.entries()),
        },
        window.location.origin
      );

      // Close the popup after sending the message
      setTimeout(() => {
        window.close();
      }, 500);
    } else {
      // Fallback for direct access (shouldn't happen in normal flow)
      console.log("Paystack callback - no opener window found");
      
      // Try to redirect to dashboard if accessed directly
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    }
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





