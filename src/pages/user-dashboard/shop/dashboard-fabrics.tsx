import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import { CaretRightIcon } from "@phosphor-icons/react";
import { SearchProvider } from "./context/search-context";
import { ShopFiltersProvider } from "./context/shop-filters-context";
import MeasurementSetSelector from "./components/measurement-set-selector";
import SearchInput from "./components/search-input";
import FabricItems from "../../../shared-components/shop/fabric-items";

/* ---------------------------------------------------------------------- */

const BreadCrumb = () => (
  <div className="font-inter font-light capitalize flex items-center">
    <span className="text-primary-900">Araafit</span>
    <CaretRightIcon className="text-[#979797]" />
    <span className="text-primary-900">Shop</span>
    <CaretRightIcon className="text-[#979797]" />
    <span className="text-[#979797]">Fabrics</span>
  </div>
);

export function DashboardFabricsPage() {
  return (
    <UserDashboardLayout>
      <SearchProvider>
        <ShopFiltersProvider>
          <div className="h-screen flex flex-col gap-2 relative overflow-y-hidden">
            <TopBar title="Shop" breadCrumb={<BreadCrumb />} />

            <div className="size-full rounded-[6px] p-2 lg:p-4 mt-0 lg:mt-20 relative">
              <div className="h-[90%] bg-white overflow-y-scroll relative rounded-[6px] shadow-sm">
                {/* Header with Search and Measurement Set Selector */}
                <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-4 py-3 flex items-center justify-between gap-4">
                  <SearchInput />
                  <MeasurementSetSelector />
                </div>
                
                <div className="w-full h-full p-4">
                  <FabricItems userPage="dashboard" />
                </div>
              </div>
            </div>
          </div>
        </ShopFiltersProvider>
      </SearchProvider>
    </UserDashboardLayout>
  );
}


