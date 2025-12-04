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

interface SkinTone {
  name: string;
  hex: string;
}

/**
 * Skin tone selection field with color display
 **/
export const SkinToneSelectField: React.FC<{
  name: "skinTone";
  label: string;
  options: SkinTone[];
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
            field.value.map((toneName: string) => {
              const tone = options.find((t) => t.name === toneName);
              return (
                <span
                  key={toneName}
                  className="flex items-center gap-2 border border-[#E7E7E7] p-2 rounded-[4px] text-sm capitalize"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-[#D0D5DD]"
                    style={{ backgroundColor: tone?.hex || "#fff" }}
                  />
                  {toneName}
                  <XIcon
                    size={16}
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      field.onChange(field.value.filter((t: string) => t !== toneName));
                    }}
                  />
                </span>
              );
            })}
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
              key={tone.name}
              onClick={() => {
                // Toggle tone in array
                const currentValues = field.value || [];
                const newValues = currentValues.includes(tone.name)
                  ? currentValues.filter((t: string) => t !== tone.name)
                  : [...currentValues, tone.name];
                field.onChange(newValues);
              }}
              className={`cursor-pointer w-full px-2 py-1 rounded-md capitalize flex items-center gap-2 ${
                field.value?.includes(tone.name) ? "bg-[#9A6C50] text-white" : ""
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-[#D0D5DD]"
                style={{ backgroundColor: tone.hex }}
              />
              {tone.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  />
);
