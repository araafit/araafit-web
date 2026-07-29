import { DataTable } from "./request-data-table";
import { useAdminSewingRequests } from "../../../../hooks/admin-sewing-requests.hooks";
import { convertApiSewingRequestsToTableFormat } from "../../../../utils/admin-sewing-requests-utils";
import Spinner from "../../../../shared-components/spinner";
import { useEffect, useMemo, useState } from "react";
import { type RequestTablesType } from "./table-columns/request-columns";

/* -------------------------------------------------------------------------- */

// Fetch Requests By Status
export const RequestsStatusTab = ({
  status,
  tableLabel,
}: {
  status?: string;
  tableLabel: RequestTablesType;
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 0,
    total: 0,
  });

  const {
    data: requestsOrders,
    isLoading,
    isSuccess,
  } = useAdminSewingRequests({
    status: status,
    page: pagination.pageIndex - 1,
    limit: pagination.pageSize,
  });

  // Convert API data to table format
  const requestsData = requestsOrders
    ? convertApiSewingRequestsToTableFormat(requestsOrders.items)
    : [];

  const tablePagination = useMemo(
    () => ({
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      total: pagination.total,
      setPagination,
    }),
    [pagination]
  );

  useEffect(() => {
    if (isSuccess && requestsOrders) {
      setPagination(() => ({
        pageIndex: requestsOrders.meta.page,
        pageSize: requestsOrders.meta.limit,
        total: requestsOrders.meta.total,
      }));
    }
  }, [isSuccess, requestsOrders]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner
          size="lg"
          speed="fast"
          isLoading={isLoading}
          arcColor="#9A6C50"
        />
      </div>
    );
  }

  return (
    <DataTable
      data={requestsData}
      tableLabel={tableLabel}
      tablePagination={tablePagination}
    />
  );
};

export const AllRequestsTab = () => (
  <RequestsStatusTab tableLabel="all-requests" />
);

export const PendingTab = () => (
  <RequestsStatusTab status="pending" tableLabel="pending" />
);

export const ApprovedTab = () => (
  <RequestsStatusTab status="approved" tableLabel="approved" />
);

export const SewingTab = () => (
  <RequestsStatusTab status="sewing" tableLabel="sewing" />
);

export const PackagingTab = () => (
  <RequestsStatusTab status="packaging" tableLabel="packaged" />
);

export const OutForDeliveryTab = () => (
  <RequestsStatusTab status="out_for_delivery" tableLabel="out-for-delivery" />
);

export const DeliveredTab = () => (
  <RequestsStatusTab status="delivered" tableLabel="delivered" />
);

export const CompleteTab = () => (
  <RequestsStatusTab status="complete" tableLabel="complete" />
);

export const CancelledTab = () => (
  <RequestsStatusTab status="cancelled" tableLabel="cancelled" />
);
