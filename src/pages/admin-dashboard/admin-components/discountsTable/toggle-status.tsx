import * as React from "react";
import { Switch } from "../../../ui/switch";
import Button from "../../../../shared-components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
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
import { useToggleDiscount } from "../../../../hooks/admin-discounts.hooks";

interface DiscountStatusToggleProps {
  id: number | string;
  name: string;
  status: "Active" | "Inactive";
  setData: React.Dispatch<React.SetStateAction<Discount[]>>;
}

const DiscountStatusToggle: React.FC<DiscountStatusToggleProps> = ({
  id,
  name,
  status,
  setData,
}) => {
  const [open, setOpen] = React.useState(false);
  const [pendingChecked, setPendingChecked] = React.useState<boolean | null>(
    null
  );
  const toggleMutation = useToggleDiscount();

  const isActive = status === "Active";

  const handleConfirm = async () => {
    if (pendingChecked === null) return;
    try {
      await toggleMutation.mutateAsync(String(id));
      setData((old) =>
        old.map((d) =>
          d.id === id
            ? { ...d, status: pendingChecked ? "Active" : "Inactive" }
            : d
        )
      );
    } finally {
      setOpen(false);
      setPendingChecked(null);
    }
  };

  return (
    <div className="flex justify-center w-[100px]">
      <Switch
        checked={isActive}
        onCheckedChange={(checked) => {
          setPendingChecked(checked);
          setOpen(true);
        }}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="mt-1">
              {pendingChecked
                ? `Reactivate “${name}”?`
                : `Deactivate “${name}”?`}
            </DialogTitle>
            <DialogDescription className="my-5">
              {pendingChecked
                ? "Are you sure you want to reactivate this discount?"
                : "Are you sure you want to deactivate this discount? You can always turn it back on later using the toggle switch."}
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
              text={pendingChecked ? "Reactivate" : "Deactivate"}
              type="submit"
              variant="solid"
              onClick={handleConfirm}
              className={`bg-[#9A6C50] text-white flex-1 ${
                pendingChecked ? "bg-[#DC2626]" : "bg-[#16A34A]"
              }`}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountStatusToggle;
