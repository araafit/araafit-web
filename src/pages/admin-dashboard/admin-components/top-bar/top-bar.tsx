// import React, { type ReactElement } from "react";
// import {
//   BellIcon,
//   PlusIcon,
//   ArrowRightIcon,
//   XIcon,
// } from "@phosphor-icons/react";
// import Button from "../../../../shared-components/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
//   PopoverClose,
// } from "../../../ui/popover";
// /* -------------------------------------------------------------------- */

// type TopBarType = {
//   title: React.ReactNode;
//   breadCrumb: React.ReactNode;
//   notificationCount?: number | string;
//   className?: string;
//   leftSide?: ReactElement;
//   rightSide?: ReactElement;
// };

// export default function TopBar({
//   rightSide,
//   leftSide,
//   title,
//   breadCrumb = "home",
// }: TopBarType) {
//   return (
//     <div className=" h-[4.8125rem] fixed top-0  lg:left-[12.375rem] w-full lg:w-[calc(100%-12.375rem)] bg-white px-10 py-[0.375rem] flex items-center justify-between">
//       {leftSide ? (
//         leftSide
//       ) : (
//         <div className="flex flex-col  gap-2">
//           <h2 className="font-medium text-[1.75rem] capitalize">{title}</h2>
//           {breadCrumb}
//         </div>
//       )}

//       {rightSide ? (
//         rightSide
//       ) : (
//         <div className="lg:flex hidden items-center   gap-6">
//           <Popover>
//             <PopoverTrigger>
//               {" "}
//               <div className="size-[40px] border border-neutral-100 rounded-[0.327rem] flex items-center justify-center hover:cursor-pointer">
//                 <BellIcon className="size-[1.25rem] block" />
//               </div>
//             </PopoverTrigger>
//             <PopoverContent className="w-[25rem] flex items-start gap-4 ">
//               <div>
//                 <h3 className="font-inter text-[#3D3D3D]">
//                   You’ve got a new order!
//                 </h3>
//                 <p className="text-[#4F4F4F] text-sm mt-1">
//                   You’ve just received a new order — view details to start
//                   processing.
//                 </p>
//                 <div className="flex items-center gap-2 text-sm text-[#9A6C50] cursor-pointer mt-2">
//                   <span>View Order</span>{" "}
//                   <span>
//                     <ArrowRightIcon />
//                   </span>
//                 </div>
//               </div>
//               <PopoverClose asChild>
//                 <XIcon className="text-red-500 text-3xl cursor-pointer" />
//               </PopoverClose>
//             </PopoverContent>
//           </Popover>

//           <Button
//             text="Add Inventory"
//             icon={<PlusIcon className="size-[1.25rem] text-white" />}
//             variant="solid"
//             className=" text-white shadow-sm"
//           />
//         </div>
//       )}
//     </div>
//   );
// }
import React, { type ReactElement } from "react";

type TopBarType = {
  title: React.ReactNode;
  breadCrumb: React.ReactNode;
  notificationCount?: number | string;
  className?: string;
  leftSide?: ReactElement;
  rightSide?: ReactElement;
};

export default function TopBar({
  rightSide,
  leftSide,
  title,
  breadCrumb = "home",
}: TopBarType) {
  return (
    <div className="h-[4.8125rem] fixed top-0 lg:left-[12.375rem] w-full lg:w-[calc(100%-12.375rem)] bg-white px-10 py-[0.375rem] flex items-center justify-between">
      {leftSide ? (
        leftSide
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-[1.75rem] capitalize">{title}</h2>
          {breadCrumb}
        </div>
      )}

      {rightSide && (
        <div className="lg:flex hidden items-center gap-6">{rightSide}</div>
      )}
    </div>
  );
}
