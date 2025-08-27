import React from "react";
import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

/* ----------------------------------- */

export function DashboardShopDetailPage() {
  const params = useParams<{ shopTab: string; itemName: string }>();
  const itemName = params.itemName?.replaceAll("-", " ");
  const shopTab = params.shopTab?.replaceAll("-", " ");

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/shop/" className="text-primary-900">Shop</Link>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{shopTab}</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{itemName}</span>
    </div>
  );

  return (
    <UserDashboardLayout>
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="Shop" breadCrumb={<BreadCrumb />} />
      </div>
    </UserDashboardLayout>
  );
}
