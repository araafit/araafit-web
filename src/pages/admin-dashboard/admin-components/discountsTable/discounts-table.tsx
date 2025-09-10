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
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "../../../ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  PencilSimpleIcon,
  ArrowLeftIcon,
  QuestionIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
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

// eslint-disable-next-line react-refresh/only-export-components

// --- COLUMNS ---
const columns: ColumnDef<Discount>[] = [
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
        <Drawer>
          <DrawerTrigger>
            <PencilSimpleIcon
              className="text-gray-600 cursor-pointer"
              size={18}
            />
          </DrawerTrigger>
          <DrawerContent className="w-[500px] flex flex-col h-[52.75rem]">
            <DrawerHeader className="flex items-center gap-2">
              <DrawerClose>
                <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
                  <ArrowLeftIcon />
                </div>
              </DrawerClose>
              <DrawerTitle className="font-inter flex items-center gap-2 text-[#494949] font-medium">
                Edit Discount:{" "}
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionIcon
                        className="text-gray-600  cursor-pointer"
                        size={18}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[330px]">
                      <p>
                        Create a New Discount. Make changes to your discount
                        details. Update the name, value, eligibility, or active
                        dates anytime.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DrawerTitle>
            </DrawerHeader>

            {/* Form Section */}
            <div className="p-6 flex-1 overflow-y-auto pb-36 space-y-6">
              {/* Discount Name */}
              <div className="space-y-2">
                <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                  Discount Name
                </label>
                <input
                  type="text"
                  defaultValue={row.original.name}
                  className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-2">
                <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                  Discount Type
                </label>
                <Select defaultValue={row.original.type}>
                  <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Discount Value */}
              <div className="space-y-2">
                <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                  Discount Value
                </label>
                <input
                  type="number"
                  defaultValue={row.original.value}
                  className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
                />
              </div>

              {/* Eligible Applicant */}
              <div className="space-y-2">
                <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                  Eligible Applicant
                </label>
                <Select defaultValue={row.original.eligible}>
                  <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                    <SelectValue placeholder="Select eligibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="guest">Guest Customers</SelectItem>
                    <SelectItem value="first-time">
                      First-time Buyers
                    </SelectItem>
                    <SelectItem value="loyal">Loyal Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Usage Limit */}
              <div className="space-y-2">
                <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                  Usage Limit
                </label>
                <input
                  type="number"
                  //   defaultValue={row.original.usageLimit}
                  className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
                />
              </div>

              {/* Start & End Date */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                    Start Date
                  </label>
                  <input
                    type="date"
                    defaultValue={row.original.startDate}
                    className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                    End Date
                  </label>
                  <input
                    type="date"
                    defaultValue={row.original.endDate}
                    className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E8E8E8] bg-white p-4 h-20 flex justify-center items-center sticky bottom-0">
              <Button
                text="Save"
                type="button"
                variant="solid"
                className="w-full md:max-w-[9.375rem]"
              />
            </div>
          </DrawerContent>
        </Drawer>

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
              <Button
                text="Delete"
                type="submit"
                variant="solid"
                //  onClick={() => {
                //   onDelete();
                // }}
                className={` text-white flex-1  bg-[#DC2626]
              }`}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
];

// --- TABLE COMPONENT ---
export function DiscountTable({ data: initialData }: { data: Discount[] }) {
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
    () => data.map((d) => d.id),
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
                      colSpan={columns.length}
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
                            <Button variant="solid" text="Create Discounts" />
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
