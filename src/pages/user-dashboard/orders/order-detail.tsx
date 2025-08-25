import {
  CaretRightIcon,
  HouseSimpleIcon,
  MapPinSimpleIcon,
  PackageIcon,
} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import DashboardLayout from "../../../layouts/dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import { rtw2 } from "../images/image-entry";
import TopBar from "../top-bar";
import OrderHistory from "./order-history";

/* --------------------------------------------------- */

export function DashboardOrderDetailPage() {
  const location = useLocation();
  const splitLocation = location.pathname.split("/").slice(-2);

  const statusAlert = (status: string) => (
    <span
      className={`size-fit py-[2px] px-2 text-xs rounded-2xl ${
        status === "sewing"
          ? "bg-[#F0FAFF] text-[#0EA5E9]"
          : status === "out for delivery"
          ? "bg-[#EFF4FF] text-[#3B76F6]"
          : ""
      }`}
    >
      {status}
    </span>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <Link to={`/dashboard/${splitLocation[0]}`} className="text-primary-900">
        {splitLocation[0]}
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{splitLocation[1]}</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="h-screen overflow-y-hidden">
        <div className="flex flex-col gap-2 relative mb-4">
          <TopBar
            title="Orders"
            breadCrumb={<BreadCrumb />}
            rightSide={
              <Button
                text="Cancel"
                variant="clear"
                className="w-full max-w-[10.625rem] border border-neutral-200 text-red-500 disabled:text-red-100 disabled:cursor-not-allowed"
                disabled
              />
            }
          />
        </div>

        <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
          <div className="w-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
            <h2 className="font-semibold text-[28px] capitalize">
              Tracking Information
            </h2>

            <div className="w-full border border-neutral-100 rounded-md py-5 px-8">
              <div className="inline-flex flex-col gap-[9px] text-[0.875rem] mb-3">
                {statusAlert("out for delivery")}
                <span className="font-light text-[#494949]">
                  Order ID: 192353
                </span>
                <span className="font-light text-[#494949]">
                  Date Ordered: 15 May 2025 8:30:44 AM
                </span>
              </div>

              <div className="flex items-center gap-2 h-[3.9375rem]">
                <div className="h-full flex flex-col gap-1">
                  <HouseSimpleIcon className="size-[1.25rem]" />
                  <span className="font-semibold text-[0.875rem]">Araafit</span>
                  <small>15 May, 2025</small>
                </div>

                <div className="h-[5px] rounded-full bg-[#F7F3EF] relative grow">
                  <div className="size-[2rem] bg-primary-200 flex items-center justify-center rounded-full absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2">
                    <PackageIcon className="text-primary-900" />
                  </div>
                </div>

                <div className="h-full flex flex-col gap-1">
                  <MapPinSimpleIcon className="size-[1.25rem]" />
                  <span className="font-semibold text-[0.875rem]">You</span>
                  <small>18 May, 2025</small>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pb-12">
            <div className="py-5 px-8 bg-white rounded-md flex flex-col gap-6">
              <h3 className="text-[1.75rem] font-semibold">Order History</h3>

              <OrderHistory />
            </div>

            <div className="py-5 px-8 flex bg-white rounded-md flex-col justify-center gap-6">
              <h3 className="text-[1.75rem] font-semibold">Order Summary</h3>

              <img src={rtw2} alt="" className="" />

              <div className="w-full flex flex-col item-center justify-center gap-4">
                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">
                    Item name:
                  </span>

                  <span className="font-medium text-neutral-950">
                    Araafit Blue Jumpsuit
                  </span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">
                    Dress size:
                  </span>

                  <span className="font-medium text-neutral-950">14</span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">Quantity:</span>

                  <span className="font-medium text-neutral-950">1</span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">Price:</span>

                  <span className="font-medium text-neutral-950">
                    ₦80,000.00
                  </span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">VAT:</span>

                  <span className="font-medium text-neutral-950">₦0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
