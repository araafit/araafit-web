import React from "react";
import { useUpdateOrderStatus } from "../../../../hooks/admin-orders.hooks";
import type { Row } from "@tanstack/react-table";
import type z from "zod";
import type { schema } from "../overViewTable/schema/schema";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer";
import { ArrowLeftIcon } from "lucide-react";
import { orderStatuses } from "../../_data/_overview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { TableButton } from "../../../ui/button";
import { CaretDownIcon, PlusIcon } from "@phosphor-icons/react";
import InfoSection from "./info-section";
import Button from "../../../../shared-components/button";
import { Dialog, DialogContent, DialogTrigger } from "../../../ui/dialog";
import { RiderDialogContent } from "./rider-info";

/* ----------------------------------------------------------------------------------------------------------------------- */

/**
 * Drawer for purchase order table when clicked on 'view more' text
 * @param row Row<z.infer<typeof schema>>
 *
 * @returns ReactElement
 */
export const ActionComponent: React.FC<{
  row: Row<z.infer<typeof schema>>;
}> = ({ row }) => {
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const [open, setOpen] = React.useState(false);
  const isUpdating = updateOrderStatusMutation.isPending;

  const status = row.original.status;
  const statusStyle = React.useMemo(
    () =>
      orderStatuses.find(
        (s) => s.status.toLowerCase() === row.original.status.toLowerCase()
      ),
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
          {status.label}
        </DropdownMenuItem>
      )),
    [isUpdating, row.original.orderId]
  );

  const orderInfoSectionOptions = React.useMemo(
    () => (
      <InfoSection
        title="Order Information"
        items={[
          {
            label: "Order Date & Time:",
            value: row.original.deliveryDate?.toLocaleLowerCase(),
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

  const deliveryInfoSectionOptions = React.useMemo(
    () => (
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
    ),
    [row]
  );

  const riderInfoSectionOptions = React.useMemo(() => {
    if (row.original.riderInformation) {
      return (
        <InfoSection
          title="Rider Information"
          items={[
            {
              label: "Rider’s Name:",
              value: row.original.riderInformation.name,
            },
            {
              label: "Rider’s Phone Number:",
              value: row.original.riderInformation.phone,
            },
          ]}
        />
      );
    }

    return null;
  }, [row]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className="text-[#9A6C50]"
        onClick={(e) => e.stopPropagation()}
        aria-describedby="order-management-trigger"
      >
        View More
      </DrawerTrigger>

      <DrawerContent
        className="w-[38.313rem] flex flex-col h-[52.75rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <DrawerHeader className="flex items-center gap-2">
          <DrawerClose>
            <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
              <ArrowLeftIcon />
            </div>
          </DrawerClose>
          <DrawerTitle className="font-inter text-[#494949] font-medium">
            Order ID: {row.original.orderId.substring(0, 6)} ...
          </DrawerTitle>

          <div
            className={`px-2 py-1 text-xs rounded-full w-fit ${
              statusStyle
                ? `${statusStyle.bgColor} ${statusStyle.textColor}`
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </div>

          {row.original.status !== "Pending" &&
            row.original.status.toLowerCase() !== "cancelled" && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <TableButton
                    variant="outline"
                    size="sm"
                    className="w-52 h-11 border ml-auto border-[#D0D5DD] text-[#676767] text-sm bg-white "
                  >
                    Change order status
                    <CaretDownIcon className="text-[#676767]" size={20} />
                  </TableButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-52 h-full flex flex-col items-start gap-3 p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {statusOptions}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </DrawerHeader>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Order Info Section */}
          {orderInfoSectionOptions}

          <div className="h-[1px] bg-[#F0F2F5] w-full" />

          {/* Delivery Info Section */}
          {deliveryInfoSectionOptions}
          <>
            <div className="h-[1px] bg-[#F0F2F5] mb-4 w-full" />
            {riderInfoSectionOptions}
          </>
        </div>

        {/* <DrawerFooter className="border-t border-[#E8E8E8] h-32"></DrawerFooter> */}
        {row.original.status.toLowerCase() !== "complete" &&
          row.original.status.toLowerCase() !== "cancelled" && (
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        text="Edit Rider Info"
                        variant="clear"
                        className="text-[#3D3D3D] border border-[#E7E7E7] shadow-sm"
                      />
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px]">
                      <RiderDialogContent
                        orderId={row.original.orderId}
                        isEdit={true}
                        existingRider={
                          row.original.riderInformation
                            ? {
                                name: row.original.riderInformation.name,
                                phone: row.original.riderInformation.phone,
                                deliveryDate: row.original.deliveryDate || "",
                              }
                            : undefined
                        }
                      />
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
};
