import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "../../hooks/user-dashboard.hooks";
import { useAddToCart } from "../../hooks/cart.hooks";
import { useInstantCheckout } from "../../hooks/orders.hooks";
import Button from "../button";
import Spinner from "../spinner";
import { WarningIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { formatPrice } from "../../utils/format-price";

/* --------------------------------------------------------- */

export function FabricDetail() {
  const { itemName } = useParams<{ itemName: string }>();
  const productId = itemName || "";
  
  const { data: product, isLoading, isError, error } = useProduct(productId);
  const addToCartMutation = useAddToCart();
  const instantCheckoutMutation = useInstantCheckout();
  
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedYards, setSelectedYards] = useState(3);
  
  const measurement = [6, 8, 10, 12, 14, 16, 18, 20];

  const handleAddToCart = () => {
    if (!product || !selectedStyle) return;
    
    addToCartMutation.mutate({
      productId: product.id,
      quantity: selectedYards,
      size: "One Size", // Fabric doesn't have traditional sizes
    });
  };

  const handlePayNow = () => {
    if (!product || !selectedStyle) return;
    
    instantCheckoutMutation.mutate({
      productId: product.id,
      quantity: selectedYards,
      size: "One Size",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-gray-600">Loading fabric details...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading fabric</p>
          <p className="text-gray-600">{error?.message || "Fabric not found"}</p>
        </div>
      </div>
    );
  }

  const dressStyle = [
    "Corset",
    "Peplum top",
    "A-gown",
    "Puffy sleeves",
    "Off-shoulder",
    "Flay dresses",
    "Boubou",
    "Jumpsuits",
    "Long gown",
  ];

  return (
    <div className="w-full max-w-[72rem] flex flex-col gap-4">
      <div className="flex items-start gap-2 bg-[#FFF8EB] rounded-md border border-[#B47409] py-2 px-4">
        <WarningIcon className="text-[#F59E0B]" />

        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2 text-[#F59E0B]">
            <span>Important Notice</span>
          </div>

          <p className="text-[#B47409]">
            Your measurements have been saved securely. You're all set to get
            personalized dress and fabric recommendations!
          </p>

          <Link
            to="/dashboard/profile/get-measured"
            className="flex items-center gap-2 font-light text-[#F59E0B]"
          >
            <p>Enter measurement manually</p>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      <div className="h-auto bg-white rounded-md p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            {/* Item preview */}
            <div className="rounded-md flex flex-col gap-5 w-full lg:w-1/2">
              <img
                src={product.images?.[0]?.url || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full rounded-md object-cover h-[33rem]"
              />

              <div className="w-full flex gap-[1rem] flex-wrap">
                {product.images?.slice(1, 6).map((image, idx) => (
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
                  ₦{formatPrice(product.price)} per yard
                </span>
                <span className="text-sm text-neutral-600">
                  Total: ₦{formatPrice(product.price * selectedYards)} ({selectedYards} yards)
                </span>
              </div>

              {/* Dress size */}
              <div className="flex flex-col gap-3 border-b border-gray-100 pb-3">
                <div>
                  <div className="w-full flex items-center justify-between text-[12px]">
                    <span className="text-neutral-900">Dress size</span>
                    <span className="text-neutral-400">Size Guide</span>
                  </div>
                </div>

                <div className="bg-[#FFF8EB] rounded-md p-2">
                  <h5 className="mb-4 font-inter text-[#F59E0B]">
                    We’ve Got Your Size Covered
                  </h5>

                  <p className="w-full text-[#B47409] font-light">
                    No need to choose a size—our AI has already selected the
                    perfect fit for you based on your measurements.
                  </p>
                </div>

                <div className="w-full flex items-center justify-between">
                  {measurement.map((item, idx) => (
                    <div
                      key={idx}
                      className="w-[3.625rem] h-[2.75rem] p-2 text-[14px] border border-[#E8E8E8] rounded-md flex items-center justify-center cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Dress style */}
              <div className="w-full flex flex-col gap-3">
                <span className="text-[14px]">Select Dress Style</span>

                <div className="grid grid-cols-3 gap-4">
                  {dressStyle.map((style) => (
                    <div
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`w-[10rem] border py-2 px-3 rounded-md text-center cursor-pointer transition-colors ${
                        selectedStyle === style
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-[#E8E8E8] text-[#494949] hover:border-gray-300"
                      }`}
                    >
                      {style}
                    </div>
                  ))}
                </div>
              </div>

              {/* Yard estimate */}
              <div className="w-full flex flex-col gap-3">
                <span className="text-[14px]">
                  Yard Estimate (based on measurement & style)
                </span>

                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={selectedYards}
                    onChange={(e) => setSelectedYards(Number(e.target.value))}
                    className="w-24 p-2 border border-gray-300 rounded text-center outline-none focus:border-primary-500"
                  />
                  <span className="text-sm text-gray-600">yards</span>
                </div>
                
                <p className="text-xs text-gray-500">
                  Estimated based on your measurements and selected style. You can adjust as needed.
                </p>
              </div>
            </div>
          </div>

          {/* TC */}
          <div className="flex items-center justify-center gap-[1.5rem] py-[40px] px-[24px]">
            <div className="w-full bg-[#F6F7F9] flex flex-col gap-2 p-3">
              <span className="text-[#667A91]">No Refund Policy</span>

              <p className="text-[#333B47] font-light">
                Each piece is custom-made using your unique body measurements.
                Because of this personalised process, we are unable to offer
                refunds. Please double-check your entries before placing your
                order.
              </p>

              <div className="w-full flex gap-4 text-[#516278]">
                <input type="checkbox" />
                <span className="font-normal">
                  I understand and accept the no refund policy.
                </span>
              </div>
            </div>
          </div>

          {/* Proceed */}
          <div className="flex items-center justify-center">
            <Button 
              text="Add to Cart" 
              variant="solid" 
              disabled={!selectedStyle || addToCartMutation.isPending}
              onClick={handleAddToCart}
            >
              {addToCartMutation.isPending && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}