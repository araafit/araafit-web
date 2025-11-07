import { useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import Button from "./button";
import Modal from "./modal";
import Spinner from "./spinner";

/* --------------------------------------------------------------------------- */

interface SizeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (size: string) => void;
  productName: string;
  productCategory: "dress" | "fabric";
  isLoading?: boolean;
}

/**
 * Size selection modal for adding products to cart
 *
 * @returns ReactElement
 */
export default function SizeSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  productCategory,
  isLoading = false,
}: SizeSelectionModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const dressSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const fabricYards = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const handleConfirm = () => {
    if (selectedSize) {
      onConfirm(selectedSize);
      setSelectedSize("");
    }
  };

  const handleClose = () => {
    setSelectedSize("");
    onClose();
  };

  const options = productCategory === "dress" ? dressSizes : fabricYards;
  const label = productCategory === "dress" ? "Select Size" : "Select Yards";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      containerClassName="w-full max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add to Cart</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="close modal"
          >
            <XIcon className="size-6" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">{productName}</p>
          <p className="text-xs text-gray-500">
            {label} to add this {productCategory} to your cart
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <div className="grid grid-cols-3 gap-2">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedSize(option)}
                className={`p-2 text-sm border rounded-md transition-colors ${
                  selectedSize === option
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {option}
                {productCategory === "fabric" &&
                  (option === "1" ? " yard" : " yards")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            text="Cancel"
            variant="outline"
            className="flex-1"
            onClick={handleClose}
            disabled={isLoading}
          />

          <Button
            variant="solid"
            className="flex-1"
            onClick={handleConfirm}
            disabled={!selectedSize || isLoading}
          >
            <div className="flex items-center justify-center gap-1">
              <span className={`${isLoading ? "hidden" : "block"}`}>
                Add to cart
              </span>

              <Spinner isLoading={isLoading} size="sm" />
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
