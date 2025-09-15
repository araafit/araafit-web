import { DressDetail } from "../../../shared-components/shop/dress-detail";
import GuestPageLayout from "../../../layouts/guest/guest-page-layout";

/* -------------------------------------------------------- */

export function GuestDressDetailPage() {
  return (
    <GuestPageLayout>
      <div className="w-full flex justify-center p-4">
        <DressDetail />
      </div>
    </GuestPageLayout>
  );
}
