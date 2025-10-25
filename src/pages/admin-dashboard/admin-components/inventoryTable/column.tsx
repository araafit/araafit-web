import { CaretUpDownIcon } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import z from "zod";
// import type { useDeleteProduct } from "../../../../hooks/admin-inventory.hooks";
import { inventoryItemSchema } from "./schema";
import { equalsIgnoreCase } from "./utils";
import ProductActions from "./product-actions";

/* ------------------------------------------------------------------------------- */

export const createColumns = (): ColumnDef<
  z.infer<typeof inventoryItemSchema>
>[] => [
  {
    accessorKey: "generalInformation.name",
    header: "Product Name / Image",

    cell: ({ row }) => {
      const info = row.original.generalInformation;
      return (
        <div className="flex items-center gap-3">
          {info?.image ? (
            <img
              src={info.image}
              alt={info.name}
              className="w-10 h-10 object-cover rounded-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              N/A
            </div>
          )}
          <span className=" max-w-[150px]">{info?.name ?? "Unnamed"}</span>
        </div>
      );
    },

    enableHiding: false,
  },
  {
    id: "category",
    accessorFn: (row) => row.generalInformation?.category ?? "",
    header: () => (
      <div className="w-full text-center flex items-center gap-2">
        Category <CaretUpDownIcon />
      </div>
    ),
    cell: ({ getValue }) => {
      const category = (getValue() as string) || "N/A";
      return <div>{category}</div>;
    },
    filterFn: equalsIgnoreCase,
  },
  {
    accessorKey: "Price",
    header: () => (
      <div className="w-full text-center flex items-center gap-2">
        Price (₦) <CaretUpDownIcon />
      </div>
    ),
    cell: ({ row }) => {
      const price = row.original?.Price;
      const amount = typeof price === "number" ? price : Number(price) || 0;
      return <div>₦{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: () => (
      <div className="w-full text-center flex items-center gap-2">
        Stock <CaretUpDownIcon />
      </div>
    ),
    cell: ({ row }) => <div>{row.original.stock || "N/A"}</div>,
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="w-full text-center flex items-center gap-2">
        Status <CaretUpDownIcon />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const isInStock = status === "In Stock";
      const bgColor = isInStock ? "bg-[#F0FDF5]" : "bg-[#FEF2F2]";
      const textColor = isInStock ? "text-[#16A34A]" : "text-[#DC2626]";
      return (
        <div
          className={`px-2 py-1 text-xs rounded-full w-fit ${bgColor} ${textColor}`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "Date",
    header: () => (
      <div className="w-full text-center flex items-start justify-start gap-4">
        Date & Time Uploaded
      </div>
    ),
    cell: () => <div className="">15 May 2025 6:00 PM</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions row={row} />, // Delete Modal
  },
];
