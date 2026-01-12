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
          className="relative block w-full aspect-square overflow-hidden"
        >
          <img
            src={itemImage}
            alt={itemName}
            className="w-full h-full object-top object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Content section */}
        <div className="rounded-b-md px-4 py-4 flex flex-col transition-all duration-300 relative min-h-[100px]">
          {/* Title and Price - shifts up on hover for fabric */}
          <div
            className={CN(
              "transition-all duration-300 flex-1",
              page === "fabric" && isHovered ? "-translate-y-2" : ""
            )}
          >
            {/* Product Name */}
            <h3 className="text-sm font-medium text-neutral-900 mb-3 line-clamp-2 leading-snug">
              {itemName}
            </h3>

            {/* Price and Actions */}
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold text-neutral-900">
                  ₦{formatPrice(Number(itemCost))}
                </span>
                {product?.category === "fabric" && (
                  <span className="text-xs text-neutral-500 font-normal">/yd</span>
                )}
              </div>

              {/* Shopping cart icon for ready-made items */}
              {page === "ready-made" && (
                <button
                  type="button"
                  onClick={
                    addToCartMutation.isPending ? undefined : handleAddToCart
                  }
                  disabled={addToCartMutation.isPending}
                  className={`flex-shrink-0 p-2 rounded-full transition-all ${
                    addToCartMutation.isPending
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#9A6C50] hover:text-[#7B523F] hover:bg-[#9A6C50]/10 active:bg-[#9A6C50]/20"
                  }`}
                  aria-label="Add to cart"
                >
                  <ShoppingCartSimpleIcon size={20} weight="regular" />
                </button>
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
                className="block w-full bg-[#9A6C50] hover:bg-[#7B523F] text-white px-4 py-3.5 rounded-b-md transition-colors duration-200"
              >
                <div className="flex items-center justify-center gap-2">
                  <ScissorsIcon size={18} weight="bold" />
                  <span className="text-sm font-semibold">Sew this fabric</span>
                </div>
                <p className="text-xs text-white/90 text-center mt-1.5">
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
