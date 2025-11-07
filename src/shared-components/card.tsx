import { memo, useState } from "react";
import { ShoppingCartSimpleIcon } from "@phosphor-icons/react";
import { CN } from "../utils/class-merge";
import { formatPrice } from "../utils/format-price";
import { Link, useNavigate } from "react-router-dom";
import { useAddToCart } from "../hooks/cart.hooks";
import SizeSelectionModal from "./size-selection-modal";
import type { Product } from "../services/products.service";
import Button from "./button";

/* --------------------------------------------------------------------- */

interface Card {
  containerClass?: string;
  itemName: string;
  itemImage: string;
  itemCost: string | number;
  link?: string;
  product?: Product; // New prop to pass the full product for API calls
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
  addToCart,
}: Card) {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const addToCartMutation = useAddToCart();
  const navigate = useNavigate();

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
      <div className={CN("rounded-t-md bg-white relative", containerClass)}>
        <img
          src={itemImage}
          alt={itemName}
          className="w-full h-[11.0625rem] object-top object-cover"
        />

        <div className="rounded-b-md border border-neutral-100 py-2 px-3">
          <div className="font-light text-neutral-700 mb-2">{itemName}</div>

          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span className="text-neutral-900 font-semibold leading-araafit sm:block">
              ₦{formatPrice(Number(itemCost))}
              {product?.category === "fabric" && (
                <span className=" ml-1">/yd</span>
              )}
            </span>

            {/* Can only make sewing request if item is fabric */}
            {product && product.category === "fabric" ? (
              <Button
                text="Make request"
                variant="outline"
                className="md:h-8 md:p-2 md:text-sm md:flex items-center justify-center"
                onClick={() => navigate(link as string)}
              />
            ) : (
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

        {link && (
          <Link
            to={link}
            className="absolute top-0 left-0 w-full h-[86%] bg-transparent"
          />
        )}
      </div>

      {product?.category === "fabric" ? <></> : <></>}

      {/* Size Selection Modal */}
      {product && (
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
