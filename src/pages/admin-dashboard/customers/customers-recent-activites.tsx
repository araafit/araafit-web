import { ArrowLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../shared-components/button";
import { ExportIcon } from "@phosphor-icons/react";
import { CustomerActivitiesTable } from "../admin-components/customersTable/customer-recent-activities-table";
import { useCustomer } from "../../../hooks/admin-customers.hooks";
import { getCustomerStatusClasses } from "../../../utils/admin-customers-utils";
import Spinner from "../../../shared-components/spinner";

export function AdminDashboardCustomersActivities() {
  const navigate = useNavigate();
  const { customersId } = useParams<{ customersId: string }>();
  const { data: customer, isLoading, error } = useCustomer(customersId || "");

  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <Spinner size="lg" speed="fast" />
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error || !customer) {
    return (
      <AdminDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <p className="text-red-600">Failed to load customer details</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const statusClasses = getCustomerStatusClasses(customer.status);
  const customerName = `${customer.firstName} ${customer.lastName}`;

  const title = (
    <div className="font-lora flex items-center gap-2 text-[#1C1C1C]">
      {customerName}{" "}
      <div
        className={`px-2 py-1 text-xs rounded-full h-[22px] text-center ${statusClasses.bgColor} ${statusClasses.textColor}`}
      >
        {customer.status}
      </div>
    </div>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-primary-900" />
      <span className="text-primary-900"> Customers</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{customerName}</span>
    </div>
  );

  return (
    <AdminDashboardLayout>
      <div className="h-screen">
        <div className="flex flex-col gap-2 relative">
          <TopBar title={title} breadCrumb={<BreadCrumb />} />
        </div>
        <section className="bg-white h-72 mt-20 max-w-[1158px] mx-auto">
          <div className="w-full  max-w-[1158px]  bg-white rounded-sm px-4 py-6  gap-6 mt-32">
            <div className="flex justify-between items-center w-full mb-5">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-3 ">
                  <ArrowLeftIcon
                    className="mt-3 cursor-pointer"
                    onClick={() => navigate(-1)}
                  />
                  <div>
                    <h2 className="font-semibold text-[28px] capitalize">
                      Recent Activity
                    </h2>
                    <span className="text-[#5D5D5D] text-sm mt-2">
                      Track your latest updates in real time.
                    </span>
                  </div>
                </div>
              </div>
              <Button
                text="Export"
                icon={<ExportIcon className="size-[1.25rem] text-[#3D3D3D]" />}
                // variant="solid"
                className=" text-[#3D3D3D] border border-[#E7E7E7] h-10 shadow-sm"
              />
            </div>
            <CustomerActivitiesTable />
          </div>
        </section>
      </div>
    </AdminDashboardLayout>
  );
}
