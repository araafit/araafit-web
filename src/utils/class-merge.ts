import { twMerge } from "tailwind-merge";
import clsx from "clsx";

/**
 *
 * @param {string} inputs default class name and fallback class name to be merged
 *
 * @returns {string} - The merged class names
 */
export function CN(...inputs: (string | undefined)[]) {
  // Merge class names
  return twMerge(clsx(inputs));
}