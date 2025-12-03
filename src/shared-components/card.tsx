import { memo, useState } from "react";
import { CN } from "../utils/class-merge";
import { formatPrice } from "../utils/format-price";
import { Link } from "react-router-dom";
import type { Product } from "../services/products.service";
import { ScissorsIcon, ShoppingCartSimpleIcon } from "@phosphor-icons/react";
import SizeSelectionModal from "./size-selection-modal";
import { useAddToCart } from "../hooks/cart.hooks";

/* --------------------------------------------------------------------- */

interface Card {
  containerClass?: string;
  itemName: string;
  itemImage: string;
  itemCost: string | number;
  link?: string;
  product?: Product; // New prop to pass the full product for API calls
  page?: "ready-made" | "fabric";
  // Keep legacy support for old cart function
  addToCart?: () => void;
}

/**
 * Shopping catalogue card
 *
 * @returns ReactElement
 */
function Card({
  containerClass,
  itemName,
  itemImage,
  itemCost,
  link,
  product,
  page,
  addToCart,
}: Card) {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addToCartMutation = useAddToCart();

  // Handle add to cart click
  const handleAddToCart = () => {
    if (product) {
      // Use new API approach with size selection
      setShowSizeModal(true);
    } else if (addToCart) {
      // Fallback to legacy function
      addToCart();
    }
  };

  const handleSizeConfirm = (size: string) => {
    if (product) {
      const quantity = product.category === "fabric" ? parseInt(size) : 1;
      const sizeValue = product.category === "fabric" ? "One Size" : size;
      addToCartMutation.mutate({
        productId: product.id,
        quantity,
        size: sizeValue,
      });
    }
    setShowSizeModal(false);
  };

  return (
    <>
      <div
        className={CN(
          "rounded-md bg-white relative overflow-hidden border border-neutral-100 flex flex-col transition-all duration-300",
          page === "fabric" && isHovered ? "shadow-lg" : "",
          containerClass
        )}
        onMouseEnter={() => page === "fabric" && setIsHovered(true)}
        onMouseLeave={() => page === "fabric" && setIsHovered(false)}
      >
        {/* Image section - clickable for navigation */}
        <Link
          to={link as string}
          className="relative block w-full h-[11.0625rem] overflow-hidden"
        >
          <img
            src={itemImage}
            alt={itemName}
            className="w-full h-full object-top object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Content section */}
        <div className="rounded-b-md border-t-0 border-x-0 border-b border-neutral-100 px-3 pb-2 flex flex-col transition-all duration-300 relative">
          {/* Title and Price - shifts up on hover for fabric */}
          <div
            className={CN(
              "transition-all duration-300",
              page === "fabric" && isHovered ? "-translate-y-2" : ""
            )}
          >
            <div className="font-light text-neutral-700 mb-2">{itemName}</div>

            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span className="text-neutral-900 font-semibold leading-araafit sm:block">
                ₦{formatPrice(Number(itemCost))}
                {product?.category === "fabric" && (
                  <span className=" ml-1">/yd</span>
                )}
              </span>

              {/* Shopping cart icon for ready-made items */}
              {page === "ready-made" && (
                <ShoppingCartSimpleIcon
                  className={`size-[20px] cursor-pointer transition-colors ${
                    addToCartMutation.isPending
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-primary-500 hover:text-primary-600"
                  }`}
                  onClick={
                    addToCartMutation.isPending ? undefined : handleAddToCart
                  }
                />
              )}
            </div>
          </div>

          {/* Sew this fabric button - slides up from bottom for fabric cards */}
          {page === "fabric" && (
            <div
              className={CN(
                "absolute bottom-0 left-0 right-0 transform transition-all duration-300 ease-out",
                isHovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              )}
            >
              <Link
                to={link as string}
                className="block w-full bg-[#9A6C50] hover:bg-[#7B523F] text-white px-4 py-3 rounded-b-md transition-colors duration-200"
              >
                <div className="flex items-center justify-center gap-2">
                  <ScissorsIcon size={18} weight="bold" />
                  <span className="text-sm font-semibold">Sew this fabric</span>
                </div>
                <p className="text-xs text-white/80 text-center mt-1">
                  Start custom order
                </p>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Size Selection Modal */}
      {product && page === "ready-made" && (
        <SizeSelectionModal
          isOpen={showSizeModal}
          onClose={() => setShowSizeModal(false)}
          onConfirm={handleSizeConfirm}
          productName={product.name}
          productCategory={product.category}
          isLoading={addToCartMutation.isPending}
        />
      )}
    </>
  );
}

export default memo(Card);
