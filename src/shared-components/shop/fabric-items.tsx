import { useProducts } from "../../hooks/user-dashboard.hooks";
import { useSearch } from "../../pages/user-dashboard/shop/context/search-context";
import { useShopFiltersSafe } from "../../pages/user-dashboard/shop/context/shop-filters-context";
import Card from "../card";
import type { Product } from "../../services/products.service";
import LoaderView from "../../layouts/user-dashboard/loader";

/* ------------------------------------------------------------------ */

/**
 * Fabric component to render fabric shop items
 * @param userPage - Indicates if the component is used in 'shop' or 'dashboard' page
 *
 * @returns ReactElement
 */
export default function FabricItems({
  userPage,
}: {
  userPage: "shop" | "dashboard";
}) {
  const { debouncedSearchQuery } = useSearch();
  const { selectedMeasurementSetId, selectedSkinTone } = useShopFiltersSafe();
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useProducts({
    category: "fabric",
    limit: 20,
    search: debouncedSearchQuery || undefined,
    measurementSetId: selectedMeasurementSetId || undefined,
    skinTone: selectedSkinTone || undefined,
  });

  // Helper function to generate product link
  const itemRequestLink = (product: Product) => {
    // For guest shop, use /shop path; for dashboard, use /dashboard/shop path
    return userPage === "shop"
      ? `/shop/fabric/${product.id}/request`
      : `/dashboard/shop/fabric/${product.id}/request`;
  };
  const itemImage = (product: Product) =>
    product.images?.[0]?.url || "/placeholder-image.jpg";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <LoaderView />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading fabrics</p>
          <p className="text-gray-600">
            {error?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  const fabricProducts = productsData?.products || [];

  if (fabricProducts.length === 0 && !isLoading && !isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {debouncedSearchQuery
              ? `No fabrics found for "${debouncedSearchQuery}"`
              : "No fabrics available"}
          </p>
          {debouncedSearchQuery && (
            <p className="text-sm text-gray-500">
              Try searching with different keywords
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-3">
      {fabricProducts.map((product) => (
        <Card
          key={product.id}
          itemName={product.name}
          itemCost={product.price ?? 0}
          itemImage={itemImage(product)}
          product={product}
          link={itemRequestLink(product)}
          page="fabric"
        />
      ))}
    </div>
  );
}
