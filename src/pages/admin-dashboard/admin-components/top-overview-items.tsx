import React from "react";

interface OverviewCard {
  icon?: React.ElementType;
  title: string;
  figures: string | number;
}

interface OverviewProps {
  title?: string;
  subtitle?: string;
  cards?: OverviewCard[];
}

const Overview: React.FC<OverviewProps> = ({
  title = "Overview",
  subtitle,
  cards,
}) => {
  return (
    <div className="w-full bg-white lg:h-60 mt-5 rounded-sm p-4 flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-[28px] capitalize">{title}</h2>

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
