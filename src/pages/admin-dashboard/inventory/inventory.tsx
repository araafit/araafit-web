import { CaretRightIcon, DressIcon, PlusIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import Stockcount from "./stock-count";
import { DataTable } from "../admin-components/inventoryTable/inventory-table";
import {
  useProductMetrics,
  useProducts,
} from "../../../hooks/admin-inventory.hooks";
import { convertApiProductsToInventoryFormat } from "../../../utils/admin-inventory-utils";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import Spinner from "../../../shared-components/spinner";

/* ------------------------------------------------------------------------------------ */

export function AdminDashboardInventory() {
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useProductMetrics();
  const {
    data,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts();

  /* The API returns an object with a 'products' property that is an array.
  not an array of products */
  //@ts-expect-error // Temporary fix for type mismatch
  const products = data?.products || [];

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
            {metricsLoading ? (
              <div className="flex justify-center items-center h-20">
                <Spinner size="lg" speed="fast" />
              </div>
            ) : metricsError ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600">Failed to load inventory metrics</p>
              </div>
            ) : metrics ? (
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-[#E8E8E8] rounded flex items-center justify-center">
                  <DressIcon className="size-[1.25rem]" />
                </div>
                <section className="flex items-center">
                  <div className="w-32">
                    <h6 className="font-light font-inter text-[#979797]">
                      Total Inventory
                    </h6>
                    <span className="font-medium text-xl">
                      {metrics.totalInventory}
                    </span>
                  </div>
                  <div className="w-32">
                    <h6 className="font-light font-inter text-[#979797]">
                      Dresses
                    </h6>
                    <span className="font-medium text-xl">
                      {metrics.totalDresses}
                    </span>
                  </div>
                  <div className="w-32">
                    <h6 className="font-light font-inter text-[#979797]">
                      Fabrics
                    </h6>
                    <span className="font-medium text-xl">
                      {metrics.totalFabrics}
                    </span>
                  </div>
                </section>
                <Stockcount />
              </div>
            ) : null}
          </div>

          {/* ------------------- */}
          <div className="w-full  bg-white rounded-sm px-4 mt-6 py-6 flex flex-col gap-6">
            {productsLoading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner size="lg" speed="fast" />
              </div>
            ) : productsError ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600">
                  Failed to load products. Please try again.
                </p>
              </div>
            ) : products ? (
              <DataTable data={convertApiProductsToInventoryFormat(products)} />
            ) : (
              <DataTable data={[]} />
            )}
          </div>
          <Outlet />
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
