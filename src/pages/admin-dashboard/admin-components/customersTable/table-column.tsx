import { CaretUpDownIcon } from "@phosphor-icons/react";
import { getCustomerStatusClasses } from "../../../../utils/admin-customers-utils";
import CustomerActions from "../../customers/customer-action";
import type { ColumnDef } from "@tanstack/react-table";

/* -----------------------------------------------------------------------------  */

export const tableColumns: ColumnDef<{
  orderId: string;
  deliveryInformation: {
    name: string;
    email: string;
  };
  TotalAmount: number;
  Date: string;
  status: "Active" | "Blocked" | "Inactive";
}>[] = [
  {
    accessorKey: "deliveryInformation.name",
    header: () => (
      <div className="w-full text-center flex items-center justify-start gap-4">
        Customer Name <CaretUpDownIcon />
      </div>
    ),
    cell: ({ row }) => {
      const delivery = row.original.deliveryInformation;
      return (
        <div className="text-wrap truncate">
          {delivery ? delivery.name : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "deliveryInformation.email",
    header: "Email Address",
    cell: ({ row }) => {
      const delivery = row.original.deliveryInformation;
      return (
        <div className="text-wrap truncate">
          {delivery ? delivery.email : "N/A"}
        </div>
      );
    },
  },

  {
    accessorKey: "TotalAmount",
    header: () => (
      <div className="flex gap-1 items-center ">
        Amount (₦)
        <CaretUpDownIcon />
      </div>
    ),
    cell: ({ row }) => {
      const amount = Number(row.original.TotalAmount) || 0;
      return <div className="">₦{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "Date",
    header: () => (
      <div className="w-full text-center flex items-center justify-start gap-4">
        Date Ordered <CaretUpDownIcon />
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.Date);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClasses = getCustomerStatusClasses(status);

      return (
        <div
          className={`px-2 py-1 text-xs rounded-full w-fit ${statusClasses.bgColor} ${statusClasses.textColor}`}
        >
          {status}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <CustomerActions
        customerId={row.original.orderId}
        isBlocked={
          row.original.status === "Blocked" ||
          row.original.status === "Inactive"
        }
      />
    ),
  },
];