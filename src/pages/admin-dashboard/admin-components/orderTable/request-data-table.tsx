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
import {
  type RequestTablesType,
  requestTableColumn,
} from "./table-columns/request-columns";
import { useOrderStatusContext } from "../../orders-management/order-table-context";

/* ------------------------------------------------------------------------------------ */
interface TablePagination {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPagination: any;
}

export function DataTable({
  data: initialData,
  tableLabel,
  tablePagination,
}: {
  data: z.infer<typeof schema>[];
  tableLabel?: RequestTablesType;
  tablePagination: TablePagination;
}) {
  const { selectedTableRow, setSelectedTableRow } = useOrderStatusContext();
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

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

  // Update table when state has new changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
    columns: requestTableColumn(tableLabel),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: tablePagination.page,
        pageSize: tablePagination.limit,
      },
    },
    getRowId: (row) => row.orderId.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: tablePagination.setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: tablePagination.total,
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
      setSelectedTableRow({ requests: selectedRows, orders: [] });
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

  if (table.getRowModel().rows?.length === 0) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="p-24">
          <EmptyState
            image={cart}
            alt="Empty cart"
            message="No new requests just yet."
          />
        </div>
      </div>
    );
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
                        onClick={() => row.toggleSelected(!row.getIsSelected())}
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
