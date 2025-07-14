import React from "react";
import { CN } from "../utils/class-merge";

/* ---------------------------- */

export type ButtonShape = {
  text?: string;
  variant?: "solid" | "outline" | "clear";
  className?: string;
  type?: "button" | "submit" | "reset";
  children?: React.ReactElement;
  onClick?: (e: any) => void;
  props?: any;
};

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
  variant,
  children,
  className,
  type = "button",
  onClick,
  ...props
}: ButtonShape) {
  const solide = "bg-primary-500 text-white rounded-[0.375rem]";
  const outline = "border border-primary-200 text-primary-500 rounded-[0.375rem]";
  const clear = "text-primary-500 rounded-[0.375rem]";

  const buttonVariant =
    variant === "solid" ? solide : variant === "outline" ? outline : clear;
  const defaultClassName = `h-12 py-3 px-5 ${buttonVariant}`;

  return (
    <button
      type={type}
      className={`${CN(defaultClassName, className)}`}
      onClick={onClick}
      {...props}
    >
      {text ? <span>{text}</span> : children}
    </button>
  );
}
