import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { useAdminRecentActivities } from "../../../../hooks/admin-dashboard.hooks";
import {
  formatCurrency,
  formatDate,
} from "../../../../utils/admin-dashboard-utils";
import Spinner from "../../../../shared-components/spinner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { orderStatuses } from "../../_data/_overview";
import { useAdminOrder } from "../../../../hooks/admin-orders.hooks";
import type { AdminOrder } from "../../../../services/admin-orders.service";
/* ------------------------------------------------------------------------------------------------ */

export function OverviewTable() {
  const {
    data: recentActivities,
    isLoading,
    error,
  } = useAdminRecentActivities();

  const activities = recentActivities?.recentActivities || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="md" speed="fast" arcColor="#9a6c50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">
          Unable load recent activities. Click{" "}
          <span className="underline" onClick={() => window.location.reload()}>
            here
          </span>{" "}
          to reload.
        </p>
      </div>
    );
  }

  const ViewMoreDrawer = ({ orderId }: { orderId: string }) => {
    const { isLoading, isSuccess, data, refetch } =
      useAdminOrder(orderId);

    const orderData = data ? data : ({} as AdminOrder);

    const customerName = orderData.user
      ? `${orderData.user.firstName} ${orderData.user.lastName}`
      : "...";

    return (
      <Drawer>
        <DrawerTrigger
          className="text-[#9A6C50] hover:text-[#7A5C40] transition-colors"
          onClick={() => refetch()}
          aria-describedby="order-management-trigger"
        >
          View details
        </DrawerTrigger>

        <DrawerContent
          className="w-[38.313rem] p-4"
          aria-describedby="order-management-detail"
        >
          <DrawerHeader>
            {isSuccess && !data ? (
              <div className="flex items-center justify-center">
                <span className="text-neutral-300">...</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <DrawerClose>
                  <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
                    <ArrowLeftIcon />
                  </div>
                </DrawerClose>

                <DrawerTitle className="font-inter text-[#494949] font-medium">
                  Order ID: {data?.id.substring(0, 6)} ...
                </DrawerTitle>

                {(() => {
                  const status = orderData.status;
                  const style = orderStatuses.find((s) => s.status === status);

                  return (
                    <div
                      className={`px-2 py-1 text-xs rounded-full w-fit ${
                        style
                          ? `${style.bgColor} ${style.textColor}`
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {status}
                    </div>
                  );
                })()}
              </div>
            )}
          </DrawerHeader>

          {isLoading && (
            <div className="size-full flex items-center justify-center">
              <Spinner
                isLoading={isLoading}
                size="md"
                speed="fast"
                arcColor="#9A6C50"
              />
            </div>
          )}

          {isSuccess && !data && (
            <div className="size-full">
              <p className="text-neutral-300 font-medium">No order detail</p>
            </div>
          )}

          {isSuccess && data && (
            <div className="w-full flex flex-col items-center gap-4 divide-y divide-neutral-200 overflow-y-scroll pb-2">
              {/* Order information */}
              <div className="w-full py-[12px] px-4 flex flex-col justify-center gap-4">
                <h3 className="w-full text-neutral-700 font-inter font-medium">
                  Order Information
                </h3>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Order Date & Time:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {orderData.createdAt}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Dress:
                  </span>
                  {/* <span className="text-neutral-600 text-[14px] font-medium">{orderData.}</span> */}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Dress Size:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    Yellow & Black
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Quantity:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    2
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Amount:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    ₦200,000.00
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Payment Method:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    Card
                  </span>
                </div>
              </div>

              {/* Delivery information */}
              <div className="w-full py-[12px] px-4 flex flex-col justify-center gap-4">
                <h3 className="w-full text-neutral-700 font-inter font-medium">
                  Delivery Information
                </h3>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Delivery Date & Time:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {orderData.deliveryDate ? orderData.deliveryDate : "..."}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Customer Name
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {customerName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Email:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {orderData.user ? orderData.user.email : "..."}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Address:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {orderData.user ? orderData.user.deliveryAddress : "..."}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    City:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {orderData.user ? orderData.user.email : "..."}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Phone:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {orderData.user ? orderData.user.phoneNumber : "..."}
                  </span>
                </div>
              </div>

              {/* Rider information */}
              <div className="w-full py-[12px] px-4 flex flex-col justify-center gap-4">
                <h3 className="w-full text-neutral-700 font-inter font-medium">
                  Rider Information
                </h3>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Rider’s Name:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {orderData.rider ? orderData.rider.name : "..."}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[14px] font-light">
                    Rider’s Phone Number:
                  </span>
                  <span className="text-neutral-600 text-[14px] font-medium">
                    {orderData.rider ? orderData.rider.phone : "..."}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <div>
      {activities.length === 0 ? (
        <span className="block text-center text-[#5D5D5D]">
          No recent activity yet.
        </span>
      ) : (
        <div className="overflow-hidden border border-[#EAECF0] bg-white shadow-[0px_2px_4px_-2px_#1018280F,0px_4px_8px_-2px_#1018281A] rounded-lg">
          <Table>
            <TableHeader className="!border-b-0">
              <TableRow className="!border-0 h-11 text-[#3D3D3D]">
                <TableHead className="text-[#3D3D3D] border-0 pl-6 !border-b-0">
                  Customer Name
                </TableHead>
                <TableHead className="text-[#3D3D3D] border-0 !border-b-0">
                  Activity Type
                </TableHead>
                <TableHead className="text-[#3D3D3D] border-0 !border-b-0">
                  Amount Spent (₦)
                </TableHead>
                <TableHead className=" text-[#3D3D3D] border-0 !border-b-0">
                  Date & Time
                </TableHead>
                <TableHead className=" text-[#3D3D3D] border-0 !border-b-0">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, idx) => (
                <TableRow
                  key={activity.id}
                  className={`border-0  h-20 text-sm font-inter text-[#4F4F4F] font-light  ${
                    idx % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
                  }`}
                >
                  <TableCell className="pl-6">
                    {activity.customerName}
                  </TableCell>
                  <TableCell>{activity.activityType}</TableCell>
                  <TableCell>{formatCurrency(activity.amountSpent)}</TableCell>
                  <TableCell className="">
                    {formatDate(activity.dateTime)}
                  </TableCell>
                  <TableCell className="tt">
                    <ViewMoreDrawer orderId={activity.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
