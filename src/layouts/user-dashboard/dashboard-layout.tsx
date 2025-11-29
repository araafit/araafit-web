import React, { useEffect, createElement, useState } from "react";
import {
  HouseSimpleIcon,
  DressIcon,
  ShoppingBagIcon,
  ShoppingCartSimpleIcon,
  SignOutIcon,
  ListIcon,
  XIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import Modal from "../../shared-components/modal";
import { useSwitch } from "../../shared-hooks/switch";
import Button from "../../shared-components/button";
import { useCart } from "../../hooks/cart.hooks";
import { useLogout } from "../../hooks/auth.hooks";
import Spinner from "../../shared-components/spinner";
import { Dropdown } from "../../shared-components/dropdown";

/* ---------------------------------------------------------------------------------- */

const navMenu = [
  { label: "home", value: "home", link: "/dashboard", icon: HouseSimpleIcon },
  {
    label: "shop",
    value: "shop",
    link: "/dashboard/shop",
    icon: DressIcon,
    isDropDown: true,
    dropdown: [
      {
        label: "ready made",
        value: "ready-made",
        link: "/dashboard/shop",
        icon: null,
      },
      {
        label: "fabrics",
        value: "fabrics",
        link: "/dashboard/shop/fabrics",
        icon: null,
      },
    ],
  },
  {
    label: "order",
    value: "order",
    link: "/dashboard/orders",
    icon: ShoppingBagIcon,
    isDropdown: false,
  },
  {
    label: "cart",
    value: "cart",
    link: "/dashboard/cart",
    icon: ShoppingCartSimpleIcon,
    isDropdown: false,
  },
  { label: "profile", value: "profile", link: "/dashboard/profile" },
];

/**
 * Araafit user dashboard layout.
 *
 * @returns ReactElement
 */
export default function UserDashboardLayout({
  children,
  topBar,
}: {
  children: React.ReactElement;
  topBar?: React.ReactNode;
}) {
  const { toggleSwitch, switchValue } = useSwitch(false);
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle logout success
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      toggleSwitch(); // Close modal
      navigate("/auth/login"); // Redirect to login
    }
  }, [logoutMutation.isSuccess, navigate, toggleSwitch]);

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
    <section className="h-screen bg-[#F5F5F5] flex items-start overflow-x-hidden">
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
      <div
        className={`
        w-[12.375rem] h-screen border-r-2 border-neutral-100 bg-white
        lg:block
        ${isMobileMenuOpen ? "block" : "hidden"}
        fixed lg:relative z-50 lg:z-auto
        top-0 left-0
        lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out
        shrink-0
      `}
      >
        <div className="w-full h-full flex flex-col justify-between">
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
                if (item.label.toLowerCase() == "profile") {
                  return (
                    <NavLink
                      to={item.link}
                      key={`${item.label}-${idx}`}
                      end={item.label.toLowerCase() === "home"}
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
                        <span className="uppercase mr-3 size-[20px] text-[10px] border border-primary-200 p-1 rounded-full flex items-center justify-center">
                          en
                        </span>

                        <span className="capitalize text-sm">{item.value}</span>
                      </div>
                    </NavLink>
                  );
                }

                if (item.label.toLowerCase() === "cart") {
                  return (
                    <NavLink
                      to={item.link}
                      key={idx}
                      end={item.label.toLowerCase() === "home"}
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
                            className: "mr-3 size-[20px]",
                          })}
                          <span className="capitalize text-sm">
                            {item.label}
                          </span>
                        </div>

                        <span className="w-[26px] h-[19px] py-[2px] px-[10px] bg-primary-50 text-[0.875rem] !text-[#1C1C1C] rounded-full flex items-center justify-center">
                          {cart?.items?.length}
                        </span>
                      </div>
                    </NavLink>
                  );
                }

                if (item.label.toLowerCase() === "shop") {
                  const isShopRoute =
                    location.pathname.startsWith("/dashboard/shop");
                  return (
                    <Dropdown
                      key={`${item.label}-${idx}`}
                      open={dropdownOpen || isShopRoute}
                      onOpenChange={(isOpen) => setDropdownOpen(isOpen)}
                      trigger={
                        <button
                          className={`flex items-center justify-between btn w-fullgi`}
                        >
                          <div className="w-full flex items-center text-base">
                            {createElement(item.icon ? item.icon : "a", {
                              className: "mr-3 size-[20px]",
                            })}
                            <span className="capitalize text-sm">
                              {item.label}
                            </span>
                          </div>

                          <CaretDownIcon
                            className={`${
                              dropdownOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </button>
                      }
                      // items={item.dropdown as DropdownMenuType}
                      isDropdownOpen={(isOpen) => {
                        setDropdownOpen(isOpen);
                      }}
                      className="shadow-none border-none rounded-none outline-none focus"
                      itemClassName="capitalize pl-6 hover:text-primary-500 !hover:bg-none"
                      triggerClassName={`w-full flex flex-col gap-4 p-[0.5rem] transition-colors ${
                        isShopRoute || dropdownOpen
                          ? "bg-primary-900 text-white"
                          : "text-neutral-900 hover:bg-primary-900 hover:text-white"
                      }`}
                    >
                      {item.isDropDown &&
                        item.dropdown.map((item, itemIdx) => (
                          <NavLink
                            to={item.link}
                           key={`${item.label}-${itemIdx}`}
                            className={({ isActive }) =>
                              `w-full block text-left px-4 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-primary-500 capitalize pl-8 ${
                                isActive
                                  ? "text-primary-500"
                                  : "text-neutral-900"
                              }`
                            }
                            onClick={() => {
                              // Keep dropdown open on navigation
                              setDropdownOpen(true);
                            }}
                          >
                            {item.label}
                          </NavLink>
                        ))}
                    </Dropdown>
                  );
                }

                return (
                  <NavLink
                    to={item.link}
                    key={`${item.label}-${idx}`}
                    end={item.label.toLowerCase() === "home"}
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
                        className: "mr-3 size-[20px]",
                      })}
                      <span className="capitalize text-sm">{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div
            className="text-[0.875rem] flex items-center gap-[0.75rem] text-neutral-900 border-t-2 border-neutral-100 p-[0.5rem] pb-4 hover:bg-primary-900 hover:text-white cursor-pointer"
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
      <div className="flex-1 min-w-0 lg:ml-0 pt-16 lg:pt-0 h-screen lg:h-full flex flex-col overflow-x-hidden">
        {topBar && <div className="sticky top-0 z-40">{topBar}</div>}
        <div className="grow overflow-y-auto">{children}</div>
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
            variant="clear"
            disabled={logoutMutation.isPending}
            className="w-full bg-red-600 text-white"
            onClick={handleLogout}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Logout</span>
              <Spinner size="sm" speed="fast" arcColor="#ffff" isLoading={logoutMutation.isPending} />
            </div>
          </Button>
        </div>
      </Modal>
    </section>
  );
}
