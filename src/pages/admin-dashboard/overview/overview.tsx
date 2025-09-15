import {
  ArrowRightIcon,
  CaretRightIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import { Link } from "react-router-dom";
import { OverviewTable } from "../admin-components/overViewTable/overview-data-table";
import Button from "../../../shared-components/button";
import NotificationBell from "../admin-components/top-bar/notification-bell";
import Overview from "../admin-components/top-overview-items";
import {
  useAdminDashboardMetrics,
  useAdminRecentActivities,
} from "../../../hooks/admin-dashboard.hooks";
import { useAuth } from "../../../hooks/use-auth";
import {
  convertMetricsToOverviewCards,
  formatCurrency,
  formatDate,
  getStatusColorClasses,
} from "../../../utils/admin-dashboard-utils";
import Spinner from "../../../shared-components/spinner";
import { EmptyStateCard } from "../admin-components/empty-state-card";

export function AdminDashboardOverview() {
  const { adminUser } = useAuth();
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useAdminDashboardMetrics();
  const {
    data: recentActivities,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useAdminRecentActivities();

  const title = (
    <div className="font-lora text-[#979797]">
      Welcome,{" "}
      <span className="font-lora text-[#1C1C1C]">
        {adminUser?.firstName || "Admin"}
      </span>
    </div>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Overview</span>
    </div>
  );

  console.log("metrics", metrics);

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
            <div className="flex justify-center items-center h-32">
              <Spinner size="lg" speed="fast" />
            </div>
          ) : metricsError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">
                Failed to load dashboard metrics. Please try again.
              </p>
            </div>
          ) : metrics ? (
            <Overview
              title="Overview"
              cards={convertMetricsToOverviewCards(metrics)}
            />
          ) : null}

          {/* Recent Orders and Requests */}
          <div className="w-full  bg-transparent  flex flex-col lg:flex-row gap-6">
            <div className=" lg:w-[35.438rem] bg-white rounded-md px-4 py-6 items-center justify-between ">
              <div className="flex items-center justify-between w-full">
                <h2 className="font-medium text-[28px] capitalize">
                  New Orders
                </h2>
                <Link
                  to="/admin-dashboard/order-management"
                  className="text-[#5D5D5D] capitalize"
                >
                  SEE ALL
                </Link>
              </div>
              {metricsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner size="md" speed="fast" />
                </div>
              ) : metrics?.mostRecentOrder ? (
                <div className="w-full border border-[#E8E8E8] flex flex-col items-start px-4 py-3 rounded-md mt-6">
                  <div
                    className={`${
                      getStatusColorClasses(metrics.mostRecentOrder.status)
                        .textColor
                    } ${
                      getStatusColorClasses(metrics.mostRecentOrder.status)
                        .bgColor
                    } px-2 text-xs py-1 inline-flex w-auto rounded-full capitalize`}
                  >
                    {metrics.mostRecentOrder.status}
                  </div>
                  <div className="flex items-center justify-between w-full mt-3">
                    <span className="text-xs text-[#5D5D5D]">
                      {metrics.mostRecentOrder.id}
                    </span>
                    <span className="text-sm text-[#3D3D3D] font-medium">
                      {formatCurrency(metrics.mostRecentOrder.totalAmount)}
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="text-[#3D3D3D] font-medium block text-sm">
                      {metrics.mostRecentOrder.customerName}
                    </span>
                    <span className="text-[#6D6D6D] text-xs">
                      {formatDate(metrics.mostRecentOrder.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#9A6C50] cursor-pointer mt-2">
                    <span>View Order</span>{" "}
                    <span>
                      <ArrowRightIcon />
                    </span>
                  </div>
                  <div className="bg-[#F0F2F5] h-[0.094rem] my-3 rounded-full w-full"></div>
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-[#16A34A] text-sm cursor-pointer">
                      Approve
                    </span>
                    <span className="text-[#DC2626] text-sm cursor-pointer">
                      Reject
                    </span>
                  </div>
                </div>
              ) : (
                <EmptyStateCard 
                  title="New Orders"
                  message="No new orders just yet."
                />
              )}
            </div>
            {/* Tailoring Requests */}
            <div className=" lg:w-[35.438rem] flex-auto bg-white rounded-md px-4 py-6 items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <h2 className="font-medium text-[28px] capitalize">
                  Tailoring Requests
                </h2>
                <Link
                  to="/admin-dashboard/order-management"
                  className="text-[#5D5D5D] "
                >
                  SEE ALL
                </Link>
              </div>
              {metricsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner size="md" speed="fast" />
                </div>
              ) : metrics?.mostRecentRequest ? (
                <div className="w-full border border-[#E8E8E8] flex flex-col items-start px-4 py-3 rounded-md mt-6">
                  <div
                    className={`${
                      getStatusColorClasses(metrics.mostRecentRequest.status)
                        .textColor
                    } ${
                      getStatusColorClasses(metrics.mostRecentRequest.status)
                        .bgColor
                    } px-2 text-xs py-1 inline-flex w-auto rounded-full capitalize`}
                  >
                    {metrics.mostRecentRequest.status}
                  </div>
                  <div className="flex items-center justify-between w-full mt-3">
                    <span className="text-xs text-[#5D5D5D]">
                      {metrics.mostRecentRequest.id}
                    </span>
                    <span className="text-sm text-[#3D3D3D] font-medium">
                      {formatCurrency(metrics.mostRecentRequest.totalAmount)}
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="text-[#3D3D3D] font-medium block text-sm">
                      {metrics.mostRecentRequest.customerName}
                    </span>
                    <span className="text-[#6D6D6D] text-xs">
                      {formatDate(metrics.mostRecentRequest.createdAt)}
                    </span>
                    {metrics.mostRecentRequest.fabricName && (
                      <span className="text-[#6D6D6D] text-xs block">
                        Fabric: {metrics.mostRecentRequest.fabricName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#9A6C50] cursor-pointer mt-2">
                    <span>View Request</span>{" "}
                    <span>
                      <ArrowRightIcon />
                    </span>
                  </div>
                  <div className="bg-[#F0F2F5] h-[0.094rem] my-3 rounded-full w-full"></div>
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-[#16A34A] text-sm cursor-pointer">
                      Approve
                    </span>
                    <span className="text-[#DC2626] text-sm cursor-pointer">
                      Reject
                    </span>
                  </div>
                </div>
              ) : (
                <EmptyStateCard 
                  title="Tailoring Requests"
                  message="No new request at the moment."
                />
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="w-full bg-white rounded-sm px-4 py-6 flex flex-col gap-6">
            <div className="w-full flex justify-between items-center">
              <h2 className="font-semibold text-[28px] capitalize">
                Recent Activity
              </h2>

              <Link
                to="/admin-dashboard/overview/recent-activity"
                className="text-[#5D5D5D] "
              >
                SEE ALL
              </Link>
            </div>
            {activitiesLoading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner size="lg" speed="fast" />
              </div>
            ) : activitiesError ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600">
                  Failed to load recent activities. Please try again.
                </p>
              </div>
            ) : recentActivities?.recentActivities &&
              recentActivities.recentActivities.length > 0 ? (
              <OverviewTable />
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-[#6D6D6D] text-sm">No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
