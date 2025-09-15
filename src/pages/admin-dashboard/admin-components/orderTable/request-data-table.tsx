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
import { Checkbox } from "../../../ui/checkbox";
import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer";
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
import {
  ArrowLeftIcon,
  CaretUpDownIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import EmptyState from "../emptycart";
import cart from "../../../admin-dashboard/images/emptyCart.png";
import { orderStatuses } from "../../_data/_overview";
import { CaretDownIcon } from "@phosphor-icons/react";
import Button from "../../../../shared-components/button";
import InfoSection from "./info-section";
import { Dialog, DialogTrigger, DialogContent } from "../../../ui//dialog";
import { RiderDialogContent } from "./rider-info";

const columns: ColumnDef<z.infer<typeof schema>>[] = [
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

      const style = orderStatuses.find((s) => s.status === status);

      return (
        <div
          className={`px-2 py-1 text-xs rounded-full w-fit ${
            style
              ? `${style.bgColor} ${style.textColor}`
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <Drawer>
        <DrawerTrigger className="text-[#9A6C50]">View More</DrawerTrigger>
        <DrawerContent className="w-[59.063rem] flex flex-col h-[52.75rem]">
          <DrawerHeader className="flex items-center gap-2">
            <DrawerClose>
              <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
                <ArrowLeftIcon />
              </div>
            </DrawerClose>
            <DrawerTitle className="font-inter text-[#494949] font-medium">
              Order ID: {row.original.orderId}
            </DrawerTitle>
            {(() => {
              const status = row.original.status;
              const style = orderStatuses.find((s) => s.status === status);

              return (
                <div
                  className={`px-2 py-1 text-xs rounded-full w-fit ${
                    style
                      ? `${style.bgColor} ${style.textColor}`
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status}
                </div>
              );
            })()}
            {row.original.status !== "Pending" &&
              row.original.status !== "Canceled" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TableButton
                      variant="outline"
                      size="sm"
                      className="w-52 h-11 border ml-auto border-[#D0D5DD] text-[#676767] text-sm bg-white "
                    >
                      Change order status
                      <CaretDownIcon className="text-[#676767]" size={20} />
                    </TableButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-52 h-full flex flex-col items-start gap-3 p-3">
                    {orderStatuses.map((status) => (
                      <DropdownMenuItem
                        className={`${status.bgColor} ${status.textColor} px-2 cursor-pointer text-xs py-1 w-auto block rounded-full`}
                        key={status.status}
                      >
                        {status.status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </DrawerHeader>
          <div className="flex justify-between gap-10 px-6   overflow-y-auto flex-1">
            <div>
              <img
                src={row.original.image}
                alt=""
                className="w-[18.75rem] h-[17.5rem] object-cover rounded-md"
              />
            </div>
            <div className=" space-y-6  flex-1 pb-36 bg-red-700">
              {/* Order Info Section */}
              <InfoSection
                title="Order Information"
                items={[
                  {
                    label: "Order Date & Time:",
                    value: "15 May, 2025 | 6:00 PM",
                  },
                  { label: "Dress:", value: row.original.dress },
                  { label: "Dress Size:", value: row.original.size },
                  { label: "Dress Color:", value: "Yellow & Black" },
                  { label: "Quantity:", value: 2 },
                  {
                    label: "Amount:",
                    value: `₦${row.original.TotalAmount.toLocaleString()}`,
                  },
                  {
                    label: "Payment Method:",
                    value: row.original.paymentMethod,
                  },
                ]}
              />
              <div className="h-[1px] bg-[#F0F2F5] w-full"></div>
              {/* Delivery Info Section */}
              <InfoSection
                title="Delivery Information"
                items={[
                  {
                    label: "Customer Name:",
                    value: row.original.deliveryInformation.name,
                  },
                  {
                    label: "Email:",
                    value: row.original.deliveryInformation.email,
                  },
                  {
                    label: "Address:",
                    value: row.original.deliveryInformation.address,
                  },
                  {
                    label: "City/Town:",
                    value: row.original.deliveryInformation.city,
                  },
                  {
                    label: "Phone:",
                    value: row.original.deliveryInformation.phone,
                  },
                ]}
              />
              {row.original.additionalInfo && (
                <>
                  <div className="h-[1px] bg-[#F0F2F5] mb-4 w-full"></div>
                  <div>
                    {/* <h2 className="text-base font-inter font-medium mb-4">{title}</h2> */}
                    <h2 className="text-base font-inter font-medium mb-4">
                      Additional Information
                    </h2>
                    <p className="text-gray-600 mb-2">Note for Tailor:</p>
                    <span className="">{row.original.additionalInfo}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* <DrawerFooter className="border-t border-[#E8E8E8] h-32"></DrawerFooter> */}
          {row.original.status !== "Complete" &&
            row.original.status !== "Canceled" && (
              <div className="border-t border-[#E8E8E8] p-4 h-24 bg-white flex justify-center items-center gap-3 sticky bottom-0">
                {row.original.status === "Pending" && (
                  <>
                    <Button
                      text="Reject"
                      variant="outline"
                      className="text-[#3D3D3D] border border-[#E7E7E7] shadow-sm"
                    />
                    <Button type="button" text="Approve" variant="solid" />
                  </>
                )}

                {row.original.status === "Approved" && (
                  <Button
                    type="button"
                    text="Save"
                    variant="solid"
                    className="w-full md:max-w-[9.375rem]"
                  />
                )}

                {row.original.status === "Packaging" && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          text="Add Rider Info"
                          icon={
                            <PlusIcon className="size-[1.25rem] text-[#3D3D3D]" />
                          }
                          variant="outline"
                          className="text-[#3D3D3D] border-[#E7E7E7] shadow-sm"
                        />
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[500px]">
                        <RiderDialogContent orderId={row.original.orderId} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      type="button"
                      text="Save"
                      variant="solid"
                      className="w-full md:max-w-[9.375rem]"
                    />
                  </>
                )}

                {row.original.status === "Out for Delivery" && (
                  <>
                    <Button
                      type="button"
                      text="Edit Rider Info"
                      variant="clear"
                      className="text-[#3D3D3D] border border-[#E7E7E7] shadow-sm"
                    />
                    <Button
                      type="button"
                      text="Save"
                      variant="solid"
                      className="w-full md:max-w-[9.375rem]"
                    />
                  </>
                )}

                {row.original.status === "Delivered" && (
                  <Button
                    type="button"
                    text="Save"
                    variant="solid"
                    className="w-full md:max-w-[9.375rem]"
                  />
                )}
              </div>
            )}
        </DrawerContent>
      </Drawer>
    ),
  },
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
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
                    message="No new requests just yet."
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
