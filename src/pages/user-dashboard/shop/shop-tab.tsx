import React from "react";
import { useState, useCallback, memo, Children } from "react";
import { CN } from "../../../utils/class-merge";
import Select from "../../../shared-components/select";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

/* ---------------------------------------------------------------------- */

export interface TabShape {
  items: string[];
  defaultTab?: 0;
  tabContainerClassName?: string;
  tabListClassName?: string;
  tabItemClassName?: string;
  activeTabClassName?: string;
  inactiveClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  onChange?: (arg1: any) => void;
}

export interface TabItemShape {
  label: string;
  active: boolean;
  onClick: () => any;
  activeClassName?: string;
  inactiveClassName?: string;
  tabItemClassName?: string;
}

const TabItem = memo(
  ({
    label,
    active,
    onClick,
    activeClassName = "bg-white border-blue-500",
    inactiveClassName = "text-gray-500 hover:text-gray-700 bg-transparent",
    tabItemClassName,
  }: TabItemShape) => (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`px-4 
      py-2  
      font-medium 
      transition-colors 
      duration-200 ${
        active
          ? `${activeClassName} border-b-2`
          : `${inactiveClassName} border-transparent`
      } ${tabItemClassName}`}
    >
      {label}
    </button>
  )
);

/**
 * Switch data and components between tabs
 *
 * @returns ReactElement
 */
const ShopTab = ({
  items = [],
  defaultTab = 0,
  tabContainerClassName,
  tabListClassName = "border-b",
  tabItemClassName,
  activeTabClassName,
  inactiveClassName,
  onChange,
  children,
}: TabShape) => {
  const [activeTab, setActiveTab] = useState<number>(defaultTab);

  const handleTabClick = useCallback(
    (index: number, tabItem?: string) => {
      setActiveTab(index);
      onChange?.(tabItem);
    },
    [onChange]
  );

  const options = [
    { label: "label1", value: "value 1" },
    { label: "label2", value: "value 2" },
    [{ label: "label3", value: "value 3" }],
  ];

  return (
    <div className={CN("rounded-md relative size-full overflow-y-scroll", tabContainerClassName)}>
      <div
        className={CN("w-full flex items-center justify-between sticky top-0 left-0 z-10", tabListClassName)}
      >
        <div className="flex items-center space-x-1">
          {" "}
          {items.map((item, index) => (
            <TabItem
              key={index}
              label={item}
              active={activeTab === index}
              onClick={() => handleTabClick(index, item)}
              tabItemClassName={tabItemClassName}
              activeClassName={activeTabClassName}
              inactiveClassName={inactiveClassName}
            />
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="w-[18.0625rem] flex gap-2 py-[6px] px-3 border border-neutral-100 rounded-md">
            <MagnifyingGlassIcon size="20px" className="text-neutral-500" />
            <input
              type="text"
              name=""
              id=""
              className="outline-none grow"
              placeholder="Search here"
            />
          </div>

          <Select
            options={options}
            placeholder="Sort by: Measurement"
            containerClassName="w-[12.5rem]"
          />
        </div>
      </div>

      {children && (
        <div className="p-4 size-full">
          {Children.toArray(children)[activeTab]}
        </div>
      )}
    </div>
  );
};

export default ShopTab;
