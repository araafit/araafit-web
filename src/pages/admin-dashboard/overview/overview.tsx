import {
  ArrowRightIcon,
  CaretRightIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import { OverviewCards } from "../_data/_overview";
import { Link } from "react-router-dom";
import { OverviewTable } from "../admin-components/overViewTable/overview-data-table";
import Button from "../../../shared-components/button";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import Overview from "../admin-components/top-overview-items";

export function AdminDashboardOverview() {
  const title = (
    <div className="font-lora text-[#979797]">
      Welcome, <span className="font-lora text-[#1C1C1C]">Eni</span>
    </div>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Overview</span>
    </div>
  );

  return (
    <AdminDashboardLayout>
      <div className="h-screen">
        <div className="flex flex-col gap-2 relative">
          <TopBar
            title={title}
            breadCrumb={<BreadCrumb />}
            rightSide={
              <>
                <NotificationBell />

                <Button
                  text="Add Inventory"
                  icon={<PlusIcon className="size-[1.25rem] text-white" />}
                  variant="solid"
                  className="text-white shadow-sm"
                />
              </>
            }
          />
        </div>

        <div className="w-full  flex flex-col gap-4 p-4 mt-20 overflow-y-scroll px-10">
          <Overview
            title="Overview"
            subtitle="Track orders, monitor requests, and stay updated."
            cards={OverviewCards}
          />

          {/* */}
          <div className="w-full  bg-transparent  flex flex-col lg:flex-row gap-6">
            <div className=" lg:w-[35.438rem] bg-white rounded-md px-4 py-6 items-center justify-between ">
              <div className="flex items-center justify-between w-full">
                <h2 className="font-medium text-[28px] capitalize">
                  New Orders
                </h2>
                <Link to="" className="text-[#5D5D5D] capitalize">
                  SEE ALL
                </Link>
              </div>
              <div className="w-full border border-[#E8E8E8] flex flex-col items-start px-4 py-3 rounded-md mt-6">
                <div className="text-[#F59E0B] bg-[#FEF3C7] px-2 text-xs py-1 inline-flex w-auto  rounded-full">
                  Pending
                </div>
                <div className="flex items-center justify-between w-full mt-3">
                  <span className="text-xs text-[#5D5D5D]">192353</span>
                  <span className="text-sm text-[#3D3D3D] font-medium">
                    ₦80,000.00
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-[#3D3D3D] font-medium block text-sm">
                    {" "}
                    Araafit All Blue Jumpsuit
                  </span>
                  <span className="text-[#6D6D6D] text-xs">
                    15 May 2025 6:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#9A6C50] cursor-pointer mt-2">
                  <span>View Order</span>{" "}
                  <span>
                    <ArrowRightIcon />
                  </span>
                </div>
                <div className="bg-[#F0F2F5] h-[0.094rem] my-3 rounded-full w-full"></div>
                <div className="flex items-center gap-4 w-full">
                  <span className="text-[#16A34A] text-sm cursor-pointer">
                    Approve
                  </span>
                  <span className="text-[#DC2626] text-sm cursor-pointer">
                    Reject
                  </span>
                </div>
              </div>
            </div>
            {/*  */}
            <div className=" lg:w-[35.438rem] flex-auto bg-white rounded-md px-4 py-6 items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <h2 className="font-medium text-[28px] capitalize">
                  Tailoring Requests
                </h2>
                <Link to="" className="text-[#5D5D5D] ">
                  SEE ALL
                </Link>
              </div>
              s
              <div className="w-full border border-[#E8E8E8] flex flex-col items-start px-4 py-3 rounded-md mt-6">
                <div className="text-[#F59E0B] bg-[#FEF3C7] px-2 text-xs py-1 inline-flex w-auto  rounded-full">
                  Pending
                </div>
                <div className="flex items-center justify-between w-full mt-3">
                  <span className="text-xs text-[#5D5D5D]">192353</span>
                  <span className="text-sm text-[#3D3D3D] font-medium">
                    ₦80,000.00
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-[#3D3D3D] font-medium block text-sm">
                    {" "}
                    Araafit All Blue Jumpsuit
                  </span>
                  <span className="text-[#6D6D6D] text-xs">
                    15 May 2025 6:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#9A6C50] cursor-pointer mt-2">
                  <span>View Order</span>{" "}
                  <span>
                    <ArrowRightIcon />
                  </span>
                </div>
                <div className="bg-[#F0F2F5] h-[0.094rem] my-3 rounded-full w-full"></div>
                <div className="flex items-center gap-4 w-full">
                  <span className="text-[#16A34A] text-sm cursor-pointer">
                    Approve
                  </span>
                  <span className="text-[#DC2626] text-sm cursor-pointer">
                    Reject
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="w-full bg-white rounded-sm px-4 py-6 flex flex-col gap-6">
            <div className="w-full flex justify-between items-center">
              <h2 className="font-semibold text-[28px] capitalize">
                Recent Activity
              </h2>

              <Link
                to="/admin-dashboard/recent-activity"
                className="text-[#5D5D5D] "
              >
                SEE ALL
              </Link>
            </div>
            <OverviewTable />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
