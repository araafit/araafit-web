import { CaretRightIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useDiscounts } from "../../../hooks/admin-discounts.hooks";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import Spinner from "../../../shared-components/spinner";
import { convertApiDiscountsToTable } from "../../../utils/admin-discounts-utils";
import { DiscountTable } from "../admin-components/discountsTable/discounts-table";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import TopBar from "../admin-components/top-bar/top-bar";
import { CreateDiscountDrawer } from "./new-discounts";

/* -------------------------------------------------------------------------------- */

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

export function AdminDashboardDiscounts() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const { data, isLoading, error } = useDiscounts();
  const tableData = data ? convertApiDiscountsToTable(data) : [];
  const totalDiscounts = data?.length ?? 0;

  const title = <div className="font-lora text-[#1C1C1C]">Discounts</div>;

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Discounts</span>
    </div>
  );

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
          {showDisclaimer && (
            <div className="flex items-start gap-3 p-4 bg-[#FFF8EB] border border-[#FCBB4D] rounded-md relative">
              <WarningIcon className="text-[#B47409]" />

              <div>
                <strong className="text-[#B47409]">Disclaimer</strong>
                <p className="text-[#D98B06]">
                  If product discounts exist, customers will always see the
                  lowest price — whether from the product or this app-wide
                  discount.
                </p>
              </div>

              <XIcon
                size={20}
                className="text-[#B47409] font-semibold absolute right-3 cursor-pointer"
                onClick={() => setShowDisclaimer(false)}
              />
            </div>
          )}

          <section className="flex gap-0 flex-col">
            <div className="flex items-center justify-between bg-white rounded-t-md border-b py-4 px-4">
              <h2 className="font-lora text-[28px] text-[#1C1C1C] flex items-center gap-2">
                Total Discounts
                <span className="font-lora">{totalDiscounts}</span>
              </h2>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12 bg-white rounded-b-md">
                <Spinner size="lg" speed="fast" arcColor="#9A6C50" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-6">
                <p className="text-red-600">Failed to load discounts</p>
              </div>
            ) : (
              <DiscountTable
                data={tableData as Discount[]}
                openCreateDrawer={setIsCreateDrawerOpen}
              />
            )}
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
