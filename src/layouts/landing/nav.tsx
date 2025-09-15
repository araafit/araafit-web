import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListIcon, ArrowElbowDownRightIcon } from "@phosphor-icons/react";
import Button from "../../shared-components/button";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------- */

/**
 * Landing page navigation menu
 *
 * @returns ReactElement
 */
export default function Nav() {
  const [showNav, setShowNav] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname.toLowerCase();

  const navMenu = [
    { name: "Home", link: "/" },
    { name: "About us", link: "/about" },
    { name: "Contact us", link: "/contact" },
  ];

  return (
    <nav className="w-full h-auto flex items-center justify-between gap-2 py-[0.5rem] px-4 lg:px-[7.5rem] relative">
      <div className="flex items-center gap-6">
        <img
          src="/logo/logo.png"
          alt="Araafit logo"
          title="Araafit logo"
          className="w-24 h-auto"
        />

        <div className="hidden md:flex items-center gap-4">
          {navMenu.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="capitalize group flex cursor-pointer"
            >
              {pathname !== item.link.toLowerCase() && (
                <ArrowElbowDownRightIcon className="text-white mr-2 group-hover:text-primary-500 transition-all" />
              )}
              <span
                className={`${
                  pathname === item.link.toLowerCase()
                    ? "text-primary-500"
                    : "text-neutral-950"
                } group-hover:pl-2 group-hover:text-primary-500 transition-all capitalize`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <Button
          type="button"
          text="Login"
          variant="outline"
          className="hidden md:block"
          onClick={() => navigate("/auth/login")}
        />

        {/* Mobile screen nav menu trigger burger icon */}
        <div onClick={() => setShowNav(!showNav)}>
          <ListIcon className="text-primary-500 block md:hidden" size={24} />
        </div>
      </div>

      {/* Mobile screen nav menu */}
      <div
        className={`w-full ${
          showNav ? "h-fit visible" : "h-[-3px] invisible"
        } absolute top-[5rem] left-0 flex flex-col gap-4 bg-white py-[0.75rem] px-4  shadow-md transition-all md:!hidden`}
      >
        <Button
          type="button"
          text="Login"
          variant="outline"
          className={`w-full ${showNav ? "visible" : "invisible"}`}
          onClick={() => navigate("/auth/login")}
        />

        <div
          className={`flex flex-col gap-4 font-light ${
            showNav ? "visible" : "invisible"
          }`}
        >
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact us</Link>
        </div>
      </div>
    </nav>
  );
}
