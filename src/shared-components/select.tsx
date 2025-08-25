import React from "react";
import { CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";
import { CN } from "../utils/class-merge";

/* --------------------------------------------------------------- */

export type SelectType = {
  options: { [name: string]: any }[];
  value?: string | number;
  onChange?: (arg: any) => void;
  placeholder?: string;
  fieldClassName?: string;
  containerClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  iconClassName?: string;
  selectedOptionClassName?: string;
  position?: "bottom" | "top" | "left" | "right";
  disabled?: boolean;
  error?: boolean;
};

/**
 * Select input component
 *
 * @returns ReactElement
 */
export default function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  fieldClassName,
  containerClassName,
  optionsClassName,
  optionClassName,
  iconClassName,
  selectedOptionClassName,
  position = "bottom",
  disabled = false,
  error = false,
}: SelectType) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownStyle, setDropdownStyle] = React.useState({});

  const selectedOption = options.find((opt) => {
    if (value) {
      return opt.value.toString().toLowerCase() === String(value).toLowerCase();
    }

    return undefined;
  });

  const handleSelect = (option: { [name: string]: any }) => {
    if (onChange) {
      onChange(option.value.toString());
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, position]);

  // Calculate
  const calculatePosition = () => {
    const style: any = {};

    switch (position) {
      case "top":
        style.bottom = "100%";
        style.marginBottom = "0.25rem";
        style.left = "0";
        break;
      case "bottom":
        style.top = "100%";
        style.marginTop = "0.25rem";
        style.left = "0";
        break;
      case "left":
        style.right = "100%";
        style.marginRight = "0.25rem";
        style.top = "0";
        break;
      case "right":
        style.left = "100%";
        style.marginLeft = "0.25rem";
        style.top = "0";
        break;
      default:
        style.top = "100%";
        style.marginTop = "0.25rem";
        style.left = "0";
    }

    setDropdownStyle(style);
  };

  const baseContainerStyles = "relative w-full";

  const baseSelectStyles = `
    w-full px-1 bg-white border rounded-lg 
    flex items-center gap-x-3 justify-between
    cursor-pointer focus:outline-none
    transition-colors duration-200
  `;

  const baseOptionsStyles = `
    absolute z-50 w-full mt-1 
    bg-white border rounded-lg shadow-lg
    max-h-60 overflow-y-auto
  `;

  const baseOptionStyles = `
    px-4 py-2 cursor-pointer
    hover:bg-gray-100
    transition-colors duration-200
  `;

  // Dynamic styles based on state
  const selectStateStyles = {
    default: "border-gray-300 hover:border-gray-400",
    disabled: "bg-gray-100 cursor-not-allowed opacity-75",
    error: "border-red-500 hover:border-red-600",
  };

  const getSelectStyles = () => {
    if (disabled) return selectStateStyles.disabled;
    if (error) return selectStateStyles.error;
    return selectStateStyles.default;
  };

  // Calculate dropdown width based on position
  const getDropdownWidth = () => {
    if (position === "left" || position === "right") {
      return "w-max min-w-full";
    }

    return "w-full";
  };

  return (
    <div className={CN(baseContainerStyles, containerClassName)}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`${baseSelectStyles}
          ${getSelectStyles()}
          ${fieldClassName}`}
      >
        <span
          className={
            !selectedOption ? "text-gray-400" : `${selectedOptionClassName}`
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {isOpen ? (
          <CaretUpIcon className={`w-4 h-4 text-gray-600 ${iconClassName}`} />
        ) : (
          <CaretDownIcon className={`w-4 h-4 text-gray-600 ${iconClassName}`} />
        )}
      </div>

      {isOpen && !disabled && (
        <div
          className={`${baseOptionsStyles} ${optionsClassName} ${getDropdownWidth()}`}
          style={dropdownStyle}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`
                ${baseOptionStyles}
                ${optionClassName}
                ${option.value === value ? "bg-gray-100" : ""}
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
