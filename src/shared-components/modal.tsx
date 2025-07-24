import React, { useEffect } from "react";
import { CN } from "../utils/class-merge";

/* ------------------------------------------------------ */

type ModalShape = {
  isOpen: boolean;
  onClose: () => void;
  containerClassName?: string;
  backgroundClassName?: string;
  children: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  containerClassName,
  backgroundClassName = "",
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
      className={`${CN(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm",
        backgroundClassName
      )}`}
      onClick={onClose}
    >
      <div
        className={CN(
          "bg-white rounded-xl p-6 shadow-xl z-50",
          containerClassName
        )}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
}
