import React from "react";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Spinner from "../../../../shared-components/spinner";
import Button from "../../../../shared-components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { type Row } from "@tanstack/react-table";
import { useDeleteProduct } from "../../../../hooks/admin-inventory.hooks";
import type { OrderItem } from "./schema";
import { useState } from "react";

/* ----------------------------------------------------------------------------------------------------- */

const ProductActions: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Row<OrderItem>;
}> = ({ row }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteProductMutation = useDeleteProduct();

  React.useEffect(() => {
    if (deleteProductMutation.isSuccess) {
      setIsDeleteDialogOpen(false);
    }
  },[deleteProductMutation.isSuccess]);

  return (
    <div className="flex items-center gap-3">
      {/* View */}
      <button
        onClick={() => console.log("View", row.original.orderId)}
        className="text-[#9A6C50] hover:underline flex items-center gap-1"
      >
        <Link to={`/admin-dashboard/inventory/${row.original.orderId}`}>
          View
        </Link>
      </button>

      {/* Edit */}
      <Link to={`/admin-dashboard/inventory/${row.original.orderId}/edit`}>
        <button
          title="Edit icon"
          type="button"
          onClick={() => console.log("Edit", row.original.orderId)}
          className=""
        >
          <PencilSimpleIcon size={20} />
        </button>
      </Link>

      {/* Delete */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
          <div
            title="Delete icon"
            className="text-red-600 hover:text-red-800 cursor-pointer"
          >
            <TrashIcon size={20} />
          </div>
        </DialogTrigger>

        <DialogContent
          className="max-w-[400px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="mb-4">
              Delete {row.original.generalInformation?.name || "Product"}?
            </DialogTitle>

            <DialogDescription className="mb-4">
              Are you sure you want to delete this item and all its information?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-auto w-full gap-3">
            {" "}
            <DialogClose asChild className="cursor-pointer">
              <span className="text-[#3D3D3D] border h-[37px] w-[170px] flex justify-center items-center text-sm border-[#E7E7E7] shadow-sm rounded-md">
                Cancel
              </span>
            </DialogClose>
            <Button
              type="button"
              variant="solid"
              disabled={deleteProductMutation.isPending}
              onClick={() => {
                console.log("Clicky");
                deleteProductMutation.mutate(row.original.orderId);
              }}
              className="text-white flex-1 bg-red-600  h-[37px] flex justify-center items-center text-sm shadow-sm disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-1">
                <span>Delete</span>
                <Spinner
                  speed="fast"
                  size="sm"
                  isLoading={deleteProductMutation.isPending}
                  arcColor="#ffff"
                />
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(ProductActions);
