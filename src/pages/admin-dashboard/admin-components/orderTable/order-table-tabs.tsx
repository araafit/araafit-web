import { DataTable } from "./order-data-table";
import { useAdminOrders } from "../../../../hooks/admin-orders.hooks";
import { convertApiOrdersToTableFormat } from "../../../../utils/admin-orders-utils";
import Spinner from "../../../../shared-components/spinner";
import { useState } from "react";

/* -------------------------------- Fetch Orders By Status ------------------------------------------ */

export const PendingTab = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const { data: pendingOrders, isLoading: pendingLoading } = useAdminOrders({
    status: "pending",
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });

  // Convert API data to table format
  const pendingData = pendingOrders
    ? convertApiOrdersToTableFormat(pendingOrders.data)
    : [];

  let tablePagination = { page: 1, limit: 10, total: 5, setPagination };

  if (pendingOrders) {
    tablePagination = { ...tablePagination, ...pendingOrders.meta };
  }

  if (pendingLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner
          size="lg"
          speed="fast"
          isLoading={pendingLoading}
          arcColor="#9A6C50"
        />
      </div>
    );
  }

  return (
    <DataTable
      data={pendingData}
      tableLabel="pending"
      tablePagination={tablePagination}
    />
  );
};

export const ApprovedTab = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data: approvedOrders, isLoading: approvedLoading } = useAdminOrders({
    status: "approved",
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });

  // Convert API data to table format
  const approvedData = approvedOrders
    ? convertApiOrdersToTableFormat(approvedOrders.data)
    : [];

  let tablePagination = { page: 1, limit: 10, total: 5, setPagination };

  if (approvedOrders) {
    tablePagination = { ...tablePagination, ...approvedOrders.meta };
  }

  if (approvedLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner
          size="lg"
          speed="fast"
          isLoading={approvedLoading}
          arcColor="#9A6C50"
        />
      </div>
    );
  }

  return (
    <DataTable
      data={approvedData}
      tableLabel="approved"
      tablePagination={tablePagination}
    />
  );
};

export const PackagingTab = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data: packagingOrders, isLoading: approvedLoading } = useAdminOrders({
    status: "packaging",
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });

  // Convert API data to table format
  const packagingData = packagingOrders
    ? convertApiOrdersToTableFormat(packagingOrders.data)
    : [];

  let tablePagination = { page: 1, limit: 10, total: 5, setPagination };

  if (packagingOrders) {
    tablePagination = { ...tablePagination, ...packagingOrders.meta };
  }

  if (approvedLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner
          size="lg"
          speed="fast"
          isLoading={approvedLoading}
          arcColor="#9A6C50"
        />
      </div>
    );
  }

  return (
    <DataTable
      data={packagingData}
      tableLabel="packaged"
      tablePagination={tablePagination}
    />
  );
};

export const OutForDeliveryTab = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  // Fetch orders by status
  const { data: outForDeliveryOrders, isLoading: outForDeliveryLoading } =
    useAdminOrders({
      status: "out_for_delivery",
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    });

  // Convert API data to table format
  const outForDeliveryOrdersData = outForDeliveryOrders
    ? convertApiOrdersToTableFormat(outForDeliveryOrders.data)
    : [];

  let tablePagination = { page: 1, limit: 10, total: 5, setPagination };

  if (outForDeliveryOrders) {
    tablePagination = { ...tablePagination, ...outForDeliveryOrders.meta };
  }

  if (outForDeliveryLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner
          size="lg"
          speed="fast"
          isLoading={outForDeliveryLoading}
          arcColor="#9A6C50"
        />
      </div>
    );
  }

  return (
    <DataTable
      data={outForDeliveryOrdersData}
      tableLabel="out-for-delivery"
      tablePagination={tablePagination}
    />
  );
};

export const DeliveredTab = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  // Fetch orders by status
  const { data: deliveredOrders, isLoading: deliveredLoading } = useAdminOrders(
    {
      status: "delivered",
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    }
  );

  // Convert API data to table format
  const deliveredOrdersData = deliveredOrders
    ? convertApiOrdersToTableFormat(deliveredOrders.data)
    : [];

  let tablePagination = { page: 1, limit: 10, total: 5, setPagination };

  if (deliveredOrders) {
    tablePagination = { ...tablePagination, ...deliveredOrders.meta };
  }

  if (deliveredLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner
          size="lg"
          speed="fast"
          isLoading={deliveredLoading}
          arcColor="#9A6C50"
        />
      </div>
    );
  }

  return (
    <DataTable
      data={deliveredOrdersData}
      tableLabel="delivered"
      tablePagination={tablePagination}
    />
  );
};

export const CompleteTab = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  // Fetch orders by status
  const { data: completeOrders, isLoading: completeLoading } = useAdminOrders({
    status: "complete",
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });

  // Convert API data to table format
  const completeOrdersData = completeOrders
    ? convertApiOrdersToTableFormat(completeOrders.data)
    : [];

  let tablePagination = { page: 1, limit: 10, total: 5, setPagination };

  if (completeOrders) {
    tablePagination = { ...tablePagination, ...completeOrders.meta };
  }

  if (completeLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner
          size="lg"
          speed="fast"
          isLoading={completeLoading}
          arcColor="#9A6C50"
        />
      </div>
    );
  }

  return (
    <DataTable
      data={completeOrdersData}
      tableLabel="complete"
      tablePagination={tablePagination}
    />
  );
};

export const CanceledTab = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  // Fetch orders by status
  const { data: cancelledOrders, isLoading: cancelledLoading } = useAdminOrders(
    {
      status: "cancelled",
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    }
  );

  // Convert API data to table format
  const cancelledOrdersData = cancelledOrders
    ? convertApiOrdersToTableFormat(cancelledOrders.data)
    : [];

  let tablePagination = { page: 1, limit: 10, total: 5, setPagination };

  if (cancelledOrders) {
    tablePagination = { ...tablePagination, ...cancelledOrders.meta };
  }

  if (cancelledLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner
          size="lg"
          speed="fast"
          isLoading={cancelledLoading}
          arcColor="#9A6C50"
        />
      </div>
    );
  }

  return (
    <DataTable
      data={cancelledOrdersData}
      tableLabel="canceled"
      tablePagination={tablePagination}
    />
  );
};
