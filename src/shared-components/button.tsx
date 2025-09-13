import React from "react";
import { CN } from "../utils/class-merge";
import type { ReactNode } from "react";

/* ---------------------------------------------------------- */

export type CustomProps = {
  text?: string;
  variant?: "solid" | "outline" | "clear";
  className?: string;
  children?: React.ReactElement;
  icon?: ReactNode;
  // props?: any;
};

type ButtonType = CustomProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 *
 * @param text string
 * @param variant "solid" | "outline"
 * @param className string
 * @param children ReactNode
 *
 * @returns ReactElement
 */
export default function Button({
  text,
  icon,
  variant,
  children,
  className,
  type = "button",
  onClick,
  ...props
}: ButtonType) {
  const solid = "bg-primary-500 text-white rounded-[0.375rem]";
  const outline =
    "border border-primary-200 text-primary-500 rounded-[0.375rem]";
  const clear = "text-primary-500 rounded-[0.375rem]";

  const buttonVariant =
    variant === "solid" ? solid : variant === "outline" ? outline : clear;
  const defaultClassName = `
    h-12 py-3 px-5
    ${icon ? "inline-flex items-center gap-2" : ""}
    ${buttonVariant}
  `;

  return (
    <button
      type={type}
      className={`${CN(defaultClassName, className)}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="flex-shrink-0 ">{icon}</span>}
      {text ? <span>{text}</span> : children}
    </button>
  );
}
