import { CaretRightIcon } from "@phosphor-icons/react";
import DashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import ShopTab from "../../../shared-components/shop/shop-tab";
import AllItems from "../../../shared-components/shop/all-items";
import DressItems from "../../../shared-components/shop/dress-items";
import FabricItems from "../../../shared-components/shop/fabric-items";
import { SearchProvider } from "./context/search-context";

/* --------------------------------------------------------------------------------- */

const BreadCrumb = () => (
  <div className="font-inter font-light capitalize flex items-center">
    <span className="text-primary-900">Araafit</span>
    <CaretRightIcon className="text-[#979797]" />
    <span className="text-[#979797]">Shop</span>
  </div>
);

/**
 * Dashboard shop page
 *
 * @returns ReactElement
 */
export function DashboardShopPage() {
  return (
    <DashboardLayout>
      <SearchProvider>
        <div className="h-screen flex flex-col gap-2 relative">
          <TopBar title="shop" breadCrumb={<BreadCrumb />} />

          <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
            {/* Shop Tabs */}
            <div className="size-full bg-white rounded-md">
              <ShopTab
                items={["All", "Dresses", "Fabrics"]}
                tabContainerClassName="bg-transparent h-full"
                tabListClassName=" text-[0.875rem] text-neutral-700 border border-neutral-100 p-[0.254rem] bg-white rounded-md"
                activeTabClassName="bg-primary-900 text-white rounded-md"
                // onChange={(item) => console.log(item)}
              >
                <AllItems userPage="dashboard" />
                <DressItems userPage="dashboard" />
                <FabricItems userPage="dashboard" />
              </ShopTab>
            </div>
          </div>
        </div>
      </SearchProvider>
    </DashboardLayout>
  );
}
