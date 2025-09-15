import GuesPageLayout from "../../../layouts/guest/guest-page-layout";
import ShopTab from "../../../shared-components/shop/shop-tab";
import AllItems from "../../../shared-components/shop/all-items";
import DressItems from "../../../shared-components/shop/dress-items";
import FabricItems from "../../../shared-components/shop/fabric-items";
import { SearchProvider } from "../../user-dashboard/shop/context/search-context";
import SearchInput from "../../user-dashboard/shop/components/search-input";

/* ------------------------------------------------------ */

/**
 *
 * @returns
 */
export function GuestShopPage() {
  return (
    <GuesPageLayout>
      <SearchProvider>
        <div className="w-full lg:w-[71.875rem] p-8 bg-white rounded-md overflow-y-scroll relative">
          {/* Search Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Shop Products</h2>
              <SearchInput />
            </div>
          </div>

          {/* Shop Tabs */}
          <div className="size-full bg-white">
            <ShopTab
              items={["All", "Dresses", "Fabrics"]}
              tabContainerClassName="bg-transparent h-full"
              tabListClassName=" text-[0.875rem] text-neutral-700 border-b border-neutral-100 p-[0.254rem] bg-white mb-2"
              activeTabClassName="bg-primary-900 text-white rounded-t-md"
            >
              <AllItems userPage="shop" />
              <DressItems userPage="shop" />
              <FabricItems userPage="shop" />
            </ShopTab>
          </div>
        </div>
      </SearchProvider>
    </GuesPageLayout>
  );
}
