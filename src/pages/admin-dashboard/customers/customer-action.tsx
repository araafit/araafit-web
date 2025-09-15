import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { TableButton } from "../../ui/button";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import { useBlockCustomer, useUnblockCustomer, useDeleteCustomer } from "../../../hooks/admin-customers.hooks";

function CustomerActions({
  customerId,
  isBlocked,
}: {
  customerId: string;
  isBlocked: boolean;
}) {
  const navigate = useNavigate();
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  const blockMutation = useBlockCustomer();
  const unblockMutation = useUnblockCustomer();
  const deleteMutation = useDeleteCustomer();

  const handleBlockToggle = async () => {
    try {
      if (isBlocked) {
        await unblockMutation.mutateAsync(customerId);
      } else {
        if (!blockReason.trim()) {
          return;
        }
        await blockMutation.mutateAsync({
          id: customerId,
          request: { reason: blockReason },
        });
      }
      setIsBlockDialogOpen(false);
      setBlockReason("");
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteReason.trim()) {
        return;
      }
      await deleteMutation.mutateAsync({
        id: customerId,
        request: { reason: deleteReason },
      });
      setIsDeleteDialogOpen(false);
      setDeleteReason("");
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div>
      {/* Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <DotsThreeVerticalIcon size={28} className="cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="border h-32 flex flex-col p-2 w-[173px]">
          <TableButton
            variant="ghost"
            className="justify-start font-light"
            onClick={() => navigate(`/admin-dashboard/customers/${customerId}`)}
          >
            View Details
          </TableButton>

          <TableButton
            variant="ghost"
            className="justify-start font-light"
            onClick={() => setIsBlockDialogOpen(true)}
          >
            {isBlocked ? "Unblock Customer" : "Block Customer"}
          </TableButton>

          <TableButton
            variant="ghost"
            className="justify-start text-red-500 font-light"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Account
          </TableButton>
        </PopoverContent>
      </Popover>

      {/* Block/Unblock Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isBlocked ? "Unblock Customer" : "Block Customer"}
            </DialogTitle>
          </DialogHeader>
          {isBlocked ? (
            <p className="text-sm text-gray-600">
              Are you sure you want to unblock this customer?
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to block this customer?
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for blocking
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Enter reason for blocking this customer..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <TableButton
              variant="outline"
              onClick={() => {
                setIsBlockDialogOpen(false);
                setBlockReason("");
              }}
            >
              Cancel
            </TableButton>
            <TableButton 
              onClick={handleBlockToggle}
              disabled={(!isBlocked && !blockReason.trim()) || blockMutation.isPending || unblockMutation.isPending}
            >
              {blockMutation.isPending || unblockMutation.isPending 
                ? "Processing..." 
                : isBlocked ? "Unblock" : "Block"}
            </TableButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This action cannot be undone. Do you really want to delete this
              customer's account?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for deletion
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Enter reason for deleting this customer..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <TableButton
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteReason("");
              }}
            >
              Cancel
            </TableButton>
            <TableButton 
              variant="destructive" 
              onClick={handleDelete}
              disabled={!deleteReason.trim() || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </TableButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CustomerActions;
