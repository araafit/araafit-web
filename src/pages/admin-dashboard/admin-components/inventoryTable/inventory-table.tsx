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
} from "@phosphor-icons/react";
import Button from "../../../../shared-components/button";
import { inventoryItemSchema } from "./schema";
import { equalsIgnoreCase } from "./utils";
import { createColumns } from "./column";
import { exportToExcel } from "./utils";

/* ------------------------------------------------------------------------------------ */

// -------------------- Table Component --------------------
export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof inventoryItemSchema>[];
}) {
  const columns = createColumns();
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
            onClick={() => exportToExcel(table)}
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
