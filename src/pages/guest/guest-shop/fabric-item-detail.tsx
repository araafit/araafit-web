import { FabricDetail } from "../../../shared-components/shop/fabric-detail";
import GuestPageLayout from "../../../layouts/guest/guest-page-layout";

/* ------------------------------------------------------------ */

export function GuestFabricDetailPage() {
  return (
    <GuestPageLayout>
      {/* <div className="h-screen flex flex-col gap-2 relative"> */}
        <FabricDetail />
      {/* </div> */}
    </GuestPageLayout>
  );
}
