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
import { TableButton } from "../../../ui/button";
import Button from "../../../../shared-components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Tabs, TabsContent } from "../../../ui/tabs";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  CaretUpDownIcon,
  MagnifyingGlassIcon,
  FunnelSimpleIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import EmptyState from "../emptycart";
import cart from "../../../admin-dashboard/images/emptyCart.png";

import CustomerActions from "../../customers/customer-action";
import { getCustomerStatusClasses } from "../../../../utils/admin-customers-utils";

const columns: ColumnDef<{
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
    cell: () => <div className="">15 May 2025 6:00 PM</div>,
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

export function DataTable({
  data: initialData,
}: {
  data: {
    orderId: string;
    deliveryInformation: {
      name: string;
      email: string;
    };
    TotalAmount: number;
    Date: string;
    status: "Active" | "Blocked";
  }[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
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
  // -------------------- Export to Excel --------------------
  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(
      table.getFilteredRowModel().rows.map((r) => r.original)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  }

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
    },
    getRowId: (row) => row.orderId.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
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

  return (
    <div className="flex flex-col gap-4 w-full bg-white px-4 py-6">
      {/* Search , Filters , Export */}
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-[28px]">All Customers</h2>

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
      <Tabs defaultValue="outline" className="w-full">
        {/*  */}
        <TabsContent
          value="outline"
          className="relative flex flex-col gap-4 overflow-auto"
        >
          <div className="overflow-hidden rounded-lg border">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table className=" ">
                <TableHeader className="sticky top-0 z-10 h-11 border-b-0 bg-w">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className=" border-0 !border-b-0"
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="bg-muted">
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
                          className={`border-0 text-sm font-inter text-[#4F4F4F] transition-colors ${bgClass}`}
                          onClick={() =>
                            row.toggleSelected(!row.getIsSelected())
                          }
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="h-[4.5rem]">
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
                          message="No new orders just yet."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
          {(table.getCanPreviousPage() || table.getCanNextPage()) && (
            <div className="flex items-center justify-between">
              <div className="flex justify-between w-full">
                <div className="flex w-fit items-center justify-center text-sm text-[#1C1C1C]">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="flex items-center gap-2">
                  <TableButton
                    variant="outline"
                    className="hidden px-2 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span>Previous</span>
                  </TableButton>

                  <TableButton
                    variant="outline"
                    className="hidden px-2 lg:flex"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span>Next</span>
                  </TableButton>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        {/*  */}
        <TabsContent value="past-performance">
          <p>Past Performance content goes here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
