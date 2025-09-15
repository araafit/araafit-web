import { FabricDetail } from "../../../shared-components/shop/fabric-detail";
import GuestPageLayout from "../../../layouts/guest/guest-page-layout";

/* ------------------------------------------------------------ */

export function GuestFabricDetailPage() {
  return (
    <GuestPageLayout>
      <div className="w-full flex justify-center p-4">
        <FabricDetail />
      </div>
    </GuestPageLayout>
  );
}
