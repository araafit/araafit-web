import apiClient from "../lib/axios";

type Audience = "men" | "women" | "kids";

// Types for Products
export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
}

export interface ProductSizeChart {
  id: string;
  name: string;
  gender: "male" | "female";
}

export interface ProductSizeChartEntry {
  id: string;
  chart: ProductSizeChart;
  label: string;
  chestMin: number | null;
  chestMax: number | null;
  waistMin: number | null;
  waistMax: number | null;
  hipsMin: number | null;
  hipsMax: number | null;
  neckMin: number | null;
  neckMax: number | null;
  shoulderMin: number | null;
  shoulderMax: number | null;
  heightMin: number | null;
  heightMax: number | null;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
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
  audience: Audience | Audience[];
  images: ProductImage[];
  availableSizeChartEntries?: ProductSizeChartEntry[];
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
  audience?: Audience;
  search?: string;
  measurementSetId?: string;
  skinTone?: string;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface ProductRecommendedSize {
  chartId: string;
  chartName: string;
  entryId: string;
  label: string;
}

export interface ProductRecommendedSizeResponse {
  productId: string;
  gender: "MALE" | "FEMALE" | string;
  recommendedSizes: ProductRecommendedSize[];
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
        queryString.append("audience", params.audience.toString());
      if (params.search) queryString.append("search", params.search);
      if (params.measurementSetId) queryString.append("measurementSetId", params.measurementSetId);
      if (params.skinTone) queryString.append("skinTone", params.skinTone);

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

  async getProductRecommendedSizes(
    productId: string,
    measurementSetId?: string
  ): Promise<ProductRecommendedSizeResponse> {
    try {
      const params = new URLSearchParams();
      if (measurementSetId) {
        params.append("measurementSetId", measurementSetId);
      }
      const url = `/products/${productId}/recommended-size${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response =
        await apiClient.get<ApiResponse<ProductRecommendedSizeResponse>>(url);
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching recommended sizes for product ${productId}:`,
        error
      );
      throw error;
    }
  },
};
