import { CaretRightIcon, TrashIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import { OverviewCards4 } from "../_data/_overview";
import Overview from "../admin-components/top-overview-items";
import AvatarBadge from "./customers-avatar";
import { Link } from "react-router-dom";
import Button from "../../../shared-components/button";

export function AdminDashboardCustomersDetails() {
  const title = (
    <div className="font-lora flex items-center gap-2 text-[#1C1C1C]">
      Toluwani Bakare{" "}
      <div
        className={`px-2 py-1 text-xs rounded-full h-[22px] text-center bg-[#F0FDF5] text-[#16A34A]`}
      >
        Active
      </div>
    </div>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-primary-900" />
      <span className="text-primary-900"> Customers</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Toluwani Bakare</span>
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
                {/* <NotificationBell /> */}
                <Link to={`/admin-dashboard/customers/123/activities`}>
                  <Button
                    text="View Activities"
                    variant="clear"
                    className="text-[#9A6C50]"
                  />
                </Link>
              </>
            }
          />
        </div>

        <div className="w-full  flex flex-col gap-4 p-4 mt-20 overflow-y-scroll px-10">
          <Overview title="Overview" cards={OverviewCards4} />

          {/* */}
          <div className="bg-white w-full px-4 py-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-[28px] capitalize">
                Customer Information
              </h2>
              <p className="text-[#FF0005] font-light text-sm">
                Block Customer
              </p>
            </div>

            <section>
              <div className="mt-6">
                <AvatarBadge
                  name="Ada Lovelace"
                  isActive={true}
                  lastLogin="2025-09-05T12:00:00Z"
                />
              </div>
            </section>
            <section>
              <div className="bg-white p-6 rounded-xl font-light space-y-6">
                {/* First + Last Name */}
                <div className="flex gap-4 font-light">
                  <div className="flex-1">
                    <label
                      htmlFor="firstName"
                      className="block font-light text-sm text-[#676767]"
                    >
                      First Name
                    </label>
                    <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                      First Name
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="firstName"
                      className="block font-light text-sm text-[#676767]"
                    >
                      Last Name
                    </label>
                    <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                      Last Name
                    </div>
                  </div>
                </div>

                {/* Email + DOB */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="firstName"
                      className="block font-light text-sm text-[#676767]"
                    >
                      First Name
                    </label>
                    <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                      Email
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="firstName"
                      className="block font-light text-sm text-[#676767]"
                    >
                      Date Of Birth
                    </label>
                    <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                      First Name
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                  <label
                    htmlFor="address"
                    className="block font-light text-sm text-[#676767]"
                  >
                    Address
                  </label>
                  <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                    Enter full address
                  </div>
                </div>
              </div>
            </section>
          </div>
          <section className="mt-4 ">
            <div className="bg-white p-6  font-light space-y-6">
              <div className="flex justify-between items-center">
                <div className="max-w-[386px]">
                  <h2 className="font-semibold text-[28px] capitalize">
                    Delete Account
                  </h2>
                  <p className="text-[#4F4F4F] text-sm mt-3">
                    Deleting this account will permanently remove the customer’s
                    information. This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-1 items-center cursor-pointer">
                  <TrashIcon className="text-[#FF0005]" />
                  <p className="text-[#FF0005] font-light text-sm">
                    Delete account
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
