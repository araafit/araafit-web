import { Link, useLocation } from "react-router-dom";
import { ListIcon, ArrowElbowDownRightIcon } from "@phosphor-icons/react";
import Button from "../../shared-components/button";

/* ------------------------------------------------------------- */

/**
 * Landing page navigation menu
 *
 * @returns ReactElement
 */
export default function Nav() {
  const location = useLocation();

  const pathname = location.pathname.toLowerCase();

  const navMenu = [
    { name: "Home", link: "/" },
    { name: "About us", link: "/about" },
    { name: "Contact us", link: "/contact" },
  ];

  return (
    <nav className="w-full h-auto flex items-center justify-between gap-2 py-[0.5rem] px-4 md:px-[7.5rem]">
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
          onClick={() => console.log("go to login")}
        />
        <ListIcon className="text-primary-500 block md:hidden" size={24} />
      </div>
    </nav>
  );
}
