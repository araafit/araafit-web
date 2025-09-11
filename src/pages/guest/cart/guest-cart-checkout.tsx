import GuestPageLayout from "../../../layouts/guest/guest-page-layout";
import CartCheckout from "../../../shared-components/checkout/checkout";

/* --------------------------------------------------------------------------*/

function GuestCartCheckout() {
  return (
    <GuestPageLayout>
      <div className="size-full lg:w-[71.875rem]">
         <CartCheckout />
      </div>
    </GuestPageLayout>
  );
}

export default GuestCartCheckout;
