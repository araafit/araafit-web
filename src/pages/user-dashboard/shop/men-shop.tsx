import { useProducts } from "../../../hooks/user-dashboard.hooks";
import { useSearch } from "./context/search-context";
import { type Product } from "../../../services/products.service";
import LoaderView from "../../../layouts/user-dashboard/loader";
import Card from "../../../shared-components/card";

/* ----------------------------------------------------------------------------------- */

export function MenShop() {
  const { debouncedSearchQuery } = useSearch();
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useProducts({
    limit: 20,
    search: debouncedSearchQuery || undefined,
    category: "dress",
  });

  const products = productsData?.products || [];

  const menProduct = products.filter((item) =>
    Array.isArray(item.audience)
      ? item.audience.includes("men")
      : item.audience === "men"
  );

  // Helper function to generate product link
  const productLink = (product: Product) => {
    const category = product.category === "dress" ? "dress" : "fabric";
    return `/dashboard/shop/${category}/${product.id}`;
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
          <p className="text-red-600 mb-2">Unable to load products</p>
          <p className="text-gray-600">
            {error?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0 && !isLoading && !isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {debouncedSearchQuery
              ? `No products found for "${debouncedSearchQuery}"`
              : "No products available"}
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

  if (menProduct.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-sm text-gray-500">No Men products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4 p-8 pb-2">
      {menProduct.map((product) => (
        <Card
          key={product.id}
          itemName={product.name}
          itemCost={product.price ? product.price : ""}
          itemImage={product.images?.[0]?.url || "/placeholder-image.jpg"}
          product={product}
          link={productLink(product)}
        />
      ))}
    </div>
  );
}
