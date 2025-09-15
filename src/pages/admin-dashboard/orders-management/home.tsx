import { CaretRightIcon, Spinner } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import { orderStatuses, OverviewCards2 } from "../_data/_overview";
import { TableButton } from "../../ui/button";
import { CaretDownIcon } from "@phosphor-icons/react";
import Button from "../../../shared-components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import Overview from "../admin-components/top-overview-items";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Orders from "./orders";
import Requests from "./request";
import { useAdminDashboardMetrics } from "../../../hooks/admin-dashboard.hooks";
import { convertMetricsToOverviewCards } from "../../../utils/admin-dashboard-utils";

export function AdminDashboardOrders() {
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useAdminDashboardMetrics();

  const title = (
    <div className="font-lora text-[#1C1C1C]">Order Management</div>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Order Management</span>
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
              </>
            }
          />
        </div>

        <div className="w-full  flex flex-col gap-4 p-4 mt-20 overflow-y-scroll px-10">
          {metricsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner size="lg" speed="fast" />
            </div>
          ) : metricsError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">
                Failed to load dashboard metrics. Please try again.
              </p>
            </div>
          ) : metrics ? (
            <Overview
              title="Overview"
              cards={convertMetricsToOverviewCards(metrics)}
            />
          ) : null}

          {/* */}
          <div>
            <h2 className="font-semibold text-[28px] capitalize">
              Manage Orders & Requests
            </h2>

            <span className="font-light text-neutral-400 cursor-pointer font-inter">
              Track and manage customer orders and requests.
            </span>
          </div>

          {/* -------- */}
          <Tabs defaultValue="orders" className="w-full">
            <section className="flex items-center justify-between mb-0">
              <TabsList className="w-fit border border-[#E7E7E7] rounded-lg h-11">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="past-performance">Requests</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TableButton
                      variant="outline"
                      size="sm"
                      className="w-52 h-11 border border-[#D0D5DD] text-[#676767] text-sm bg-white "
                    >
                      Change order status
                      <CaretDownIcon className="text-[#676767]" size={20} />
                    </TableButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-52 h-full flex flex-col items-start gap-3 p-3">
                    {orderStatuses.map((status) => (
                      <DropdownMenuItem
                        className={`${status.bgColor} ${status.textColor} px-2 cursor-pointer text-xs py-1   w-auto  block  rounded-full`}
                        key={status.status}
                      >
                        {status.status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  text="Save"
                  variant="solid"
                  className=" text-white w-24 h-11 shadow-sm"
                />
              </div>
            </section>
            <TabsContent
              value="orders"
              className="relative flex  flex-col gap-4 overflow-auto"
            >
              <Orders />
            </TabsContent>
            <TabsContent value="past-performance">
              <Requests />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
