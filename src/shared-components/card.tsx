import { memo } from "react";
import { CN } from "../utils/class-merge";
import { formatPrice } from "../utils/format-price";
import { Link } from "react-router-dom";
import type { Product } from "../services/products.service";
import { ScissorsIcon } from "@phosphor-icons/react";

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
}: Card) {

  return (
    <div className={CN("rounded-t-md bg-white relative", containerClass)}>
      <img
        src={itemImage}
        alt={itemName}
        className="w-full h-[11.0625rem] object-top object-cover"
      />

      <div className="rounded-b-md border border-neutral-100 py-2 px-3 flex items-center justify-between">
        <div className="font-light text-neutral-700">{itemName}</div>

        <span className="text-neutral-900 font-semibold leading-araafit sm:block">
          ₦{formatPrice(Number(itemCost))}
          {product?.category === "fabric" && <span className=" ml-1">/yd</span>}
        </span>
      </div>

      {link && (
        <Link
          to={link}
          className="absolute top-0 left-0 w-full h-full rounded-b-md flex items-center justify-center group hover:bg-[#00000099] transition-all"
        >
          <div className="w-auto flex items-center gap-2 p-2 rounded-md border border-white text-white invisible group-hover:visible">
            <p className="text-lg font-normal">Saw this fabric</p>
            <ScissorsIcon size={24} />
          </div>
        </Link>
      )}
    </div>
  );
}

export default memo(Card);
