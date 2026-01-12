import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useParams, Link } from "react-router-dom";
import { DressDetail } from "../../../shared-components/shop/dress-detail";
import { useProduct } from "../../../hooks/user-dashboard.hooks";

/* -------------------------------------------------------- */

export function DashboardShopDressDetailPage() {
  const params = useParams<{ shopTab: string; itemName: string }>();
  const rawParam = params.itemName || "";
  const { data: product } = useProduct(rawParam);

  const crumbLabel =
    (product?.slug || product?.name || rawParam).replaceAll("-", " ");

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/shop" className="text-primary-900">
        Shop
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/shop/women?tab=dress" className="text-primary-900">
        dress
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{crumbLabel}</span>
    </div>
  );

  return (
    <UserDashboardLayout>
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="Shop" breadCrumb={<BreadCrumb />} />

        <div className="w-full h-[95%] flex justify-center p-4 mt-20 overflow-y-scroll">
          <DressDetail />
        </div>
      </div>
    </UserDashboardLayout>
  );
}
