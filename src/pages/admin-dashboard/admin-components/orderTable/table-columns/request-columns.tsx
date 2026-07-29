import type { ColumnDef } from "@tanstack/react-table";
import type z from "zod";
import type { schema } from "../../overViewTable/schema/schema";
import { sewingRequestStatuses } from "../../../_data/_overview";
import { CaretUpDownIcon } from "@phosphor-icons/react";
import { ActionCell } from "../requests-action-drawer";
import { Checkbox } from "../../../../ui/checkbox";

/*------------------------------------------------------------------------------------------------------*/

export type RequestTablesType =
  | "all-requests"
  | "pending"
  | "approved"
  | "sewing"
  | "packaged"
  | "out_for_delivery"
  | "delivered"
  | "complete"
  | "cancelled";

export const requestTableColumn: (
  tableLabel?: RequestTablesType
) => ColumnDef<z.infer<typeof schema>>[] = (tableLabel) => {
  const column = [
    {
      id: "select",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => <span>{row.original.orderId}</span>,
      enableHiding: false,
    },
    {
      accessorKey: "deliveryInformation.name",
      header: "Customer Name",
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
      accessorKey: "dress",
      header: "Item Information",
      cell: ({ row }) => (
        <div className="">
          <div>
            <div className="">{row.original.dress}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "TotalAmount",
      header: () => <div className="">Amount (₦)</div>,
      cell: ({ row }) => {
        const amount = Number(row.original.TotalAmount) || 0;
        return <div className="">₦{amount.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "Date",
      header: () => (
        <div className="w-full text-center flex items-start justify-start gap-4">
          Date Ordered <CaretUpDownIcon />
        </div>
      ),
      cell: () => <div className="">15 May 2025 6:00 PM</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const style = sewingRequestStatuses.find((s) => s.status.toLowerCase() === status.toLowerCase());

        return (
          <div
            className={`px-2 py-1 text-xs rounded-full w-fit ${
              style
                ? `${style.bgColor} ${style.textColor}`
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {style?.label || status}
          </div>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => <ActionCell row={row} />,
    },
  ];

  if (tableLabel !== "all-requests") {
    column.shift();
  }

  return column;
};
