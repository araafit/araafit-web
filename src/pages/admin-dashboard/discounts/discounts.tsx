import { CaretRightIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import { DiscountTable } from "../admin-components/discountsTable/discounts-table";
import Button from "../../../shared-components/button";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import { CreateDiscountDrawer } from "./new-discounts";
import { useState } from "react";
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

// eslint-disable-next-line react-refresh/only-export-components
export const discountData: Discount[] = [
  {
    id: "1",
    name: "New User Discount",
    type: "Percentage",
    value: "10%",
    eligible: "First-time buyers",
    startDate: "27 Aug 2020 10:26 AM",
    endDate: "26 Aug 2020 10:01 PM",
    status: "Active",
  },
  {
    id: "2",
    name: "Guest Discount",
    type: "Flat",
    value: "₦2000",
    eligible: "Guest customers",
    startDate: "27 Aug 2020 10:26 AM",
    endDate: "26 Aug 2020 10:01 PM",
    status: "Inactive",
  },
];
const totalDiscounts = discountData.length;

export function AdminDashboardDiscounts() {
  const title = <div className="font-lora text-[#1C1C1C]">Discounts</div>;

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Discounts</span>
    </div>
  );
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  return (
    <AdminDashboardLayout>
      <div className="h-screen">
        <div className="flex flex-col gap-2 relative">
          <TopBar
            title={title}
            breadCrumb={<BreadCrumb />}
            rightSide={
              <>
                <NotificationBell />

                <Button
                  text="New discount"
                  variant="solid"
                  className="text-white shadow-sm"
                  onClick={() => setIsCreateDrawerOpen(true)}
                />
              </>
            }
          />
        </div>
        <div className="w-full  flex flex-col gap-4 p-4 mt-20 overflow-y-scroll px-10">
          <section className="flex gap-0 flex-col">
            <div className="flex items-center justify-between bg-white rounded-t-md border-b py-4 px-4">
              <h2 className="font-lora text-[28px] text-[#1C1C1C] flex items-center gap-2">
                Total Discounts
                <span className="font-lora">{totalDiscounts}</span>
              </h2>
            </div>
            <DiscountTable data={discountData} />
          </section>
        </div>
        <CreateDiscountDrawer
          open={isCreateDrawerOpen}
          onOpenChange={setIsCreateDrawerOpen}
        />
      </div>
    </AdminDashboardLayout>
  );
}
