import * as React from "react";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import Button from "../../../shared-components/button";
import { ArrowLeftIcon, QuestionIcon } from "@phosphor-icons/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "../../ui/drawer";
import { useCreateDiscount } from "../../../hooks/admin-discounts.hooks";
import type {
  DiscountEligibility,
  DiscountType,
} from "../../../services/admin-discounts.service";
import { toast } from "react-hot-toast";
import showToast from "../../../utils/notification";
import { notificationStyles } from "../../../style/custom";

/* -------------------------------------------------------------------------------- */

interface CreateDiscountDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * This component allows the admin to create a new discount
 *
 * @returns React.FC<CreateDiscountDrawerProps>
 */
export const CreateDiscountDrawer: React.FC<CreateDiscountDrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const createMutation = useCreateDiscount();
  const [name, setName] = useState("");
  const [type, setType] = useState<DiscountType | "">("");
  const [value, setValue] = useState<string>("");
  const [eligibility, setEligibility] = useState<string>("");
  const [usageLimit, setUsageLimit] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const mapEligibilityToApi = (v: string): DiscountEligibility | null => {
    switch (v) {
      case "all":
        return "all_customers";
      case "guest":
        return "guest_customers";
      case "first-time":
        return "first_time_buyers";
      default:
        return null;
    }
  };

  const handleCreate = async () => {
    const valNum = Number(value);
    const usageNum = Number(usageLimit || 0);
    const apiEligibility = mapEligibilityToApi(eligibility);

    if (!name.trim())
      return showToast.error("Name is required", {
        icon: null,
        style: notificationStyles.alertError,
        position: "top-center",
      });

    if (type !== "percentage" && type !== "fixed") {
      return showToast.error("Select a valid type", {
        icon: null,
        style: notificationStyles.alertError,
        position: "top-center",
      });
    }

    if (Number.isNaN(valNum) || valNum <= 0) {
      return showToast.error("Enter a valid value", {
        icon: null,
        style: notificationStyles.alertError,
        position: "top-center",
      });
    }

    if (!apiEligibility)
      return showToast.error("Select eligibility", {
        icon: null,
        style: notificationStyles.alertError,
        position: "top-center",
      });
    if (!startDate || !endDate)
      return toast.error("Select start and end dates");

    try {
      await createMutation.mutateAsync({
        name,
        type,
        value: valNum,
        eligibility: apiEligibility,
        usageLimit: usageNum,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      onOpenChange(false);
      // reset
      setName("");
      setType("");
      setValue("");
      setEligibility("");
      setUsageLimit("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      // toast handled in hook
      console.error("Create discount failed:", error);
    }
  };
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-[500px] flex flex-col h-[52.75rem]">
        <DrawerHeader className="flex items-center gap-2">
          <DrawerClose>
            <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
              <ArrowLeftIcon />
            </div>
          </DrawerClose>
          <DrawerTitle className="font-inter flex items-center gap-2 text-[#494949] font-medium">
            Create Discount{" "}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <QuestionIcon
                    className="text-gray-600 cursor-pointer"
                    size={18}
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-[330px] bg-[#3D3D3D] text-[12px] text-white p-3">
                  <p>
                    Set up special offers to reward your customers — whether
                    it's a percentage off, or flat amount.
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
              placeholder="Enter discount name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Discount Type */}
          <div className="space-y-2">
            <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
              Discount Type
            </label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as DiscountType)}
            >
              <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
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
              placeholder="e.g. 20"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Eligible Applicant */}
          <div className="space-y-2">
            <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
              Eligible Applicant
            </label>
            <Select value={eligibility} onValueChange={setEligibility}>
              <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                <SelectValue placeholder="Select criteria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="guest">Guest Customers</SelectItem>
                <SelectItem value="first-time">First-time Buyers</SelectItem>
                <SelectItem value="loyal">Loyal Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Usage Limit */}
          <div className="space-y-2">
            <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
              <div className="flex items-center gap-1">
                <span>Usage Limit</span>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionIcon
                        className="text-gray-600 cursor-pointer"
                        size={18}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[330px] bg-[#3D3D3D] text-[12px] text-white p-3">
                      <p>
                        Usage limit refers to how many times a discount can be
                        used. Either overall, per customer, or per order.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </label>
            <input
              type="number"
              placeholder="e.g. 100"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
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
                title="Start date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                End Date
              </label>
              <input
                title="End date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E8E8E8] bg-white p-4 h-20 flex justify-center items-center sticky bottom-0">
          <Button
            text={createMutation.isPending ? "Creating..." : "Create"}
            type="button"
            variant="solid"
            onClick={handleCreate}
            className="w-full md:max-w-[9.375rem]"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
