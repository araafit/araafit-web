import GuestPageLayout from "../../../layouts/guest/guest-page-layout";
import CartCheckout from "../../../shared-components/checkout/checkout";

/* --------------------------------------------------------------------------*/

function GuestCartCheckout() {
  return (
    <GuestPageLayout>
      <div className="size-full">
         <CartCheckout />
      </div>
    </GuestPageLayout>
  );
}

export default GuestCartCheckout;
