import React, { useEffect } from "react";
import { XIcon } from "@phosphor-icons/react";

/* ------------------------------------------------------ */

type ModalShape = {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactElement;
  className?: string;
  modalBackgroundClassName?: string;
  modalContainerClassName?: string;
  children: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  modalBackgroundClassName = "",
  modalContainerClassName = "",
}: ModalShape) {
  useEffect(() => {
    if (isOpen) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "scroll";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000000c2] bg-opacity-50 ${modalBackgroundClassName}`}
      onClick={onClose}
    >
      <div
        className={`w-full sm:w-[500px] bg-white rounded-lg shadow-xl p-6 relative mx-4 ${modalContainerClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="size-[24px] absolute top-4 right-4 text-[#3F2C2D] bg-[#F1F0F0] transition-colors rounded-full flex items-center justify-center cursor-pointer"
          aria-label="Close modal"
          title="Close modal"
        >
          <XIcon className="size-fit" />
        </button>

        {/* Optional Title */}
        {typeof title === "string" ? (
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
        ) : (
          title
        )}

        {children}
      </div>
    </div>
  );
}
