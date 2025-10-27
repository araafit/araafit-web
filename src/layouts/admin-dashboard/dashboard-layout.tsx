import React, { useState, useEffect, createElement } from "react";
import {
  HouseSimpleIcon,
  GearIcon,
  DressIcon,
  SealPercentIcon,
  ShoppingBagIcon,
  UserIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLoader from "./loader";
import Modal from "../../shared-components/modal";
import { useSwitch } from "../../shared-hooks/switch";
import Button from "../../shared-components/button";
import { NavLink } from "react-router-dom";
import Spinner from "../../shared-components/spinner";
import { useAdminLogout } from "../../hooks/admin-auth.hooks";

/* ------------------------------------------------------ */

const navMenu = [
  {
    name: "Overview",
    link: "/admin-dashboard/overview",
    icon: HouseSimpleIcon,
  },
  {
    name: "Order Management",
    link: "/admin-dashboard/order-management",
    icon: ShoppingBagIcon,
  },
  { name: "Inventory", link: "/admin-dashboard/inventory", icon: DressIcon },
  {
    name: "Discounts",
    link: "/admin-dashboard/discounts",
    icon: SealPercentIcon,
  },
  {
    name: "Customers",
    link: "/admin-dashboard/customers",
    icon: UserIcon,
  },
  { name: "Settings", link: "/admin-dashboard/settings", icon: GearIcon },
];

/**
 * Araafit user dashboard layout.
 *
 * @returns ReactElement
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const { toggleSwitch, switchValue } = useSwitch(false);
  const navigate = useNavigate();
  const logoutMutation = useAdminLogout();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const waitASecond = async () =>
      setTimeout(() => setLoading(false), 1000);

    waitASecond();
  }, [loading]);

  // Handle logout success
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      toggleSwitch(); // Close modal
      navigate("/auth/admin-login"); // Redirect to admin login
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutMutation.isSuccess]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <section className="h-screen bg-[#F5F5F5] flex items-start">
      <div className="w-[12.375rem] h-screen hidden  lg:block fixed left-0 top-0 border-r-2 border-neutral-100 bg-white">
        <div className="w-full h-[90%] flex flex-col justify-between">
          <div>
            <Link to="/" className="block w-full mb-7">
              <img
                src="/logo/logo.png"
                alt="Araafit logo"
                className="w-[5.626rem] h-auto"
              />
            </Link>

            <div className="flex flex-col gap-4">
              {navMenu.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.link}
                  end={item.name.toLowerCase() === "overview"}
                  className={({ isActive }) =>
                    `px-3 py-3 transition-colors w-full flex items-center justify-between ${
                      isActive
                        ? "bg-primary-900 text-white"
                        : "text-neutral-900 hover:bg-primary-900 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center text-base">
                    {item.name.toLowerCase() === "profile" ? (
                      <span className="uppercase mr-3 size-[20px] text-[10px] border border-primary-50 p-1 rounded-full flex items-center justify-center">
                        en
                      </span>
                    ) : (
                      createElement(item.icon ?? "a", { className: "mr-3 w-5 h-5" })
                    )}

                    <span className="capitalize text-sm ml-2">{item.name}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          <div
            className="text-[0.875rem] flex items-center gap-[0.75rem] text-neutral-900 border-t-2 border-neutral-100 p-[0.5rem] hover:bg-primary-900 hover:text-white cursor-pointer"
            onClick={toggleSwitch}
          >
            <SignOutIcon />
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="grow overflow-y-auto lg:ml-[12.375rem]">
        {loading ? <DashboardLoader /> : children}
      </div>

      {/* Logout redirection modal */}
      <Modal
        onClose={toggleSwitch}
        isOpen={switchValue}
        containerClassName="w-full max-w-[25rem]"
      >
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-medium text-[2rem] text-neutral-950">Logout!</h2>
          <p className="text-neutral-700 text-center">
            Are you sure you want to logout of your account?
          </p>

          <Button
            text="Cancel"
            variant="clear"
            className="w-full text-neutral-900 shadow-sm"
            onClick={toggleSwitch}
          />

          <Button
            text="Logout"
            variant="solid"
            disabled={logoutMutation.isPending}
            className="w-full bg-red-600 text-white"
            onClick={handleLogout}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Logout</span>
              {logoutMutation.isPending && <Spinner size="sm" speed="fast" />}
            </div>
          </Button>
        </div>
      </Modal>
    </section>
  );
}
