import { CaretRightIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Overview from "../admin-components/top-overview-items";
import NotificationBell from "../admin-components/top-bar/notification";
import { DataTable } from "../admin-components/customersTable/customers-table";
import { useCustomerMetrics } from "../../../hooks/admin-customers.hooks";
import { convertCustomerMetricsToCards } from "../../../utils/admin-customers-utils";
import Spinner from "../../../shared-components/spinner";

/* -------------------------------------------------------------------------------------------------------------- */

export function AdminDashboardCustomers() {
  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = useCustomerMetrics();

  const overviewCards = metricsData
    ? convertCustomerMetricsToCards(metricsData)
    : [];

  const title = <div className="font-lora text-[#1C1C1C]">Customers</div>;

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]"> Customers</span>
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
              </>
            }
          />
        </div>

        <div className="w-full  flex flex-col gap-4 p-4 mt-20 overflow-y-scroll px-10">
          {metricsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner
                size="md"
                speed="fast"
                arcColor="#523531"
                isLoading={metricsLoading}
              />
            </div>
          ) : metricsError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">Failed to load metrics</p>
            </div>
          ) : (
            <Overview title="Overview" cards={overviewCards} />
          )}

          {/* */}
          <div>
            <h2 className="font-semibold text-[28px] capitalize">Customers</h2>

            <span className="font-light text-neutral-400 cursor-pointer font-inter">
              Manage customer details with ease.
            </span>
          </div>

          {/* -------- */}
          <section className="flex items-center justify-between mb-5">
            <DataTable />
          </section>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
