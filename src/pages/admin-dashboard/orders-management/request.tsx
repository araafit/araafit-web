import { orderStatuses } from "../_data/_overview";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/order-management-tab";
import { DataTable } from "../admin-components/orderTable/request-data-table";
import { useAdminSewingRequests } from "../../../hooks/admin-sewing-requests.hooks";
import { convertApiSewingRequestsToTableFormat } from "../../../utils/admin-sewing-requests-utils";
import Spinner from "../../../shared-components/spinner";

const Requests = () => {
  // Fetch all sewing requests
  const {
    data: allRequests,
    isLoading: allRequestsLoading,
    error: allRequestsError,
  } = useAdminSewingRequests();

  // Fetch requests by status
  const { data: pendingRequests, isLoading: pendingLoading } =
    useAdminSewingRequests({ status: "pending" });
  const { data: approvedRequests, isLoading: approvedLoading } =
    useAdminSewingRequests({ status: "approved" });
  const { data: sewingRequests, isLoading: sewingLoading } =
    useAdminSewingRequests({ status: "sewing" });
  const { data: packagingRequests, isLoading: packagingLoading } =
    useAdminSewingRequests({ status: "packaging" });
  const { data: outForDeliveryRequests, isLoading: outForDeliveryLoading } =
    useAdminSewingRequests({ status: "out_for_delivery" });
  const { data: deliveredRequests, isLoading: deliveredLoading } =
    useAdminSewingRequests({ status: "delivered" });
  const { data: completeRequests, isLoading: completeLoading } =
    useAdminSewingRequests({ status: "complete" });
  const { data: cancelledRequests, isLoading: cancelledLoading } =
    useAdminSewingRequests({ status: "cancelled" });

  // Convert API data to table format
  const allRequestsData = allRequests
    ? convertApiSewingRequestsToTableFormat(allRequests.items)
    : [];
  const pendingRequestsData = pendingRequests
    ? convertApiSewingRequestsToTableFormat(pendingRequests.items)
    : [];
  const approvedRequestsData = approvedRequests
    ? convertApiSewingRequestsToTableFormat(approvedRequests.items)
    : [];
  const sewingRequestsData = sewingRequests
    ? convertApiSewingRequestsToTableFormat(sewingRequests.items)
    : [];
  const packagingRequestsData = packagingRequests
    ? convertApiSewingRequestsToTableFormat(packagingRequests.items)
    : [];
  const outForDeliveryRequestsData = outForDeliveryRequests
    ? convertApiSewingRequestsToTableFormat(outForDeliveryRequests.items)
    : [];
  const deliveredRequestsData = deliveredRequests
    ? convertApiSewingRequestsToTableFormat(deliveredRequests.items)
    : [];
  const completeRequestsData = completeRequests
    ? convertApiSewingRequestsToTableFormat(completeRequests.items)
    : [];
  const cancelledRequestsData = cancelledRequests
    ? convertApiSewingRequestsToTableFormat(cancelledRequests.items)
    : [];

  if (allRequestsError) {
    return (
      <div className="mt-5 h-full bg-white px-4 py-2 relative rounded-md">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">
            Failed to load sewing requests. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 h-full bg-white px-4 py-2 relative rounded-md">
        <Tabs defaultValue="All Requests" className="w-full">
          <div>
            <TabsList className="w-fit h-11 mb-6">
              <TabsTrigger value="All Requests">All Requests</TabsTrigger>
              {orderStatuses.map((statusObj) => (
                <TabsTrigger key={statusObj.status} value={statusObj.status}>
                  {statusObj.status}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent
            value="All Requests"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            {allRequestsLoading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner
                  size="lg"
                  speed="fast"
                  isLoading={allRequestsLoading}
                  arcColor="#9A6C50"
                />
              </div>
            ) : (
              <DataTable data={allRequestsData} tableLabel="all-requests" />
            )}
          </TabsContent>

          {/* Status-specific tabs */}
          <TabsContent
            value="Pending"
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
              <DataTable data={pendingRequestsData} tableLabel="pending" />
            )}
          </TabsContent>

          <TabsContent
            value="Approved"
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
              <DataTable data={approvedRequestsData} tableLabel="approved" />
            )}
          </TabsContent>

          <TabsContent
            value="Sewing"
            className="relative flex flex-col gap-4 overflow-auto"
          >
            {sewingLoading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner
                  size="lg"
                  speed="fast"
                  isLoading={sewingLoading}
                  arcColor="#9A6C50"
                />
              </div>
            ) : (
              <DataTable data={sewingRequestsData} tableLabel="sewing" />
            )}
          </TabsContent>

          <TabsContent
            value="Packaging"
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
              <DataTable data={packagingRequestsData} tableLabel="packaged" />
            )}
          </TabsContent>

          <TabsContent
            value="Out for Delivery"
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
              <DataTable
                data={outForDeliveryRequestsData}
                tableLabel="out-for-delivery"
              />
            )}
          </TabsContent>

          <TabsContent
            value="Delivered"
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
              <DataTable data={deliveredRequestsData} tableLabel="delivered" />
            )}
          </TabsContent>

          <TabsContent
            value="Complete"
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
              <DataTable data={completeRequestsData} tableLabel="complete" />
            )}
          </TabsContent>

          <TabsContent
            value="Canceled"
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
              <DataTable data={cancelledRequestsData} tableLabel="canceled" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Requests;
