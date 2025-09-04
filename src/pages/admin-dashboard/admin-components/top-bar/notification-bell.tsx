import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "../../../ui/popover";
import { BellIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";

const NotificationBell = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="size-[40px] border border-neutral-100 rounded-[0.327rem] flex items-center justify-center hover:cursor-pointer">
          <BellIcon className="size-[1.25rem] block" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[25rem] flex items-start gap-4">
        <div>
          <h3 className="font-inter text-[#3D3D3D]">You’ve got a new order!</h3>
          <p className="text-[#4F4F4F] text-sm mt-1">
            You’ve just received a new order — view details to start processing.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#9A6C50] cursor-pointer mt-2">
            <span>View Order</span>
            <ArrowRightIcon />
          </div>
        </div>
        <PopoverClose asChild>
          <XIcon className="text-red-500 text-3xl cursor-pointer" />
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
