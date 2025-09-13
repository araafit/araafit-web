import { orderStatuses } from "../_data/_overview";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/order-management-tab";
import { DataTable } from "../admin-components/orderTable/order-data-table";
import { orderItems } from "../_data/_overview";

const Orders = () => {
  return (
    <>
      <div className="mt-5 h-full bg-white px-4 py-2 relative rounded-md">
        <Tabs defaultValue="All Orders" className="w-full">
          <div>
            <TabsList className="w-fit h-11 mb-6">
              <TabsTrigger value="All Orders">All Orders</TabsTrigger>
              {orderStatuses.map((statusObj) => (
                <TabsTrigger key={statusObj.status} value={statusObj.status}>
                  {statusObj.status}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent
            value="All Orders"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <DataTable data={orderItems} />
          </TabsContent>

          {/* Other categories */}
          {orderStatuses.map((statusObj) => (
            <TabsContent
              key={statusObj.status}
              value={statusObj.status}
              className="relative flex flex-col gap-4 overflow-auto"
            >
              <DataTable
                data={orderItems.filter(
                  (order) => order.status === statusObj.status
                )}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default Orders;
