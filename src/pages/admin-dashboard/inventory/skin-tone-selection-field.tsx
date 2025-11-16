import React from "react";
import { Controller, type Control } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { TableButton } from "../../ui/button";

/* ---------------------------------------------------------------------- */

/**
 * kgn kgnfg
 **/
export const SkinToneSelectField: React.FC<{
  name: "skinTone";
  label: string;
  options: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any, any>;
}> = ({ name, label, options, control }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={[]}
    render={({ field }) => (
      <DropdownMenu>
        <label
          htmlFor="name"
          className="block text-[#4F4F4F] font-light  text-sm"
        >
          {label}
        </label>

        {/* Tags outside to prevent event bubbling */}
        <div className="flex flex-wrap gap-2 mb-2">
          {field.value.length > 0 &&
            field.value.map((tone) => (
              <span
                key={tone}
                className="flex items-center gap-1 border border-[#E7E7E7] p-2 rounded-[4px] text-sm capitalize"
              >
                {tone}
                <XIcon
                  size={16}
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    field.onChange(field.value.filter((t) => t !== tone));
                  }}
                />
              </span>
            ))}
        </div>

        <DropdownMenuTrigger asChild>
          <TableButton
            variant="outline"
            size="sm"
            className="w-full min-h-14 border border-[#D0D5DD] text-[#676767] text-sm bg-white flex items-center justify-between px-3"
          >
            <span className="text-[#9A9A9A] font-light">
              {field.value.length > 0
                ? `${field.value.length} selected`
                : "Skin Tone"}
            </span>

            <CaretDownIcon className="text-[#676767] ml-auto" size={20} />
          </TableButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52 flex flex-col items-start gap-2 p-3">
          {options.map((tone) => (
            <DropdownMenuItem
              key={tone}
              onClick={() => {
                // Toggle tone in array
                const currentValues = field.value || [];
                const newValues = currentValues.includes(tone)
                  ? currentValues.filter((t) => t !== tone)
                  : [...currentValues, tone];
                field.onChange(newValues);
              }}
              className={`cursor-pointer w-full px-2 py-1 rounded-md capitalize ${
                field.value?.includes(tone) ? "bg-[#9A6C50] text-white" : ""
              }`}
            >
              {tone}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  />
);
