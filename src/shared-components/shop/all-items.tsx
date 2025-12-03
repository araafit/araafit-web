import { useProducts } from "../../hooks/user-dashboard.hooks";
import { useSearch } from "../../pages/user-dashboard/shop/context/search-context";
import Card from "../card";
import type { Product } from "../../services/products.service";
import LoaderView from "../../layouts/user-dashboard/loader";

/**
 * AllItems component to render all shop items
 *
 * @returns ReactElement
 */
export default function AllItems({
  userPage,
}: {
  userPage: "shop" | "dashboard";
}) {
  const { debouncedSearchQuery } = useSearch();
  const { data: productsData, isLoading, isError, error } = useProducts({
    limit: 20,
    search: debouncedSearchQuery || undefined,
    // No category filter - show all products
  });

  // Helper function to generate product link
  const getProductLink = (product: Product) => {
    const category = product.category === "dress" ? "dress" : "fabric";
    return userPage === "shop"
      ? `/${userPage}/${category}/${product.id}`
      : `/${userPage}/shop/${category}/${product.id}`;
  };

  // Helper function to get page prop based on product category
  const getPageProp = (product: Product) => {
    return product.category === "dress" ? "ready-made" : "fabric";
  };

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
          <p className="text-red-600 mb-2">Error loading products</p>
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
              ? `No products found for "${debouncedSearchQuery}"` 
              : "No products available"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-3">
      {products.map((product) => (
        <Card
          key={product.id}
          itemName={product.name}
          itemCost={product.price ?? 0}
          itemImage={product.images?.[0]?.url || "/placeholder-image.jpg"}
          product={product}
          link={getProductLink(product)}
          page={getPageProp(product)}
        />
      ))}
    </div>
  );
}
