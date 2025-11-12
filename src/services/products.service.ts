import apiClient from "../lib/axios";

// Types for Products
export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
}

export interface Product {
  id: string;
  name: string;
  category: "dress" | "fabric";
  description: string;
  materialType: string;
  dressSize: number | string | null;
  weight: number | string | null;
  thickness: number | string | null;
  quantityInStock: number | string | null;
  price: number | string | null;
  pricePerYard: number | string | null;
  discountType: number | string | null;
  discountValue: number | string | null;
  discountStart: string | null;
  discountEnd: string | null;
  totalSize: string | number | null;
  style: string | null;
  patternType: string | null;
  skinToneRecommendation: ["sand", "espresso", "sand", "espresso"];
  audience: "men" | "women" | "kids";
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductsQueryParams {
  category?: "dress" | "fabric";
  page?: number;
  limit?: number;
  audience?: "men" | "women" | "kids";
  search?: string;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

// Service functions
export const productsService = {
  // Get all products with optional filters
  async getProducts(
    params: ProductsQueryParams = {}
  ): Promise<ProductsResponse> {
    try {
      const queryString = new URLSearchParams();

      if (params.category) queryString.append("category", params.category);
      if (params.page) queryString.append("page", params.page.toString());
      if (params.limit) queryString.append("limit", params.limit.toString());
      if (params.audience)
        queryString.append("limit", params.audience.toString());
      if (params.search) queryString.append("search", params.search);

      const url = `/products${
        queryString.toString() ? `?${queryString.toString()}` : ""
      }`;
      const response = await apiClient.get<ApiResponse<ProductsResponse>>(url);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get ready-to-wear dresses (limited for dashboard)
  async getReadyToWearDresses(limit: number = 3): Promise<Product[]> {
    try {
      const response = await this.getProducts({
        category: "dress",
        page: 1,
        limit,
      });
      return response.products;
    } catch (error) {
      console.error("Error fetching ready-to-wear dresses:", error);
      throw error;
    }
  },

  // Get recommended fabrics (limited for dashboard)
  async getRecommendedFabrics(limit: number = 3): Promise<Product[]> {
    try {
      const response = await this.getProducts({
        category: "fabric",
        page: 1,
        limit,
      });
      return response.products;
    } catch (error) {
      console.error("Error fetching recommended fabrics:", error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(productId: string): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `/products/${productId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },
};
