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

/* --------------------------------------------------------------------------------------------- */

const Orders = () => {
  // Fetch all orders
  const {
    data: allOrders,
    isLoading: allOrdersLoading,
    error: allOrdersError,
  } = useAdminOrders();

  // Fetch orders by status
  const { data: pendingOrders, isLoading: pendingLoading } = useAdminOrders({
    status: "pending",
  });
  const { data: approvedOrders, isLoading: approvedLoading } = useAdminOrders({
    status: "approved",
  });
  const { data: packagingOrders, isLoading: packagingLoading } = useAdminOrders(
    { status: "packaging" }
  );
  const { data: outForDeliveryOrders, isLoading: outForDeliveryLoading } =
    useAdminOrders({ status: "out_for_delivery" });
  const { data: deliveredOrders, isLoading: deliveredLoading } = useAdminOrders(
    { status: "delivered" }
  );
  const { data: completeOrders, isLoading: completeLoading } = useAdminOrders({
    status: "complete",
  });
  const { data: cancelledOrders, isLoading: cancelledLoading } = useAdminOrders(
    { status: "cancelled" }
  );

  // Convert API data to table format
  const allOrdersData = allOrders
    ? convertApiOrdersToTableFormat(allOrders.data)
    : [];
  const pendingOrdersData = pendingOrders
    ? convertApiOrdersToTableFormat(pendingOrders.data)
    : [];
  const approvedOrdersData = approvedOrders
    ? convertApiOrdersToTableFormat(approvedOrders.data)
    : [];
  const packagingOrdersData = packagingOrders
    ? convertApiOrdersToTableFormat(packagingOrders.data)
    : [];
  const outForDeliveryOrdersData = outForDeliveryOrders
    ? convertApiOrdersToTableFormat(outForDeliveryOrders.data)
    : [];
  const deliveredOrdersData = deliveredOrders
    ? convertApiOrdersToTableFormat(deliveredOrders.data)
    : [];
  const completeOrdersData = completeOrders
    ? convertApiOrdersToTableFormat(completeOrders.data)
    : [];
  const cancelledOrdersData = cancelledOrders
    ? convertApiOrdersToTableFormat(cancelledOrders.data)
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
              {pendingLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner
                    size="lg"
                    speed="fast"
                    isLoading={pendingLoading}
                    arcColor="#9A6C50"
                  />
                </div>
              ) : (
                <DataTable data={pendingOrdersData} tableLabel="pending" />
              )}
            </TabsContent>

            <TabsContent
              value="approved"
              className="relative flex flex-col gap-4 overflow-auto"
            >
              {approvedLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner
                    size="lg"
                    speed="fast"
                    isLoading={approvedLoading}
                    arcColor="#9A6C50"
                  />
                </div>
              ) : (
                <DataTable data={approvedOrdersData} tableLabel="approved" />
              )}
            </TabsContent>

            <TabsContent
              value="packaging"
              className="relative flex flex-col gap-4 overflow-auto"
            >
              {packagingLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner
                    size="lg"
                    speed="fast"
                    isLoading={packagingLoading}
                    arcColor="#9A6C50"
                  />
                </div>
              ) : (
                <DataTable data={packagingOrdersData} tableLabel="packaged" />
              )}
            </TabsContent>

            <TabsContent
              value="out-for-delivery"
              className="relative flex flex-col gap-4 overflow-auto"
            >
              {outForDeliveryLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner
                    size="lg"
                    speed="fast"
                    isLoading={outForDeliveryLoading}
                    arcColor="#9A6C50"
                  />
                </div>
              ) : (
                <DataTable data={outForDeliveryOrdersData} tableLabel="out-for-delivery" />
              )}
            </TabsContent>

            <TabsContent
              value="delivered"
              className="relative flex flex-col gap-4 overflow-auto"
            >
              {deliveredLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner
                    size="lg"
                    speed="fast"
                    isLoading={deliveredLoading}
                    arcColor="#9A6C50"
                  />
                </div>
              ) : (
                <DataTable data={deliveredOrdersData} tableLabel="delivered" />
              )}
            </TabsContent>

            <TabsContent
              value="complete"
              className="relative flex flex-col gap-4 overflow-auto"
            >
              {completeLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner
                    size="lg"
                    speed="fast"
                    isLoading={completeLoading}
                    arcColor="#9A6C50"
                  />
                </div>
              ) : (
                <DataTable data={completeOrdersData} tableLabel="complete" />
              )}
            </TabsContent>

            <TabsContent
              value="canceled"
              className="relative flex flex-col gap-4 overflow-auto"
            >
              {cancelledLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner
                    size="lg"
                    speed="fast"
                    isLoading={cancelledLoading}
                    arcColor="#9A6C50"
                  />
                </div>
              ) : (
                <DataTable data={cancelledOrdersData} tableLabel="canceled" />
              )}
            </TabsContent>
          </Tabs>
      </div>
    </>
  );
};

export default Orders;
