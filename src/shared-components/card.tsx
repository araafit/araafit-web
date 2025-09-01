import { memo } from "react";
import { ShoppingCartSimpleIcon } from "@phosphor-icons/react";
import { CN } from "../utils/class-merge";
import { formatPrice } from "../utils/format-price";
import { type CartItem } from "../pages/user-dashboard/_data/_cart";
import { Link } from "react-router-dom";

/* --------------------------------------------------------------------------- */

interface Card {
  containerClass?: string;
  itemName: string;
  itemImage: string;
  itemCost: string | number;
  link?: string;
  addToCart: (item: CartItem) => void;
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
  addToCart,
}: Card) {
  return (
    <div className={CN("rounded-t-md bg-white relative", containerClass)}>
      <img
        src={itemImage}
        alt={itemName}
        className="w-full h-[11.0625rem] object-top"
      />

      <div className="rounded-b-md border border-neutral-100 py-2 px-3">
        <div className="font-light text-neutral-700 mb-2">{itemName}</div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-900 font-semibold leading-a">
            ₦{formatPrice(Number(itemCost))}
          </span>

          <ShoppingCartSimpleIcon
            className="size-[20px] cursor-pointer text-primary-500"
            onClick={() => addToCart}
          />
        </div>
      </div>

      {link && (
        <Link
          to={link}
          className="absolute top-0 left-0 w-full h-[86%] bg-transparent"
        />
      )}
    </div>
  );
}

export default memo(Card);
