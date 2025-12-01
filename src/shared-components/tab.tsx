import React from "react";
import { useState, useCallback, memo, Children } from "react";
import { CN } from "../utils/class-merge";

/* ---------------------------------------------------------------------- */

export interface TabShape {
  items: string[];
  defaultTab?: number;
  tabContainerClassName?: string;
  tabListClassName?: string;
  tabItemClassName?: string;
  activeTabClassName?: string;
  inactiveClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  onChange?: (tabLabel: string) => void;
}

export interface TabItemShape {
  label: string;
  active: boolean;
  onClick: () => void;
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
      className={`px-3 lg:px-4 
      py-2 lg:py-2  
      font-medium 
      text-xs lg:text-base
      whitespace-nowrap
      flex-shrink-0
      min-w-fit
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
const Tab = ({
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
    (index: number, tabItem: string) => {
      setActiveTab(index);
      onChange?.(tabItem);
    },
    [onChange]
  );

  return (
    <div className={CN("rounded-lg flex flex-col h-full", tabContainerClassName)}>
      <div
        className={CN(
          "flex-inline items-center justify-start space-x-0 lg:space-x-1 flex-shrink-0 flex-wrap lg:flex-nowrap gap-1 lg:gap-0 overflow-x-auto lg:overflow-x-visible",
          tabListClassName
        )}
      >
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

      {children && (
        <div className="p-2 lg:p-4 w-full flex-1 overflow-y-auto">
          {Children.toArray(children)[activeTab]}
        </div>
      )}
    </div>
  );
};

export default Tab;
