import React from "react";

const InfoSection = ({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: React.ReactNode }[];
}) => {
  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="text-right break-words">{value}</span>
    </div>
  );

  return (
    <div>
      <h2 className="text-base font-inter font-medium mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <InfoRow key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
