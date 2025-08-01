import React, { useState, useEffect, createElement } from "react";
import {
  HouseSimpleIcon,
  DressIcon,
  ShoppingBagIcon,
  ShoppingCartSimpleIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import DashboardLoader from "./loader";

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
export default function DashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const [loading, setLoading] = useState(true);

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

            {navMenu.map((item, idx) => {
              if (item.name.toLowerCase() !== "profile") {
                return (
                  <Link
                    to={item.link}
                    key={idx}
                    className="w-full flex flex-col gap-4 p-[0.5rem] text-neutral-900 hover:bg-primary-900 hover:text-white"
                  >
                    <div
                      key={idx}
                      className="w-full flex items-center text-base"
                    >
                      {createElement(item.icon ? item.icon : "a", {
                        className: "mr-3",
                      })}
                      <span className="capitalize text-sm">{item.name}</span>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  to={item.link}
                  key={idx}
                  className="w-full flex flex-col gap-4 p-[0.5rem] text-neutral-900 hover:bg-primary-900 hover:text-white"
                >
                  <div className="w-full flex items-center text-base">
                    <span className="uppercase mr-3 size-[20px] text-[10px] border border-primary-50 p-1 rounded-full flex items-center justify-center">
                      en
                    </span>

                    <span className="capitalize text-sm">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-[0.875rem] flex items-center gap-[0.75rem] text-neutral-900 border-t-2 border-neutral-100 p-[0.5rem] hover:bg-primary-900 hover:text-white cursor-pointer">
            <SignOutIcon />
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="grow">{loading ? <DashboardLoader /> : children}</div>
    </section>
  );
}
