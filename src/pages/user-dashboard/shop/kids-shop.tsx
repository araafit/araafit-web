import { CaretRightIcon } from "@phosphor-icons/react";
import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import { SearchProvider } from "./context/search-context";
import TopBar from "../top-bar";

/* --------------------------------------------------------------------------------- */

const BreadCrumb = () => (
  <div className="font-inter font-light capitalize flex items-center">
    <span className="text-primary-900">Araafit</span>
    <CaretRightIcon className="text-[#979797]" />
    <span className="text-[#979797]">Kid</span>
  </div>
);

export function KidsShop() {
  return (
    <UserDashboardLayout>
      <SearchProvider>
        <div className="h-screen flex flex-col gap-2 relative">
          <TopBar title="shop" breadCrumb={<BreadCrumb />} />
        </div>
      </SearchProvider>
    </UserDashboardLayout>
  );
}
