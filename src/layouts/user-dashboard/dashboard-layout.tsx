import React, { useState, useEffect, createElement } from "react";
import {
  HouseSimpleIcon,
  DressIcon,
  ShoppingBagIcon,
  ShoppingCartSimpleIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import DashboardLoader from "./loader";
import Modal from "../../shared-components/modal";
import { useSwitch } from "../../shared-hooks/switch";
import Button from "../../shared-components/button";
import { useCart } from "../../hooks/cart.hooks";
import { useLogout } from "../../hooks/auth.hooks";
import Spinner from "../../shared-components/spinner";

/* ------------------------------------------------------ */

const navMenu = [
  { name: "home", link: "/dashboard", icon: HouseSimpleIcon },
  { name: "shop", link: "/dashboard/shop", icon: DressIcon },
  { name: "orders", link: "/dashboard/orders", icon: ShoppingBagIcon },
  { name: "cart", link: "/dashboard/cart", icon: ShoppingCartSimpleIcon },
  { name: "profile", link: "/dashboard/profile" },
];

/**
 * Araafit user dashboard layout.
 *
 * @returns ReactElement
 */
export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const { toggleSwitch, switchValue } = useSwitch(false);
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const [loading, setLoading] = useState(true);

  // Handle logout success
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      toggleSwitch(); // Close modal
      navigate("/auth/login"); // Redirect to login
    }
  }, [logoutMutation.isSuccess]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useEffect(() => {
    const waitASecond = async () =>
      await setTimeout(() => setLoading(false), 1000);

    waitASecond();
  }, [loading]);

  return (
    <section className="h-screen bg-[#F5F5F5] flex items-start">
      <div className="w-[12.375rem] h-screen border-r-2 border-neutral-100 bg-white">
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
              {navMenu.map((item, idx) => {
                if (item.name.toLowerCase() !== "profile") {
                  if (item.name.toLowerCase() === "cart") {
                    return (
                      <NavLink
                        to={item.link}
                        key={idx}
                        end={item.name.toLowerCase() === "home"}
                        className={({ isActive }) =>
                          `w-full flex flex-col gap-4 p-[0.5rem] transition-colors ${
                            isActive
                              ? "bg-primary-900 text-white"
                              : "text-neutral-900 hover:bg-primary-900 hover:text-white"
                          }`
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-full flex items-center text-base">
                            {createElement(item.icon ? item.icon : "a", {
                              className: "mr-3",
                            })}
                            <span className="capitalize text-sm">
                              {item.name}
                            </span>
                          </div>

                          <span className="w-[26px] h-[19px] py-[2px] px-[10px] bg-primary-50 text-[0.875rem] !text-[#1C1C1C] rounded-full flex items-center justify-center">
                            {cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0}
                          </span>
                        </div>
                      </NavLink>
                    );
                  }

                  return (
                    <NavLink
                      to={item.link}
                      key={idx}
                      end={item.name.toLowerCase() === "home"}
                      className={({ isActive }) =>
                        `w-full flex flex-col gap-4 p-[0.5rem] transition-colors ${
                          isActive
                            ? "bg-primary-900 text-white"
                            : "text-neutral-900 hover:bg-primary-900 hover:text-white"
                        }`
                      }
                    >
                      <div className="w-full flex items-center text-base">
                        {createElement(item.icon ? item.icon : "a", {
                          className: "mr-3",
                        })}
                        <span className="capitalize text-sm">{item.name}</span>
                      </div>
                    </NavLink>
                  );
                }

                return (
                  <NavLink
                    to={item.link}
                    key={idx}
                    end={item.name.toLowerCase() === "home"}
                    className={({ isActive }) =>
                      `w-full flex flex-col gap-4 p-[0.5rem] transition-colors ${
                        isActive
                          ? "bg-primary-900 text-white"
                          : "text-neutral-900 hover:bg-primary-900 hover:text-white"
                      }`
                    }
                  >
                    <div className="w-full flex items-center text-base">
                      <span className="uppercase mr-3 size-[20px] text-[10px] border border-primary-50 p-1 rounded-full flex items-center justify-center">
                        en
                      </span>

                      <span className="capitalize text-sm">{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
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

      <div className="grow">{loading ? <DashboardLoader /> : children}</div>

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
            variant="clear"
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
