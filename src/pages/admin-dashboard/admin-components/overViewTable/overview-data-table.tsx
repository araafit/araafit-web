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
import InfoSection from "../orderTable/info-section";
import { useMemo } from "react";
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
    const { isLoading, isSuccess, data, refetch } = useAdminOrder(orderId);

    const orderData = data ? data : ({} as AdminOrder);

    const customerName = orderData.user
      ? `${orderData.user.firstName} ${orderData.user.lastName}`
      : "...";

    const status = orderData.status;
    const statusStyle = orderStatuses.find(
      (s) => s.status?.toLowerCase() === status?.toLowerCase()
    );

    const orderInformation = useMemo(
      () => (
        <InfoSection
          title="Order information"
          items={[
            {
              label: "Order date & Time",
              value: orderData.createdAt
                ? orderData.createdAt.toLocaleLowerCase()
                : "...",
            },
            {
              label: "Dress",
              value: orderData.dress ? orderData.dress : "...",
            },
            { label: "Dress Size", value: "..." },
            { label: "Dress Color", value: "..." },
            { label: "Quantity", value: "..." },
            {
              label: "Amount",
              value: orderData.totalAmount ? orderData.totalAmount : "...",
            },
            { label: "Payment Method", value: "Card" },
          ]}
        />
      ),
      [orderData]
    );

    const deliveryInformation = useMemo(
      () => (
        <InfoSection
          title="Delivery Information"
          items={[
            {
              label: "Delivery date & Time",
              value: orderData.deliveryDate
                ? orderData.deliveryDate.toLocaleLowerCase()
                : "...",
            },
            {
              label: "customer Name",
              value: customerName,
            },
            {
              label: "Email",
              value: orderData.user ? orderData.user.email : "...",
            },
            {
              label: "Address",
              value: orderData.user ? orderData.user.deliveryAddress : "...",
            },
            {
              label: "City/Town",
              value: orderData.user ? orderData.user.city : "...",
            },
            {
              label: "Phone",
              value: orderData.user ? orderData.user.phoneNumber : "...",
            },
          ]}
        />
      ),
      [orderData]
    );

    const riderInformation = useMemo(
      () => (
        <InfoSection
          title="Order information"
          items={[
            {
              label: "Rider's name",
              value: orderData.rider ? orderData.rider.name : "...",
            },
            {
              label: "Rider's phone Number",
              value: orderData.rider ? orderData.rider.phone : "...",
            },
          ]}
        />
      ),
      [orderData]
    );

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
          className="h-screen w-[38.313rem] p-4 overflow-y-scroll overflow-x-hidden"
          aria-describedby="order-management-detail"
        >
          <DrawerHeader>
            {!isLoading && !data ? (
              <div className="flex items-center justify-center">
                <span className="text-primary-500">...</span>
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

                <div
                  className={`px-2 py-1 text-xs rounded-full w-fit ${
                    statusStyle
                      ? `${statusStyle.bgColor} ${statusStyle.textColor}`
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status}
                </div>
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

          {!isLoading && !data && (
            <div className="size-full flex items-center justify-center">
              <p className="font-light text-primary-500">No order detail</p>
            </div>
          )}

          {isSuccess && data && (
            <div className="w-full flex flex-col items-start gap-4 divide-y divide-neutral-200 overflow-y-scroll pb-2">
              {/* Order information */}
              {orderInformation}

              {/* Delivery information */}
              {deliveryInformation}

              {/* Rider information */}
              {riderInformation}
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
