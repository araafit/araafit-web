import { CaretRightIcon, TrashIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import Overview from "../admin-components/top-overview-items";
import AvatarBadge from "./customers-avatar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "../../../shared-components/button";
import {
  useCustomer,
  useCustomerDetailMetrics,
  useBlockCustomer,
  useUnblockCustomer,
  useDeleteCustomer,
} from "../../../hooks/admin-customers.hooks";
import {
  formatCurrency,
  formatDate,
  getCustomerStatusClasses,
  convertCustomerDetailMetricsToCards,
} from "../../../utils/admin-customers-utils";
import Spinner from "../../../shared-components/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { useState } from "react";

export function AdminDashboardCustomersDetails() {
  const { customersId } = useParams<{ customersId: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, error } = useCustomer(customersId || "");
  const {
    data: detailMetrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useCustomerDetailMetrics(customersId || "");

  // State for modals
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  // Mutations
  const blockMutation = useBlockCustomer();
  const unblockMutation = useUnblockCustomer();
  const deleteMutation = useDeleteCustomer();

  const handleBlockToggle = async () => {
    try {
      if (customer?.status === "Blocked") {
        await unblockMutation.mutateAsync(customer.id);
      } else {
        if (!blockReason.trim()) {
          return;
        }
        await blockMutation.mutateAsync({
          id: customer!.id,
          request: { reason: blockReason },
        });
      }
      setIsBlockDialogOpen(false);
      setBlockReason("");
    } catch {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteReason.trim()) {
        return;
      }
      await deleteMutation.mutateAsync({
        id: customer!.id,
        request: { reason: deleteReason },
      });
      setIsDeleteDialogOpen(false);
      setDeleteReason("");
      // Navigate back to customers list after successful deletion
      navigate("/admin-dashboard/customers");
    } catch {
      // Error handled in hook
    }
  };

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

  console.log("customer", customer);

  return (
    <AdminDashboardLayout>
      <>
      <div className="h-screen">
        <div className="flex flex-col gap-2 relative">
          <TopBar
            title={title}
            breadCrumb={<BreadCrumb />}
            rightSide={
              <>
                {/* <NotificationBell /> */}
                <Link
                  to={`/admin-dashboard/customers/${customer.id}/activities`}
                >
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
          {metricsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="md" speed="fast" />
            </div>
          ) : metricsError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">
                Failed to load customer metrics
              </p>
            </div>
          ) : detailMetrics ? (
            <Overview
              title="Overview"
              hasBackButton={true}
              cards={convertCustomerDetailMetricsToCards(detailMetrics)}
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-gray-600 text-sm">No metrics available</p>
            </div>
          )}

          {/* */}
          <div className="bg-white w-full px-4 py-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-[28px] capitalize">
                Customer Information
              </h2>
              <button
                onClick={() => setIsBlockDialogOpen(true)}
                className={`font-light text-sm hover:underline ${
                  customer?.status === "Active"
                    ? "text-[#FF0005]"
                    : "text-[#9A6C50]"
                }`}
              >
                {customer?.status === "Inactive"
                  ? "Unblock Customer"
                  : "Block Customer"}
              </button>
            </div>

            <section>
              <div className="mt-6">
                <AvatarBadge
                  name={customerName}
                  isActive={customer.status === "Active"}
                  lastLogin={customer.joinedAt}
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
                      {customer.firstName}
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="lastName"
                      className="block font-light text-sm text-[#676767]"
                    >
                      Last Name
                    </label>
                    <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                      {customer.lastName}
                    </div>
                  </div>
                </div>

                {/* Email + DOB */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="email"
                      className="block font-light text-sm text-[#676767]"
                    >
                      Email
                    </label>
                    <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                      {customer.email}
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="dateOfBirth"
                      className="block font-light text-sm text-[#676767]"
                    >
                      Date Of Birth
                    </label>
                    <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                      {formatDate(customer.dateOfBirth)}
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
                    {customer.address || "No address provided"}
                  </div>
                </div>

                {/* Amount Spent */}
                <div className="mt-6">
                  <label
                    htmlFor="amountSpent"
                    className="block font-light text-sm text-[#676767]"
                  >
                    Total Amount Spent
                  </label>
                  <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                    {formatCurrency(customer.amountSpent)}
                  </div>
                </div>

                {/* Join Date */}
                <div className="mt-6">
                  <label
                    htmlFor="joinedAt"
                    className="block font-light text-sm text-[#676767]"
                  >
                    Joined Date
                  </label>
                  <div className="mt-1 block w-full h-14 px-3 pt-4 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg">
                    {formatDate(customer.joinedAt)}
                  </div>
                </div>

                {/* Block Reason (if blocked) */}
                {customer.status === "Blocked" && customer.blockReason && (
                  <div className="mt-6">
                    <label
                      htmlFor="blockReason"
                      className="block font-light text-sm text-[#676767]"
                    >
                      Block Reason
                    </label>
                    <div className="mt-1 block w-full min-h-14 px-3 pt-4 border text-sm text-[#DC2626] border-[#D0D5DD] rounded-lg">
                      {customer.blockReason}
                    </div>
                  </div>
                )}
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
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex gap-1 items-center cursor-pointer hover:opacity-80"
                >
                  <TrashIcon className="text-[#FF0005]" />
                  <p className="text-[#FF0005] font-light text-sm">
                    Delete account
                  </p>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Block/Unblock Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {customer?.status === "Blocked"
                ? "Unblock Customer"
                : "Block Customer"}
            </DialogTitle>
          </DialogHeader>
          {customer?.status === "Blocked" ? (
            <p className="text-sm text-gray-600">
              Are you sure you want to unblock this customer?
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to block this customer?
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for blocking
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Enter reason for blocking this customer..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex">
            <Button
              text="Cancel"
              variant="outline"
              onClick={() => {
                setIsBlockDialogOpen(false);
                setBlockReason("");
              }}
              className="border border-[#E7E7E7] text-[#3D3D3D] flex-1"
            />
            <Button
              text={
                blockMutation.isPending || unblockMutation.isPending
                  ? "Processing..."
                  : customer?.status === "Blocked"
                  ? "Unblock"
                  : "Block"
              }
              variant="solid"
              onClick={handleBlockToggle}
              disabled={
                (customer?.status !== "Blocked" && !blockReason.trim()) ||
                blockMutation.isPending ||
                unblockMutation.isPending
              }
              className="bg-[#9A6C50] text-white flex-1"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This action cannot be undone. Do you really want to delete this
              customer's account?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for deletion
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Enter reason for deleting this customer..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex">
            <Button
              text="Cancel"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteReason("");
              }}
              className="border border-[#E7E7E7] text-[#3D3D3D] flex-1"
            />
            <Button
              text={deleteMutation.isPending ? "Deleting..." : "Delete"}
              variant="solid"
              onClick={handleDelete}
              disabled={!deleteReason.trim() || deleteMutation.isPending}
              className="bg-[#DC2626] text-white flex-1"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    </AdminDashboardLayout>
  );
}
