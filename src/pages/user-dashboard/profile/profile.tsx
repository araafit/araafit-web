import { CaretRightIcon } from "@phosphor-icons/react";
import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import Tab from "../../../shared-components/tab";
import TopBar from "../top-bar";
import Measurements from "./measurement/measurements";
// import BillingCards from "./billing-card/card";
import Notification from "./notification";
import ProfileSettings from "./profile-settings/profile-settings";
import { useSearchParams } from "react-router-dom";

/* ------------------------------------------------------------------- */

/**
 * Dashboard home page
 *
 * @returns ReactElement
 */
export function DashboardProfilePage() {
  const [searchParams] = useSearchParams();
  const tabParam = (searchParams.get("tab") || "").toLowerCase();
  const defaultTabIndex =
    tabParam === "measurement" || tabParam === "measurements" || tabParam === "1"
      ? 1
      : 0;
  const tabItems = ["My Profile", "My Measurement", "Notification"];

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Profile</span>
    </div>
  );

  return (
    <UserDashboardLayout>
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="Profile" breadCrumb={<BreadCrumb />} />

        <div className="w-full h-[95%] flex flex-col gap-4 p-2 lg:p-4 mt-16 lg:mt-20 overflow-y-scroll">
          <Tab
            items={tabItems}
            defaultTab={defaultTabIndex}
            tabContainerClassName="bg-transparent h-full"
            tabListClassName="w-full max-w-fit text-xs lg:text-[0.875rem] text-neutral-700 border border-neutral-100 p-1 lg:p-[0.254rem] bg-transparent rounded-md flex-inline flex-nowrap overflow-x-auto lg:flex-wrap"
            activeTabClassName="bg-primary-900 text-white rounded-md"
          >
            <ProfileSettings />
            <Measurements />
            {/* <BillingCards /> */}
            <Notification />
          </Tab>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
