import { DataTable } from "./order-data-table";
import { useAdminOrders } from "../../../../hooks/admin-orders.hooks";
import Spinner from "../../../../shared-components/spinner";
import { useEffect, useMemo, useState } from "react";
import { type OrderTablesType } from "./table-columns/order-columns";
import { convertApiOrdersToTableFormat } from "../../../../utils/admin-orders-utils";

/* -------------------------------------------------------------------------- */

export const OrderStatusTab = ({
  status,
  tableLabel,
}: {
  status?: string;
  tableLabel: OrderTablesType;
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
  } = useAdminOrders({
    status: status,
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });

  // Convert API data to table format
  const requestsData = requestsOrders
    ? convertApiOrdersToTableFormat(requestsOrders.data)
    : [];

  const tablePagination = useMemo(
    () => ({
      page: pagination.pageIndex - 1,
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

export const AllOrdersTab = () => (<OrderStatusTab tableLabel="all-table" />);

export const PendingTab = () => (<OrderStatusTab tableLabel="pending" status="pending" />);

export const ApprovedTab = () =>  (<OrderStatusTab tableLabel="approved" status="approved" />);

export const PackagingTab = () =>  (<OrderStatusTab tableLabel="packaged" status="packaging" />);

export const OutForDeliveryTab = () =>  (<OrderStatusTab tableLabel="out_for_delivery" status="out_for_delivery" />);

export const DeliveredTab = () =>  (<OrderStatusTab tableLabel="delivered" status="delivered" />);

export const CompleteTab = () =>  (<OrderStatusTab tableLabel="complete" status="complete" />);

export const CancelledTab = () =>  (<OrderStatusTab tableLabel="cancelled" status="cancelled" />);
