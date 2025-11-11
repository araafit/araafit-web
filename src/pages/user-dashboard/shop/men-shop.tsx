import { CaretRightIcon } from "@phosphor-icons/react";
import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import { useProducts } from "../../../hooks/user-dashboard.hooks";
import { useSearch } from "./context/search-context";
import { type Product } from "../../../services/products.service";
import LoaderView from "../../../layouts/user-dashboard/loader";
import Card from "../../../shared-components/card";
import SearchInput from "./components/search-input";

/* ----------------------------------------------------------------------------------- */

const BreadCrumb = () => (
  <div className="font-inter font-light capitalize flex items-center">
    <span className="text-primary-900">Araafit</span>
    <CaretRightIcon className="text-[#979797]" />
    <span className="text-[#979797]">Men</span>
  </div>
);

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
  });

  const userPage = "shop";

  // Helper function to generate product link
  const getProductLink = (product: Product) => {
    const category = product.category === "dress" ? "dress" : "fabric";
    return userPage === "shop"
      ? `/${userPage}/${category}/${product.id}`
      : `/${userPage}/shop/${category}/${product.id}`;
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
          <p className="text-gray-600">
            {error?.message || "Please try again later"}
          </p>
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

  return (
    <UserDashboardLayout>
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="shop" breadCrumb={<BreadCrumb />} />

        <div className="size-full rounded-md p-2 lg:p-4 mt-0 lg:mt-20 relative">
          <div className="bg-white h-[98%] overflow-y-scroll relative">
            <div className="w-full sticky top-0 left-0 z-10 bg-white flex items-center justify-between">
              <SearchInput />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4 p-8">
              {products.map((product) => (
                <Card
                  key={product.id}
                  itemName={product.name}
                  itemCost={product.price}
                  itemImage={
                    product.images?.[0]?.url || "/placeholder-image.jpg"
                  }
                  product={product}
                  link={getProductLink(product)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
