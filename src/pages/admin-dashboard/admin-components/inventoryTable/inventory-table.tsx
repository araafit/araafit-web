import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";

import type { ColumnDef } from "@tanstack/react-table";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { TableButton } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import EmptyState from "../emptycart";
import cart from "../../../admin-dashboard/images/emptyCart.png";
import {
  MagnifyingGlassIcon,
  FunnelSimpleIcon,
  DownloadSimpleIcon,
  CaretUpDownIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import Button from "../../../../shared-components/button";
import * as XLSX from "xlsx";
import { TrashIcon } from "lucide-react";
import { inventoryItemSchema } from "./schema";
import type { FilterFn } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";

type InventoryItem = z.infer<typeof inventoryItemSchema>;

const equalsIgnoreCase: FilterFn<InventoryItem> = (
  row,
  columnId,
  filterValue
) => {
  const v = String(row.getValue<string>(columnId) ?? "");
  const f = String(filterValue ?? "");
  return v.localeCompare(f, undefined, { sensitivity: "accent" }) === 0;
};

// -------------------- Columns --------------------
const columns: ColumnDef<z.infer<typeof inventoryItemSchema>>[] = [
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
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {/* View */}
        <button
          onClick={() => console.log("View", row.original.orderId)}
          className="text-[#9A6C50] hover:underline flex items-center gap-1"
        >
          <Link to={`/admin-dashboard/inventory/${row.original.orderId}`}>
            View
          </Link>
        </button>
        {/* Edit */}
        <Link to={`/admin-dashboard/inventory/${row.original.orderId}/edit`}>
          <button
            onClick={() => console.log("Edit", row.original.orderId)}
            className=""
          >
            <PencilSimpleIcon size={20} />
          </button>
        </Link>
        {/* Delete */}
        <Dialog>
          <DialogTrigger>
            {" "}
            <button
              onClick={() => console.log("Delete", row.original.orderId)}
              className="text-red-600 hover:text-red-800"
            >
              <TrashIcon size={20} />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="mb-4">
                Delete Araafit Cream & Orange Jumpsuit?
              </DialogTitle>
              <DialogDescription className="mb-4">
                Are you sure you want to delete this item and all its
                information? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-auto w-full gap-3">
              {" "}
              <DialogClose>
                <Button
                  type="button"
                  text="Cancel"
                  variant="clear"
                  className="text-[#3D3D3D] border h-[37px] w-[170px] flex justify-center items-center text-sm border-[#E7E7E7] shadow-sm"
                />{" "}
              </DialogClose>
              <Button
                type="button"
                text="Delete"
                variant="solid"
                className="text-white flex-1 bg-red-600  h-[37px] flex justify-center items-center text-sm shadow-sm"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
];

// -------------------- Table Component --------------------
export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof inventoryItemSchema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ orderId }) => orderId) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    filterFns: {
      equalsIgnoreCase,
    },
    getRowId: (row) => row.orderId.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // -------------------- Export to Excel --------------------
  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(
      table.getFilteredRowModel().rows.map((r) => r.original)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search , Filters , Export */}
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-[28px]">All Inventory</h2>

        <div className="flex items-center justify-between gap-3">
          {/* Filter by Status */}
          <DropdownMenu>
            <DropdownMenuTrigger className="py-[18px]" asChild>
              <TableButton
                variant="outline"
                size="sm"
                className="flex items-center  shadow-none text-[#3D3D3D] font-light border-[#E8E8E8] gap-2"
              >
                Filter by
                <FunnelSimpleIcon size={16} />
              </TableButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Array.from(
                new Set(
                  table
                    .getPreFilteredRowModel()
                    .flatRows.map(
                      (r) => r.original.generalInformation?.category
                    )
                    .filter(Boolean) as string[]
                )
              ).map((category) => {
                const formatted =
                  category.charAt(0).toUpperCase() +
                  category.slice(1).toLowerCase();

                return (
                  <DropdownMenuItem
                    key={category}
                    onClick={() =>
                      setColumnFilters([
                        {
                          id: "category",
                          value: category,
                        },
                      ])
                    }
                    className="w-full"
                  >
                    {formatted}
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuItem onClick={() => setColumnFilters([])}>
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search here"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full rounded-md text-[#4F4F4F] font-light border px-8 py-2 text-sm focus:outline-none"
            />
            <MagnifyingGlassIcon
              className="absolute left-2 top-2.5 text-[#3D3D3D]"
              size={18}
            />
          </div>
          {/* Export */}
          <Button
            type="button"
            text="Export"
            variant="clear"
            icon={<DownloadSimpleIcon size={16} />}
            onClick={exportToExcel}
            className="text-[#3D3D3D] border h-[37px] font-light text-sm border-[#E7E7E7] shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="relative flex flex-col gap-4 overflow-auto">
          <div className="overflow-hidden rounded-lg border ">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="sticky top-0 z-10 h-11 bg-white ">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-0 !border-b-0"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          className="pl-5"
                          key={header.id}
                          colSpan={header.colSpan}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, idx) => {
                      const bgClass = row.getIsSelected()
                        ? "bg-muted/50"
                        : idx % 2 === 0
                        ? "bg-[#F9FAFB]"
                        : "bg-white";

                      return (
                        <TableRow
                          key={row.id}
                          className={`border-0 text-sm transition-colors  ${bgClass}`}
                          onClick={() =>
                            row.toggleSelected(!row.getIsSelected())
                          }
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="h-[4.5rem] pl-5"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <EmptyState
                          image={cart}
                          alt="Empty cart"
                          message="Your inventory is currently empty. Get started by adding your first item — it’s quick and easy!"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
