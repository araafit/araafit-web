import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FabricDetail } from "../../../shared-components/shop/fabric-detail";

/* ---------------------------------------------------------------------------------- */

export function DashboardShopFabricDetailPage() {
  const params = useParams<{ shopTab: string; itemName: string }>();
  const itemName = params.itemName?.replaceAll("-", " ");

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/shop/" className="text-primary-900">
        Shop
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/shop/dress" className="text-primary-900">
        Fabrics
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{itemName}</span>
    </div>
  );

  return (
    <UserDashboardLayout>
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="Shop" breadCrumb={<BreadCrumb />} />

        <div className="w-full h-[95%] flex justify-center p-4 mt-20 overflow-y-scroll">
          <FabricDetail />
        </div>
      </div>
    </UserDashboardLayout>
  );
}
