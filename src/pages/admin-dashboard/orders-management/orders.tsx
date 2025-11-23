import { orderStatuses } from "../_data/_overview";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/order-management-tab";
import { DataTable } from "../admin-components/orderTable/order-data-table";
import { useAdminOrders } from "../../../hooks/admin-orders.hooks";
import { convertApiOrdersToTableFormat } from "../../../utils/admin-orders-utils";
import Spinner from "../../../shared-components/spinner";
import {
  PendingTab,
  ApprovedTab,
  PackagingTab,
  OutForDeliveryTab,
  DeliveredTab,
  CompleteTab,
  CanceledTab,
} from "../admin-components/orderTable/order-table-tabs";

/* --------------------------------------------------------------------------------------------- */

const Orders = () => {
  // Fetch all orders
  const {
    data: allOrders,
    isLoading: allOrdersLoading,
    error: allOrdersError,
  } = useAdminOrders();

  // Convert API data to table format
  const allOrdersData = allOrders
    ? convertApiOrdersToTableFormat(allOrders.data)
    : [];

  if (allOrdersError) {
    return (
      <div className="mt-5 h-full bg-white px-4 py-2 relative rounded-md">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">
            Unable to load orders. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 h-full bg-white px-4 py-2 relative rounded-md">
        <Tabs defaultValue="all-orders" className="w-full">
          <div>
            <TabsList className="w-fit h-11 mb-0">
              <TabsTrigger value="all-orders">All Orders</TabsTrigger>
              {orderStatuses.map((statusObj) => (
                <TabsTrigger key={statusObj.status} value={statusObj.status}>
                  {statusObj.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* All orders tab */}
          <TabsContent
            value="all-orders"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            {allOrdersLoading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner
                  size="lg"
                  speed="fast"
                  isLoading={allOrdersLoading}
                  arcColor="#9A6C50"
                />
              </div>
            ) : (
              <DataTable data={allOrdersData} tableLabel="all-table" />
            )}
          </TabsContent>

          {/* Pending orders tab */}
          <TabsContent
            value="pending"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <PendingTab />
          </TabsContent>

          <TabsContent
            value="approved"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <ApprovedTab />
          </TabsContent>

          <TabsContent
            value="packaging"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <PackagingTab />
          </TabsContent>

          <TabsContent
            value="out-for-delivery"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <OutForDeliveryTab />
          </TabsContent>

          <TabsContent
            value="delivered"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <DeliveredTab />
          </TabsContent>

          <TabsContent
            value="complete"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <CompleteTab />
          </TabsContent>

          <TabsContent
            value="canceled"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <CanceledTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Orders;
