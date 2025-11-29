import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import { CaretRightIcon } from "@phosphor-icons/react";
import { SearchProvider } from "./context/search-context";
import ShopTab from "../../../shared-components/shop/shop-tab";
import AllItems from "../../../shared-components/shop/all-items";
import { MenShop } from "./men-shop";
import { WomenShop } from "./women-shop";
import { KidsShop } from "./kids-shop";

/* ---------------------------------------------------------------------- */

const BreadCrumb = () => (
  <div className="font-inter font-light capitalize flex items-center">
    <span className="text-primary-900">Araafit</span>
    <CaretRightIcon className="text-[#979797]" />
    <span className="text-primary-900">Shop</span>
    <CaretRightIcon className="text-[#979797]" />
    <span className="text-[#979797]">Ready Made</span>
  </div>
);

export function DashboardShopPage() {
  return (
    <UserDashboardLayout>
      <SearchProvider>
        <div className="h-screen flex flex-col gap-2 relative overflow-y-hidden">
          <TopBar title="Shop" breadCrumb={<BreadCrumb />} />

          <div className="size-full rounded-[6px] p-2 lg:p-4 mt-0 lg:mt-20 relative">
            <div className="bg-white h-[94%] overflow-y-scroll relative">
              <ShopTab
                items={["All", "Men", "Women", "Kids"]}
                tabContainerClassName="bg-transparent h-full"
                tabListClassName="w-full text-[0.875rem] text-neutral-700 border-b border-neutral-100 p-[0.254rem] bg-white mb-2"
                activeTabClassName="bg-primary-900 text-white rounded-t-md"
              >
                <AllItems userPage="dashboard" />
                <MenShop />
                <WomenShop />
                <KidsShop />
              </ShopTab>
            </div>
          </div>
        </div>
      </SearchProvider>
    </UserDashboardLayout>
  );
}



