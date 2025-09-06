import React, { useEffect, memo } from "react";
import { CN } from "../utils/class-merge";

/* ------------------------------------------------------ */

type ModalShape = {
  isOpen: boolean;
  onClose?: () => void;
  containerClassName?: string;
  backgroundClassName?: string;
  children: React.ReactNode;
};

/**
 * Modal component
 *
 * @returns ReactElement
 */
const Modal: React.FC<ModalShape> = ({
  isOpen,
  onClose,
  children,
  containerClassName,
  backgroundClassName = "",
}) => {
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
        "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm top-0 left-0",
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
};

export default memo(Modal);
