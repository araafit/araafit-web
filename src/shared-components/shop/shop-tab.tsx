/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from "react";
import { useState, useCallback, memo, Children } from "react";
import { CN } from "../../utils/class-merge";
import Select from "../select";
//import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useShopStore } from "../../shared-hooks/state-store";
import SearchInput from "../../pages/user-dashboard/shop/components/search-input";
import { useSearchParams } from "react-router-dom";

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
  const allItems = useShopStore((state) => state.all);
  const dressItems = useShopStore((state) => state.dresses);
  const fabricItems = useShopStore((state) => state.fabrics);

  const originalAllItems = useRef(allItems);
  const originalDressItems = useRef(dressItems);
  const originalFabricItems = useRef(fabricItems);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParam] = useSearchParams();
  const exploreParam = searchParam.get("explore");

  useEffect(() => {
    if (dressItems.length > 0 && originalDressItems.current.length === 0) {
      originalAllItems.current = [...dressItems];
    }
  }, [dressItems]);

  useEffect(() => {
    if (fabricItems.length > 0 && originalFabricItems.current.length === 0) {
      originalAllItems.current = [...fabricItems];
    }
  }, [fabricItems]);

  // Set active tab based on query param
  useEffect(() => {
    if (exploreParam === "dress") {
      setActiveTab(1);
    } else if (exploreParam === "fabric") {
      setActiveTab(2);
    } else {
      setActiveTab(0);
    }
  }, [exploreParam]);

  const handleTabClick = useCallback(
    (index: number, tabItem?: string) => {
      setActiveTab(index);
      onChange?.(tabItem);
    },
    [onChange]
  );

  const options = [
    { label: "Measurement", value: "measurement" },
    { label: "Skin tone", value: "skin tone" },
  ];

  return (
    <div
      className={CN(
        "rounded-md relative size-full overflow-y-scroll",
        tabContainerClassName
      )}
    >
      <div
        className={CN(
          "w-full flex flex-col lg:flex-row items-start lg:items-center justify-between sticky top-0 left-0 z-10 gap-4 lg:gap-0",
          tabListClassName
        )}
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

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full lg:w-auto">
          <SearchInput />
          {/*<div className="w-[18.0625rem] flex gap-2 py-[6px] px-3 border border-neutral-100 rounded-md">
            <MagnifyingGlassIcon size="20px" className="text-neutral-500" />
            <input
              type="text"
              name=""
              id=""
              className="outline-none grow"
              placeholder="Search here"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>*/}

          <div className="flex items-center justify-between w-full lg:w-auto">
            <span className="text-neutral-500 whitespace-nowrap text-sm lg:text-base">
              Sort by:
            </span>
            <Select
              options={options}
              containerClassName="w-[6rem] lg:w-[8rem] ml-1"
              selectClassName="border-none text-sm lg:text-base"
              onChange={(item) => console.log(item)}
              value="measurement"
            />
          </div>
        </div>
      </div>

      {children && (
        <div className="p-2 lg:p-4 size-full">
          {Children.toArray(children)[activeTab]}
        </div>
      )}
    </div>
  );
};

export default ShopTab;
