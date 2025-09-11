import React from "react";

type EmptyStateProps = {
  image: string;
  alt?: string;
  message: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  image,
  alt = "",
  message,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2">
      <img src={image} alt={alt} className="w-40 h-40" />
      <span className="text-[#5D5D5D] text-center max-w-[556px] mx-auto font-light">
        {message}
      </span>
    </div>
  );
};

export default EmptyState;
