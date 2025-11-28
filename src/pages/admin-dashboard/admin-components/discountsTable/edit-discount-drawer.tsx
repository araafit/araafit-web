import * as React from "react";
import { useState } from "react";
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
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import Button from "../../../../shared-components/button";
import {
  ArrowLeftIcon,
  QuestionIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import {
  discountsKeys,
  useUpdateDiscount,
} from "../../../../hooks/admin-discounts.hooks";
import type {
  DiscountEligibility,
  DiscountType,
} from "../../../../services/admin-discounts.service";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "../../../../shared-components/date-picker/date-picker";

/* ----------------------------------------------------------------------------------------- */

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

interface EditDiscountDrawerProps {
  discount: Discount;
  updateDiscount: ReturnType<typeof useUpdateDiscount>;
}

export const EditDiscountDrawer: React.FC<EditDiscountDrawerProps> = ({
  discount,
  updateDiscount,
}) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(discount.name);
  const [type, setType] = useState<DiscountType>(
    discount.type === "Percentage" ? "percentage" : "fixed"
  );
  const [value, setValue] = useState<string>(
    discount.value.replace(/[%₦,]/g, "")
  );
  const [eligibility, setEligibility] = useState<string>(() => {
    switch (discount.eligible) {
      case "All Customers":
        return "all";
      case "Guest Customers":
        return "guest";
      case "First-time buyers":
        return "first-time";
      default:
        return "all";
    }
  });
  const [usageLimit, setUsageLimit] = useState<string>("1000");
  const [startDate, setStartDate] = useState(() => {
    // Convert from display format "27 Aug 2020 10:26 AM" to ISO date format "YYYY-MM-DD"
    try {
      const date = new Date(discount.startDate);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  });
  const [endDate, setEndDate] = useState(() => {
    // Convert from display format "26 Aug 2020 10:01 PM" to ISO date format "YYYY-MM-DD"
    try {
      const date = new Date(discount.endDate);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  });

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

  const handleUpdate = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (type !== "percentage" && type !== "fixed") {
      return toast.error("Select a valid type");
    }
    const valNum = Number(value);
    if (Number.isNaN(valNum) || valNum <= 0) {
      return toast.error("Enter a valid value");
    }
    const usageNum = Number(usageLimit || 0);
    const apiEligibility = mapEligibilityToApi(eligibility);
    if (!apiEligibility) return toast.error("Select eligibility");
    if (!startDate || !endDate)
      return toast.error("Select start and end dates");

    console.log("submitting..", {
      id: discount.id,
      name,
      type,
      value: valNum,
      eligibility: apiEligibility,
      usageLimit: usageNum,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });

    try {
      await updateDiscount.mutateAsync({
        id: discount.id,
        payload: {
          name,
          type,
          value: valNum,
          eligibility: apiEligibility,
          usageLimit: usageNum,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        },
      });

      qc.invalidateQueries({ queryKey: discountsKeys.lists() });
      qc.invalidateQueries({ queryKey: discountsKeys.detail(discount.id) });
    } catch (error) {
      setOpen(false);
      // toast handled in hook
      console.log(error);
    }
  };

  const startDatePickerValue = startDate
    ? new Date(startDate + "T00:00:00z")
    : new Date();
  const startDatePickerSetterValue = (date) =>
    setStartDate(date ? date.toISOString().split("T")[0] : "");
  const endDatePickerValue = endDate
    ? new Date(endDate + "T00:00:00Z")
    : new Date();
  const endDatePickerSetterValue = (date) =>
    setEndDate(date ? date.toISOString().split("T")[0] : "");

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <PencilSimpleIcon className="text-gray-600 cursor-pointer" size={18} />
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
                    Make changes to your discount details. Update the name,
                    value, eligibility, or active dates anytime.
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
              title="Discount name"
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
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
              title="Discount value"
            />
          </div>

          {/* Eligible Applicant */}
          <div className="space-y-2">
            <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
              Eligible Applicant
            </label>
            <Select value={eligibility} onValueChange={setEligibility}>
              <SelectTrigger className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm">
                <SelectValue placeholder="Select eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="guest">Guest Customers</SelectItem>
                <SelectItem value="first-time">First-time Buyers</SelectItem>
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
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
              title="Discount limit"
            />
          </div>

          {/* Start & End Date */}
          <div className="flex gap-4">
            <DatePicker
              label="Start Date"
              value={startDatePickerValue}
              onChange={startDatePickerSetterValue}
              placeholder="Start date"
            />
            
            <DatePicker
              label="End Date"
              value={endDatePickerValue}
              onChange={endDatePickerSetterValue}
              placeholder="End date"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E8E8E8] bg-white p-4 h-20 flex justify-center items-center sticky bottom-0">
          <Button
            text={updateDiscount.isPending ? "Saving..." : "Save"}
            type="button"
            variant="solid"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleUpdate();
            }}
            className="w-full md:max-w-[9.375rem]"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
