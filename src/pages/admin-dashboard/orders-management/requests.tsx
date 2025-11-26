import { sewingRequestStatuses } from "../_data/_overview";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/order-management-tab";
import {
  AllRequestsTab,
  PendingTab,
  ApprovedTab,
  SewingTab,
  OutForDeliveryTab,
  DeliveredTab,
  CompletedTab,
  CanceledTab,
} from "../admin-components/orderTable/requests-table-tabs";
/* -------------------------------------------------------------------------------------------------------- */

const Requests = () => {
  return (
    <>
      <div className="mt-5 h-full bg-white px-4 py-2 relative rounded-md">
        <Tabs defaultValue="all-requests" className="w-full">
          <div>
            <TabsList className="w-fit h-11 mb-6">
              <TabsTrigger value="all-requests">All Requests</TabsTrigger>
              {sewingRequestStatuses.map((statusObj) => (
                <TabsTrigger
                  key={statusObj.status}
                  value={statusObj.status.toLowerCase()}
                  className=""
                >
                  {statusObj.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent
            value="all-requests"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <AllRequestsTab />
          </TabsContent>

          {/* Status-specific tabs */}
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
            value="sewing"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <SewingTab />
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
            value="completed"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            <CompletedTab />
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

export default Requests;