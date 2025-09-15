import { useProducts } from "../../hooks/user-dashboard.hooks";
import { useSearch } from "../../pages/user-dashboard/shop/context/search-context";
import Card from "../card";
import Spinner from "../spinner";
import type { Product } from "../../services/products.service";

/* ------------------------------------------------------------------ */

/**
 * Fabric component to render fabric shop items
 *
 * @returns ReactElement
 */
export default function FabricItems({
  userPage,
}: {
  userPage: "shop" | "dashboard";
}) {
  const { debouncedSearchQuery } = useSearch();
  const { data: productsData, isLoading, isError, error } = useProducts({
    category: "fabric",
    limit: 20,
    search: debouncedSearchQuery || undefined,
  });

  // Helper function to generate product link
  const getProductLink = (product: Product) => {
    return userPage === "shop"
      ? `/${userPage}/fabric/${product.id}`
      : `/${userPage}/shop/fabric/${product.id}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-gray-600">Loading fabrics...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading fabrics</p>
          <p className="text-gray-600">{error?.message || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  const products = productsData?.products || [];

  if (products.length === 0 && !isLoading && !isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {debouncedSearchQuery 
              ? `No fabrics found for "${debouncedSearchQuery}"` 
              : "No fabrics available"
            }
          </p>
          {debouncedSearchQuery && (
            <p className="text-sm text-gray-500">Try searching with different keywords</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <Card
          key={product.id}
          itemName={product.name}
          itemCost={product.price}
          itemImage={product.images?.[0]?.url || "/placeholder-image.jpg"}
          product={product}
          link={getProductLink(product)}
        />
      ))}
    </div>
  );
}
