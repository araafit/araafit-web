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

  const handleBlockToggle = () => {
    console.log(isBlocked ? "Unblocking..." : "Blocking...");
    setIsBlockDialogOpen(false);
  };

  const handleDelete = () => {
    console.log("Deleting account...");
    setIsDeleteDialogOpen(false);
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
          <p className="text-sm text-gray-600">
            Are you sure you want to {isBlocked ? "unblock" : "block"} this
            customer?
          </p>
          <DialogFooter>
            <TableButton
              variant="outline"
              onClick={() => setIsBlockDialogOpen(false)}
            >
              Cancel
            </TableButton>
            <TableButton onClick={handleBlockToggle}>
              {isBlocked ? "Unblock" : "Block"}
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
          <p className="text-sm text-gray-600">
            This action cannot be undone. Do you really want to delete this
            customer’s account?
          </p>
          <DialogFooter>
            <TableButton
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </TableButton>
            <TableButton variant="destructive" onClick={handleDelete}>
              Delete
            </TableButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CustomerActions;
