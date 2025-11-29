import GuestPageLayout from "../../../layouts/guest/guest-page-layout";
import CartCheckout from "../../../shared-components/checkout/checkout";

/* --------------------------------------------------------------------------*/

function GuestCartCheckout() {
  return (
    <GuestPageLayout>
      <div className="w-full h-full">
        <CartCheckout />
      </div>
    </GuestPageLayout>
  );
}

export default GuestCartCheckout;
