import { ArrowLeftIcon } from "@phosphor-icons/react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface OverviewCard {
  icon?: React.ElementType;
  title: string;
  figures: string | number;
}

interface OverviewProps {
  hasBackButton?: boolean;
  title?: string;
  subtitle?: string;
  cards?: OverviewCard[];
}

const Overview: React.FC<OverviewProps> = ({
  hasBackButton = false,
  title = "Overview",
  subtitle,
  cards,
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white lg:h-60 mt-5 rounded-sm p-4 flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          {hasBackButton && (<button
            onClick={() => navigate("/admin-dashboard/customers")}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon size={20} className="text-gray-600" />
          </button>)}
          <h2 className="font-semibold text-[28px] text-[#1C1C1C]">{title}</h2>
        </div>

        {subtitle && (
          <span className="capitalize text-neutral-400 cursor-pointer font-inter">
            {subtitle}
          </span>
        )}

        <div className="w-full grid lg:grid-cols-3 rounded-md gap-2 mt-6">
          {cards &&
            cards.map((item, idx) => (
              <div
                key={idx}
                className="p-4 w-full lg:w-[22.4375rem] h-[7.0625rem] border border-[#E8E8E8] rounded-md flex items-center gap-4"
              >
                <div className="h-10 w-10 bg-[#E8E8E8] flex items-center justify-center">
                  {item.icon && <item.icon className="size-[1.25rem]" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#979797]">{item.title}</span>
                  <span className="font-semibold text-[1.3rem] text-neutral-900">
                    {item.figures}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
