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
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  MagnifyingGlassIcon,
  FunnelSimpleIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import EmptyState from "../emptycart";
import cart from "../../../admin-dashboard/images/emptyCart.png";
import { tableColumns } from "./table-column";
import { exportToExcel } from "./export-table";
import { useCustomers } from "../../../../hooks/admin-customers.hooks";
import { convertApiCustomersToTableFormat } from "../../../../utils/admin-customers-utils";
import Spinner from "../../../../shared-components/spinner";
/* ----------------------------------------------------------------------------------------------- */

type DataTable = {
  orderId: string;
  deliveryInformation: {
    name: string;
    email: string;
  };
  TotalAmount: number;
  Date: string;
  status: "Active" | "Blocked";
};

export function DataTable() {
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pageCount, setPageCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Data customers data
  const {
    data: customersData,
    isLoading: customersLoading,
    isSuccess: customersSuccess,
    error: customersError,
  } = useCustomers({ page: pagination.pageIndex + 1, limit: pagination.pageSize });

  const tableData = React.useMemo(() => {
    console.log(customersData);
    return customersData
      ? convertApiCustomersToTableFormat(customersData.data)
      : [];
  }, [customersData]);

   const [data, setData] = React.useState(() => tableData);

  // Update local state when prop changes
  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

  // Data id
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ orderId }) => orderId) || [],
    [data]
  );

   // Update local state when prop changes
  React.useEffect(() => {
   if (customersSuccess && customersData) {
    setPageCount(customersData.meta.totalItems)
   }
  }, [customersSuccess, customersData]);

  // React table
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination
    },
    getRowId: (row) => row.orderId.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pageCount,
    getFilteredRowModel: getFilteredRowModel(),
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

  if (customersLoading) {
    return (
      <div className="flex justify-center items-center py-12 bg-white rounded-md w-full">
        <Spinner
          size="lg"
          speed="fast"
          arcColor="#523531"
          isLoading={customersLoading}
        />
      </div>
    );
  }

  if (customersError) {
    return (
      <div className="flex items-center justify-between mb-5">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 w-full">
          <p className="text-red-600">Failed to load customers</p>
        </div>
      </div>
    );
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
                        colSpan={tableColumns.length}
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

          {/* Table pagination */}

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
                  onClick={() => table.previousPage()}
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
        </TabsContent>
        {/*  */}
        {/* <TabsContent value="past-performance">
          <p>Past Performance content goes here</p>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
