import { ArrowLeftIcon, CaretDownIcon, PlusIcon } from "@phosphor-icons/react";
import type { Row } from "@tanstack/react-table";
import React from "react";
import type z from "zod";
import { useUpdateOrderStatus } from "../../../../hooks/admin-orders.hooks";
import Button from "../../../../shared-components/button";
import Spinner from "../../../../shared-components/spinner";
import { TableButton } from "../../../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { orderStatuses } from "../../_data/_overview";
import type { schema } from "../overViewTable/schema/schema";
import InfoSection from "./info-section";
import { RiderDialogContent } from "./rider-info";

/* ------------------------------------------------------------------------------------------------ */
// Only re-render if the actual order data changed
const rowReferenceToReduceRender = (prevProps, nextProps) => {
  return (
    prevProps.row.original.orderId === nextProps.row.original.orderId &&
    prevProps.row.original.status === nextProps.row.original.status
  );
};

/**
 * Drawer for sewing request table when clicked on 'view more' text
 * @param row Row<z.infer<typeof schema>>
 *
 * @returns ReactElement
 */
export const ActionCell: React.FC<{ row: Row<z.infer<typeof schema>> }> =
  React.memo(({ row }) => {
    const [open, setOpen] = React.useState(false);
    const updateOrderStatusMutation = useUpdateOrderStatus();
    const isUpdating = updateOrderStatusMutation.isPending;

    const status = row.original.status;
    const statusStyle = React.useMemo(
      () => orderStatuses.find((s) => s.status.toLowerCase() === row.original.status.toLowerCase()),
      [row.original.status]
    );

    const statusOptions = React.useMemo(
      () =>
        orderStatuses.map((status) => (
          <DropdownMenuItem
            className={`${status.bgColor} ${
              status.textColor
            } px-2 cursor-pointer text-xs py-1 w-auto block rounded-full ${
              isUpdating ? "pointer-events-none opacity-70" : ""
            }`}
            key={status.status}
            onClick={(e) => {
              e.stopPropagation();
              if (isUpdating) return;
              updateOrderStatusMutation.mutate({
                orderId: row.original.orderId,
                data: { status: status.status.toLowerCase() },
              });
            }}
          >
            {status.status}
          </DropdownMenuItem>
        )),
      [isUpdating, row.original.orderId]
    );

    const infoSectionOptions = React.useMemo(
      () => (
        <InfoSection
          title="Order Information"
          items={[
            {
              label: "Order Date & Time:",
              value: row.original.createdAt?.toLocaleLowerCase(),
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
      ),
      [row]
    );

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          className="text-[#9A6C50]"
          onClick={(e) => e.stopPropagation()}
          aria-describedby="request-management-trigger"
        >
          View More
        </DrawerTrigger>

        <DrawerContent className="w-[59.063rem] flex flex-col h-screen max-h-screen relative"  onClick={(e) => e.stopPropagation()}>

          <DrawerHeader className="flex items-center gap-2">
            <DrawerClose>
              <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
                <ArrowLeftIcon />
              </div>
            </DrawerClose>
            <DrawerTitle className="font-inter text-[#494949] font-medium">
              Order ID: {row.original.orderId}
            </DrawerTitle>

            {
              <div
                className={`px-2 py-1 text-xs rounded-full w-fit ${
                  statusStyle
                    ? `${statusStyle.bgColor} ${statusStyle.textColor}`
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {status}
              </div>
            }

            {row.original.status !== "Pending" &&
              row.original.status !== "Canceled" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild  onClick={(e) => e.stopPropagation()}>
                    <TableButton
                      variant="outline"
                      size="sm"
                      className="w-52 h-11 border ml-auto border-[#D0D5DD] text-[#676767] text-sm bg-white "
                      disabled={isUpdating}
                    >
                      <span className="inline-flex items-center gap-2">
                        {isUpdating && <Spinner size="sm" />}
                        {isUpdating ? "Updating..." : "Change order status"}
                      </span>
                      <CaretDownIcon className="text-[#676767]" size={20} />
                    </TableButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-52 h-full flex flex-col items-start gap-3 p-3">
                    {statusOptions}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </DrawerHeader>
          {isUpdating && (
            <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}
          <div className="flex justify-between gap-10 px-6   overflow-y-auto flex-1">
            <div>
              <img
                src={row.original.image || undefined}
                alt=""
                className="w-[18.75rem] h-[17.5rem] object-cover rounded-md"
              />
            </div>
            <div className=" space-y-6  flex-1 pb-36 bg-red-700">
              {/* Order Info Section */}
              {infoSectionOptions}
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
    );
  }, rowReferenceToReduceRender);
