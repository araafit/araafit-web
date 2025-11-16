import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "../../hooks/user-dashboard.hooks";
import { useAddToCart } from "../../hooks/cart.hooks";
import { useInstantCheckout } from "../../hooks/orders.hooks";
import Button from "../button";
import { formatPrice } from "../../utils/format-price";
import LoaderView from "../../layouts/user-dashboard/loader";
import showToast from "../../utils/notification";
import { notificationStyles } from "../../style/custom";
import Spinner from "../spinner";

/* ----------------------------------------------------------------- */

export function DressDetail() {
  const { itemName } = useParams<{ itemName: string }>();
  const productId = itemName || "";

  const { data: product, isLoading, isError, error } = useProduct(productId);
  const addToCartMutation = useAddToCart();
  const instantCheckoutMutation = useInstantCheckout();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      showToast.error("Select a size before proceeding to checkout.", {
        icon: null,
        position: "top-center",
        style: notificationStyles.alertError,
      });
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      size: selectedSize,
    });
  };

  const handlePayNow = () => {
    // console.log("Pay Now clicked");
    if (!product || !selectedSize) {
      showToast.error("Select a size before proceeding to checkout.", {
        icon: null,
        position: "top-center",
        style: notificationStyles.alertError,
      });
      return;
    }

    instantCheckoutMutation.mutate({
      productId: product.id,
      quantity,
      size: selectedSize,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <LoaderView />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading dress</p>
          <p className="text-gray-600">{error?.message || "Dress not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[72rem] flex flex-col gap-4">
      <div className="h-auto bg-white rounded-md p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="relative w-full lg:w-1/2 aspect-square max-w-[35.4375rem] bg-gray-100 rounded-md">
              <img
                src={product.images?.[0]?.url || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-full rounded-md object-cover"
              />
              <div className="absolute left-3 top-40 flex flex-col gap-[1rem]">
                {product.images?.slice(0, 4).map((image, idx) => (
                  <img
                    key={idx}
                    src={image.url}
                    alt={`${product.name} view ${idx + 2}`}
                    className="w-[101px] h-[67px] rounded-md object-cover border border-white cursor-pointer hover:border-primary-500 transition-colors"
                  />
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-neutral-700 font-semibold text-[1.5rem]">
                  {product.name}
                </h3>
                <p className="text-neutral-700 font-light">
                  {product.description}
                </p>
                <span className="font-semibold text-neutral-900">
                  ₦{formatPrice(Number(product.price ?? 0))}
                </span>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <div className="mb-3">Color</div>
                <div className="size-[40px] bg-[#2280B3] rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#1C1C1C] text-[14px]">Dress size</span>

                <span className="text-[#979797] text-[12px]">Size Guide</span>
              </div>

              <div className="flex flex-col gap-3 border-b border-gray-100 pb-3">
                <div className="bg-yellow-50 rounded-md p-2">
                  <h5 className="mb-4 font-inter text-[#F59E0B]">
                    We’ve Got Your Size Covered
                  </h5>

                  <p className="text-[#B47409] font-light">
                    No need to choose a size—our AI has already selected the
                    perfect fit for you based on your measurements.
                  </p>
                </div>

                <div className="w-full flex items-center justify-between">
                  {sizes.map((size) => (
                    <div
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-[3.625rem] h-[2.75rem] p-2 text-[14px] border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                        selectedSize === size
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-[#E8E8E8] hover:border-gray-300"
                      }`}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[14px]">Quality</span>

                <div className="w-[121px] flex items-center justify-between gap-2 border border-neutral-100 py-[10px] px-[12px] rounded-md">
                  <MinusIcon
                    className="cursor-pointer hover:text-primary-500"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  />
                  <span>{quantity}</span>
                  <PlusIcon
                    className="cursor-pointer hover:text-primary-500"
                    onClick={() => setQuantity(quantity + 1)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 flex items-center justify-center gap-[1.5rem] py-[40px] px-[24px]">
            <Button
              variant="outline"
              className="w-[23.4375rem] border border-neutral-500 text-neutral-900 cursor-pointer"
              disabled={addToCartMutation.isPending}
              onClick={handleAddToCart}
            >
              <div className="w-full flex items-center justify-center gap-2">
                <span>
                  {addToCartMutation.isPending ? "Adding" : "Add to Cart"}
                </span>
                <Spinner
                  isLoading={addToCartMutation.isPending}
                  size="sm"
                  speed="fast"
                  circleColor="#3D3D3D"
                />
              </div>
            </Button>

            <Button
              type="button"
              variant="solid"
              className="w-[23.4375rem] cursor-pointer"
              disabled={
                addToCartMutation.isPending || instantCheckoutMutation.isPending
              }
              onClick={handlePayNow}
            >
              <div className="w-full flex items-center justify-center gap-2">
                {instantCheckoutMutation.isPending ? (
                  <span>Processing</span>
                ) : (
                  <span>Pay Now</span>
                )}
                <Spinner
                  isLoading={instantCheckoutMutation.isPending}
                  size="sm"
                  speed="fast"
                  circleColor="#9A6C50"
                />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
