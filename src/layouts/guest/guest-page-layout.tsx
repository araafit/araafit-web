import { CaretRightIcon } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/cart.hooks";
import Button from "../../shared-components/button";
import Loader from "./loader";
import useAuth from "../../hooks/use-auth";
import { useLocation } from "react-router-dom";

/* ----------------------------------------------------------- */

function GuestPageLayout({ children }: { children: React.ReactElement }) {
  const location = useLocation();
  const { isGuest, isAuthenticated, isFullUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { isSuccess, data: cart } = useCart();

  const [loading, setLoading] = useState(true);

  const cartLength = cart ? cart.items.length : 0;

  useEffect(() => {
    const waitASecond = async () =>
      await setTimeout(() => setLoading(false), 1000);

    waitASecond();
  }, [loading]);

  return (
    <main className="h-screen bg-[#F5F5F5] flex flex-col gap-6 overflow-y-clip">
      <div className="bg-white py-2 px-32 flex items-center justify-center gap-2">
        <div className="w-[75rem] h-[4.5625rem] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src="logo/logo.png" alt="" className="w-[5.625rem]" />
            <Link
              to="/shop"
              className={`p-8 ${location.pathname === "/shop" ? "text-[#9A6C50]" : ""}`}
            >
              Shop
            </Link>
            <Link
              to="/cart"
              className={`p-8 flex items-center gap-2 ${location.pathname === "/cart" ? "text-[#9A6C50]" : ""}`}
            >
              <span>Cart</span>
              {isSuccess && (
              <span className="bg-primary-50 p-[2px] px-[10px] rounded-full h-[1.3rem] text-[12px]">
                {cartLength}
              </span>
              )}
            </Link>
          </div>

          {isAuthenticated && isAdmin && !isGuest ? (
            <Button
              variant="solid"
              onClick={() => navigate("/admin-dashboard/overview")}
            >
              <div className="flex items-center gap-1">
                <span>Go To Dashboard</span>
                <CaretRightIcon />
              </div>
            </Button>
          ) : isAuthenticated && isFullUser && !isGuest ? (
            <Button variant="solid" onClick={() => navigate("/dashboard/")}>
              <div className="flex items-center gap-1">
                <span>Go To Dashboard</span>
                <CaretRightIcon />
              </div>
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                text="Login"
                variant="outline"
                onClick={() => navigate("/auth/login")}
              />

              <Button
                variant="solid"
                onClick={() => navigate("/auth/register")}
              >
                <div className="flex items-center gap-1">
                  <span>Create a free account</span>
                  <CaretRightIcon />
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="size-full flex items-start justify-center overflow-scroll">
        {loading ? <Loader /> : children}
      </div>
    </main>
  );
}

export default GuestPageLayout;
