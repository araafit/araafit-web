import React from "react";
import SearchInput from "../components/search-input";
import UserDashboardLayout from "../../../../layouts/user-dashboard/dashboard-layout";
import { SearchProvider } from "./search-context";
import { CaretRightIcon } from "@phosphor-icons/react";
import TopBar from "../../top-bar";
import { useLocation } from "react-router-dom";

/* ------------------------------------------------------------------------------------- */

const BreadCrumb = () => {
    const breadcrumbPaths = ["all", "men", "women", "kids"];

    const params = useLocation();
    const segments = params.pathname.trim().split("/").filter(Boolean);
    const active = segments[segments.length - 1] || "all";
    const label = breadcrumbPaths.includes(active) ? active : "all";

  return (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{label}</span>
    </div>
  );
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserDashboardLayout>
      <SearchProvider>
        <div className="h-screen flex flex-col gap-2 relative overflow-y-hidden">
          <TopBar title="shop" breadCrumb={<BreadCrumb />} />

          <div className="size-full rounded-[6px] p-2 lg:p-4 mt-0 lg:mt-20 relative">
            <div className="bg-white h-[94%] overflow-y-scroll relative">
              <div className="w-full sticky top-0 left-0 z-10 bg-white flex items-center justify-between p-4">
                <SearchInput />
              </div>

              {children}
            </div>
          </div>
        </div>
      </SearchProvider>
    </UserDashboardLayout>
  );
}
