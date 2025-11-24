import { orderStatuses } from "../_data/_overview";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/order-management-tab";
import {
  AllOrdersTab,
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
            <AllOrdersTab />
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
