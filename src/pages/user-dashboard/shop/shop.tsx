import { CaretRightIcon } from "@phosphor-icons/react";
import DashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import ShopTab from "./shop-tab";
import { ShopProvider } from "./context/shop-context";
import AllItems from "./all-items";
import DressItems from "./dress-items";
import FabricItems from "./fabric-items";

/* --------------------------------------------------------------------------------- */

const BreadCrumb = () => (
  <div className="font-inter font-light capitalize flex items-center">
    <span className="text-primary-900">Araafit</span>
    <CaretRightIcon className="text-[#979797]" />
    <span className="text-[#979797]">Profile</span>
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
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="shop" breadCrumb={<BreadCrumb />} />

        <ShopProvider>
          <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
            <div className="size-full bg-white rounded-md">
              <ShopTab
                items={["All", "Dresses", "Fabrics"]}
                tabContainerClassName="bg-transparent h-full"
                tabListClassName=" text-[0.875rem] text-neutral-700 border border-neutral-100 p-[0.254rem] bg-white rounded-md"
                activeTabClassName="bg-primary-900 text-white rounded-md"
                // onChange={(item) => console.log(item)}
              >
                <AllItems />
                <DressItems />
                <FabricItems />
              </ShopTab>
            </div>
          </div>
        </ShopProvider>
      </div>
    </DashboardLayout>
  );
}
