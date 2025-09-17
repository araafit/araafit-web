import * as React from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { TrashSimpleIcon } from "@phosphor-icons/react";
import Button from "../../../../shared-components/button";
import emptyFolder from "../../images/image 45.png";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import DiscountStatusToggle from "./toggle-status";
import { EditDiscountDrawer } from "./edit-discount-drawer";
import {
  useDeleteDiscount,
  useUpdateDiscount,
} from "../../../../hooks/admin-discounts.hooks";

// --- SCHEMA / TYPE ---
export type Discount = {
  id: string;
  name: string;
  type: "Percentage" | "Flat";
  value: string;
  eligible: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
};
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    setData: React.Dispatch<React.SetStateAction<TData[]>>;
  }
}

// --- SAMPLE DATA ---

// --- COLUMNS ---
const createColumns = (
  deleteDiscount: ReturnType<typeof useDeleteDiscount>,
  updateDiscount: ReturnType<typeof useUpdateDiscount>
): ColumnDef<Discount>[] => [
  { accessorKey: "name", header: "Discount Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "value", header: "Value" },
  { accessorKey: "eligible", header: "Eligible" },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "endDate", header: "End Date" },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => (
      <div className=" flex justify-center">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.original.status === "Active"
              ? "bg-green-100 text-[#16A34A]"
              : "bg-[#FEF3C7] text-[#F59E0B]"
          }`}
        >
          {row.original.status}
        </span>
      </div>
    ),
  },

  {
    id: "activate",
    header: "Activate/Inactivate",
    size: 140,
    cell: ({ row, table }) => {
      const setData = table.options.meta?.setData as React.Dispatch<
        React.SetStateAction<Discount[]>
      >;

      return (
        <DiscountStatusToggle
          id={row.original.id}
          name={row.original.name}
          status={row.original.status}
          setData={setData}
        />
      );
    },
  },

  {
    id: "actions",
    size: 240,
    // header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-3 ml-auto">
        {/* Edit Drawer */}
        <EditDiscountDrawer
          discount={row.original}
          updateDiscount={updateDiscount}
        />

        {/* Delete */}
        <Dialog>
          <DialogTrigger asChild>
            <TrashSimpleIcon
              className="text-red-500 cursor-pointer"
              size={18}
            />
          </DialogTrigger>

          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete {row.original.name}?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                {row.original.name || "this item"}? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex">
              <DialogClose asChild className="flex-1">
                <Button
                  text="Cancel"
                  variant="outline"
                  className="border border-[#E7E7E7] text-[#3D3D3D]"
                />
              </DialogClose>
              <DialogClose asChild>
                <Button
                  text={deleteDiscount.isPending ? "Deleting..." : "Delete"}
                  type="button"
                  variant="solid"
                  onClick={() => deleteDiscount.mutate(row.original.id)}
                  className={` text-white flex-1  bg-[#DC2626]
                }`}
                />
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
];

// --- TABLE COMPONENT ---
export function DiscountTable({
  data: initialData,
  openCreateDrawer,
}: {
  data: Discount[];
  openCreateDrawer: () => void;
}) {
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
  const deleteDiscount = useDeleteDiscount();
  const updateDiscount = useUpdateDiscount();

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map((d) => d.id),
    [data]
  );

  const table = useReactTable({
    data,
    columns: createColumns(deleteDiscount, updateDiscount),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { setData },
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
    <div className="flex items-center justify-between">
      <div className="w-full">
        <div className="overflow-hidden rounded-b-lg bg-white">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="h-12 bg-[#F9FAFB]">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
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
                  table.getRowModel().rows.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        className={`text-sm font-inter text-[#4F4F4F] }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="h-[4.5rem] text-sm font-inter text-[#4F4F4F] font-light"
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
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      <div className="bg-white w-full px-4  py-6">
                        <div className="">
                          <h2 className="font-semibold text-[28px] capitalize">
                            Discounts
                          </h2>
                          <p className="text-[#5D5D5D] font-light">
                            Manage and track discounts to engage customers.
                          </p>
                        </div>
                        <section className="">
                          <div className="flex flex-col items-center justify-center py-12">
                            <img
                              src={emptyFolder}
                              alt="Empty folder"
                              className="w-32 h-32 mb-4"
                            />
                            <p className="text-[#5D5D5D] font-light mb-2">
                              Looks like you haven’t created any discounts.{" "}
                            </p>
                            <Button
                              variant="solid"
                              text="Create Discounts"
                              onClick={openCreateDrawer}
                            />
                          </div>
                        </section>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
