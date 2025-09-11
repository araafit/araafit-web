import React, { useState, useEffect } from "react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./loader";
import Button from "../../shared-components/button";
import { useCartStore } from "../../shared-hooks/state-store";

/* ----------------------------------------- */

function GuestPageLayout({ children }: { children: React.ReactElement }) {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);

  const [loading, setLoading] = useState(true);

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
            <Link to="/shop" className="p-8">
              Shop
            </Link>
            <Link to="/cart" className="p-8 flex items-center gap-2">
              <span>Cart</span>
              <span className="bg-primary-50 p-[2px] px-[10px] rounded-full h-[1.3rem] text-[12px]">
                {cartItems.length !== 0 && cartItems.length}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button text="Login" variant="outline" />

            <Button variant="solid" onClick={() => navigate("/auth/register")}>
              <div className="flex items-center gap-1">
                <span>Create a free account</span>
                <CaretRightIcon />
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="size-full flex items-start justify-center overflow-scroll">
          {loading ? <Loader /> : children}
      </div>
    </main>
  );
}

export default GuestPageLayout;
