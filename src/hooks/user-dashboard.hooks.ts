import { useQuery } from "@tanstack/react-query";
import { ordersService, type Order } from "../services/orders.service";
import { productsService, type Product } from "../services/products.service";

// Hook for fetching recent ongoing orders
export const useRecentOngoingOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", "recent", "ongoing"],
    queryFn: () => ordersService.getRecentOngoingOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching ready-to-wear dresses for dashboard
export const useReadyToWearDresses = (limit: number = 3) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", "dresses", "ready-to-wear", limit],
    queryFn: () => productsService.getReadyToWearDresses(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for fetching recommended fabrics for dashboard
export const useRecommendedFabrics = (limit: number = 3) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", "fabrics", "recommended", limit],
    queryFn: () => productsService.getRecommendedFabrics(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for fetching dashboard data (combines all dashboard queries)
export const useDashboardData = () => {
  const ordersQuery = useRecentOngoingOrders();
  const dressesQuery = useReadyToWearDresses();
  const fabricsQuery = useRecommendedFabrics();

  return {
    orders: ordersQuery,
    dresses: dressesQuery,
    fabrics: fabricsQuery,
    isLoading: ordersQuery.isLoading || dressesQuery.isLoading || fabricsQuery.isLoading,
    isError: ordersQuery.isError || dressesQuery.isError || fabricsQuery.isError,
    error: ordersQuery.error || dressesQuery.error || fabricsQuery.error,
  };
};

// Hook for fetching all products with filters
export const useProducts = (params: Parameters<typeof productsService.getProducts>[0] = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching single product by ID
export const useProduct = (productId: string) => {
  return useQuery<Product, Error>({
    queryKey: ["products", productId],
    queryFn: () => productsService.getProductById(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for fetching single order by ID
export const useOrder = (orderId: string) => {
  return useQuery<Order, Error>({
    queryKey: ["orders", orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
