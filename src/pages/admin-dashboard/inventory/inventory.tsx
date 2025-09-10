import { CaretRightIcon, DressIcon, PlusIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import Stockcount from "./stock-count";
import { DataTable } from "../admin-components/inventoryTable/inventory-table";
import { InventoryItems } from "../_data/_overview";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export function AdminDashboardInventory() {
  const title = (
    <div className="font-lora font-medium text-[#1C1C1C]">Inventory</div>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Inventory</span>
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
                <Link to={`/admin-dashboard/inventory/upload`}>
                  <Button
                    text="Add Inventory"
                    icon={<PlusIcon className="size-[1.25rem] text-white" />}
                    variant="solid"
                    className="text-white shadow-sm"
                  />
                </Link>
              </>
            }
          />
        </div>

        <div className="w-full  flex flex-col  p-4 mt-20 overflow-y-scroll px-10">
          <h2 className="font-semibold text-[28px]">Inventory</h2>
          <span className="capitalize text-neutral-400 font-light cursor-pointer font-inter">
            Track and manage your inventory with ease.
          </span>
          {/* ----------- */}
          <div className="bg-white w-full max-w-[1126px] mx-auto py-4 my-8 flex justify-center rounded-sm items-center">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-[#E8E8E8] rounded flex items-center justify-center">
                <DressIcon className="size-[1.25rem]" />
              </div>
              <section className="flex items-center">
                <div className="w-32">
                  <h6 className="font-light font-inter text-[#979797]">
                    Total Inventory
                  </h6>
                  <span className="font-medium text-xl">600</span>
                </div>
                <div className="w-32">
                  <h6 className="font-light font-inter text-[#979797]">
                    Dresses
                  </h6>
                  <span className="font-medium text-xl">600</span>
                </div>
                <div className="w-32">
                  <h6 className="font-light font-inter text-[#979797]">
                    Fabrics
                  </h6>
                  <span className="font-medium text-xl">600</span>
                </div>
              </section>
              <Stockcount />
            </div>
          </div>

          {/* ------------------- */}
          <div className="w-full  bg-white rounded-sm px-4 mt-6 py-6 flex flex-col gap-6">
            <DataTable data={InventoryItems} />
          </div>
          <Outlet />
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
