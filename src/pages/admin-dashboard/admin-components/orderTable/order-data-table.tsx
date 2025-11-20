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
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { TableButton } from "../../../ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Tabs, TabsContent } from "../../../ui/tabs";
import { schema } from "../overViewTable/schema/schema";
import EmptyState from "../emptycart";
import cart from "../../../admin-dashboard/images/emptyCart.png";
import { orderTableColumn } from "./table-columns/order-columns";
import { useOrderStatusContext } from "../../orders-management/order-table-context";
import { type OrderTablesType } from "./table-columns/order-columns";
/* -------------------------------------------------------------------------------------------------------- */

export function DataTable({
  data: initialData,
  tableLabel
}: {
  data: z.infer<typeof schema>[];
  tableLabel?: OrderTablesType;
}) {
  // const updateOrderStatusMutation = useUpdateOrderStatus();
  const { selectedTableRow, setSelectedTableRow } = useOrderStatusContext();
  // const columns = orderTableColumn;
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
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

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ orderId }) => orderId) || [],
    [data]
  );

  // Update table when state is updated with new changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
    columns: orderTableColumn(tableLabel),
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

  // Compare IDs before updating table row selection
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const lastSelectedIdsRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    const ids = selectedRows.map((r) => r.orderId);
    const prev = lastSelectedIdsRef.current;
    const unchanged =
      ids.length === prev.length && ids.every((id, i) => id === prev[i]);

    if (!unchanged) {
      setSelectedTableRow({ requests: [], orders: selectedRows });
      lastSelectedIdsRef.current = ids;
    }
  }, [selectedRows, selectedTableRow]);

  // Clear selections when triggered
  React.useEffect(() => {
    if (selectedTableRow.shouldClearSelection) {
      table.resetRowSelection();
      setSelectedTableRow({
        requests: [],
        orders: [],
        shouldClearSelection: false,
      });
      lastSelectedIdsRef.current = [];
    }
  }, [selectedTableRow.shouldClearSelection, setSelectedTableRow]);

  // Handle table drag and drop
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
    <div className="flex items-center justify-between">
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
              {table.getRowModel().rows?.length ? (
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
                    {table.getRowModel().rows.map((row, idx) => {
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
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-24">
                  <EmptyState
                    image={cart}
                    alt="Empty cart"
                    message="No new orders just yet."
                  />
                </div>
              )}
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
