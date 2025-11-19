import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Overview from "../admin-components/top-overview-items";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Orders from "./orders";
import Requests from "./request";
import { useAdminDashboardMetrics } from "../../../hooks/admin-dashboard.hooks";
import { convertMetricsToOverviewCards } from "../../../utils/admin-dashboard-utils";
import Spinner from "../../../shared-components/spinner";
import Button from "../../../shared-components/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { TableButton } from "../../ui/button";
import { useState } from "react";
import { useOrderStatusContext, type OrderStatus } from "./order-table-context";
import { useUpdateBulkOrderStatus } from "../../../hooks/admin-orders.hooks";
import showToast from "../../../utils/notification";
import { notificationStyles } from "../../../style/custom";

/* ------------------------------------------------------------------------------------ */

const tableOrderStatus = [
  { label: "pending", value: "pending", style: "bg-[#FEF3C7] text-[#D97706]" },
  {
    label: "approved",
    value: "approved",
    style: "bg-[#DCFCE7] text-[#16A34A]",
  },
   {
    label: "packaging",
    value: "packaging",
    style: "bg-[#E0F2FE] text-[#0EA5E9]",
  },
  { label: "sewing", value: "sewing", style: "bg-[#F0FAFF] text-[#0EA5E9]" },
  {
    label: "out-for-delivery",
    value: "out for delivery",
    style: "bg-[#EFF4FF] text-[#2563EB]",
  },
  {
    label: "delivered",
    value: "delivered",
    style: "bg-[#ECFDF8] text-[#059669]",
  },
  {
    label: "complete",
    value: "complete",
    style: "bg-[#F1F5F9] text-[#475569]",
  },
  {
    label: "canceled",
    value: "canceled",
    style: "bg-[#FEE2E2] text-[#991B1B]",
  },
  {
    label: "rejected",
    value: "rejected",
    style: "bg-[#FEE2E2] text-[#f10606]",
  },
];

export function AdminDashboardOrders() {
  const [orderStatus, setOrderStatus] = useState<null | string>(null);
  const { selectedTableRow, setSelectedTableRow } = useOrderStatusContext();
  const { bulkUpdate, isUpdating } = useUpdateBulkOrderStatus();

  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useAdminDashboardMetrics();

  const handleBulkUpdateOnChange = async (orders: OrderStatus[]) => {
    if (!orderStatus) {
      showToast.warning("Please select order status", {
        style: notificationStyles.alertWarning,
        icon: null,
      });
      return;
    }

    if (orders.length === 0) return;

    const orderToUpdate = orders?.map((order) => ({
      id: order.orderId,
      status: (orderStatus as string).toLowerCase(),
    }));

    const result = await bulkUpdate(orderToUpdate);

    if (result.errors.length > 0) {
      console.error("Failed orders:", result.errors);
      // Could show a modal with error details
    }

    // Clear selected table rows and reset status dropdown
    if (result.successful > 0) {
      setSelectedTableRow({
        orders: [],
        request: [],
        shouldClearSelection: true,
      });
      setOrderStatus(null);
    }
  };

  // Get style of selected order status to show after dropdown selection.
  const selectedOrderStatusStyle = tableOrderStatus.find(
    (status) => status.value === orderStatus
  );

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
              <Spinner
                size="lg"
                speed="fast"
                isLoading={metricsLoading}
                arcColor="#9A6C50"
              />
            </div>
          ) : metricsError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">Unable to load dashboard metrics.</p>
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
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                    disabled={selectedTableRow.orders?.length === 0}
                  >
                    <TableButton
                      variant="outline"
                      size="sm"
                      className="w-52 h-11 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between"
                    >
                      <span
                        className={`capitalize ${
                          selectedOrderStatusStyle &&
                          selectedOrderStatusStyle.style
                        } text-xs py-1 w-auto rounded-full px-2`}
                      >
                        {!orderStatus ? ` Change order status` : orderStatus}
                      </span>
                      <CaretDownIcon className="text-[#676767]" size={20} />
                    </TableButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-52 h-full flex flex-col items-start gap-3 p-3 z-20 bg-[#FFFFFF] border border-gray-100 rounded-md mt-2">
                    {tableOrderStatus.map((status) => (
                      <DropdownMenuItem
                        className={`${status.style} px-2 cursor-pointer text-xs py-1 w-auto  block  rounded-full`}
                        key={status.label}
                        onClick={() => setOrderStatus(status.value)}
                      >
                        {status.value}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="solid"
                  disabled={selectedTableRow.orders?.length === 0}
                  className="text-white w-32 h-11 shadow-sm disabled:opacity-50"
                  onClick={() =>
                    handleBulkUpdateOnChange(
                      selectedTableRow.orders ? selectedTableRow.orders : []
                    )
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Save</span>
                    <Spinner
                      isLoading={isUpdating}
                      speed="fast"
                      size="sm"
                      arcColor="#ffff"
                    />
                  </div>
                </Button>
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
