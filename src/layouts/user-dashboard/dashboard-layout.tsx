import React, { useEffect, createElement, useState } from "react";
import {
  HouseSimpleIcon,
  DressIcon,
  ShoppingBagIcon,
  ShoppingCartSimpleIcon,
  SignOutIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate, NavLink } from "react-router-dom";
// import LoaderSkin from "./loader";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <section className="h-screen bg-[#F5F5F5] flex items-start">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100 p-4 flex items-center justify-between">
        <Link to="/" className="block">
          <img
            src="/logo/logo.png"
            alt="Araafit logo"
            className="w-[5.626rem] h-auto"
          />
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <XIcon size={24} /> : <ListIcon size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-[12.375rem] h-screen border-r-2 border-neutral-100 bg-white
        lg:block
        ${isMobileMenuOpen ? 'block' : 'hidden'}
        fixed lg:relative z-50 lg:z-auto
        top-0 left-0
        lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
      `}>
        <div className="w-full h-[90%] flex flex-col justify-between">
          <div>
            {/* Desktop Logo */}
            <Link to="/" className="hidden lg:block w-full mb-7">
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
                        onClick={closeMobileMenu}
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
                            {cart?.items?.length}
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
                      onClick={closeMobileMenu}
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
                    onClick={closeMobileMenu}
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
            onClick={() => {
              toggleSwitch();
              closeMobileMenu();
            }}
          >
            <SignOutIcon />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grow lg:ml-0 pt-16 lg:pt-0">
        {children}
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
