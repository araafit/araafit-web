import * as React from "react";

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

interface CreateDiscountDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateDiscountDrawer: React.FC<CreateDiscountDrawerProps> = ({
  open,
  onOpenChange,
}) => {
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
                <TooltipContent className="max-w-[330px]">
                  <p>Create a brand new discount and configure its details.</p>
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
              className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Discount Type */}
          <div className="space-y-2">
            <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
              Discount Type
            </label>
            <Select>
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
              placeholder="e.g. 20"
              className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Eligible Applicant */}
          <div className="space-y-2">
            <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
              Eligible Applicant
            </label>
            <Select>
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
              Usage Limit
            </label>
            <input
              type="number"
              placeholder="e.g. 100"
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
                className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
                End Date
              </label>
              <input
                type="date"
                className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E8E8E8] bg-white p-4 h-20 flex justify-center items-center sticky bottom-0">
          <Button
            text="Create"
            type="button"
            variant="solid"
            className="w-full md:max-w-[9.375rem]"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
