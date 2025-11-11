import React, { useState, useRef, useEffect, Children } from "react";
import { CN } from "../utils/class-merge";

/* -------------------------------------------------------------------- */

interface DropdownItem {
  label: string;
  value: string;
  onClick?: () => void;
  danger?: boolean;
  separator?: boolean;
  link?: string;
}

interface Dropdown {
  trigger: React.ReactNode;
  items?: DropdownItem[];
  onSelect?: (value: string) => void;
  align?: "left" | "right";
  shouldStack?: boolean;
  isDropdownOpen?: (isOpen: boolean) => void;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  children?: React.ReactNode;
}

export const Dropdown: React.FC<Dropdown> = ({
  trigger,
  items,
  onSelect,
  align,
  shouldStack,
  isDropdownOpen,
  className,
  itemClassName,
  triggerClassName,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick) {
      item.onClick();
    }

    if (onSelect) {
      onSelect(item.value);
    }

    // setIsOpen(false);
    setFocusedIndex(-1);
  };

  if (isDropdownOpen) {
    isDropdownOpen(isOpen);
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={CN("w-full", triggerClassName)}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={CN(
            `mt-2 min-w-[200px] rounded-md bg-white shadow-lg ring-opacity-5 ${
              shouldStack ? "absolute z-50" : ""
            } ${align === "right" ? "right-0" : "left-0"}`,
            className
          )}
        >
          <div>
            {(() => {
              if (children && !items) {
                return Children.map(children, (child) => {
                  if (!React.isValidElement(child)) return child;

                  return React.cloneElement(child);
                });
              }

              return (
                items &&
                items.map((item, index) => (
                  <React.Fragment key={`${item.value} + ${index}`}>
                    {item.separator && (
                      <div className="my-1 h-px bg-gray-200" />
                    )}

                    <button
                      className={CN(
                        `w-full text-left px-4 py-2 text-sm transition-colors ${
                          focusedIndex === index && "bg-gray-100"
                        }`,
                        itemClassName
                      )}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      {item.label}
                    </button>
                  </React.Fragment>
                ))
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
