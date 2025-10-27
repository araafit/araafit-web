import { AxiosError } from "axios";
import apiClient from "../lib/axios";
import type { ApiResponse } from "./admin-auth.service";
import type { Pagination } from "./products.service";

// Types for Admin Inventory
export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: "dress" | "fabric";
  description?: string;
  materialType?: string;
  dressSize?: string;
  weight?: number;
  thickness?: string;
  quantityInStock?: number;
  price?: number;
  pricePerYard?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  discountStart?: string;
  discountEnd?: string;
  totalSize?: string;
  style?: string;
  patternType?: string;
  skinToneRecommendation?: string[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductMetrics {
  totalInventory: number;
  totalDresses: number;
  totalFabrics: number;
  totalInStock: number;
  totalLowStock: number;
  totalOutOfStock: number;
  lowStockThreshold: number;
}

export interface CreateProductRequest {
  files?: File[];
  name: string;
  category: "dress" | "fabric";
  description?: string;
  materialType?: string;
  dressSize?: string;
  totalSize?: string;
  patternType?: string;
  pricePerYard?: number;
  weight?: number;
  thickness?: string;
  quantityInStock?: number;
  price?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  discountStart?: string;
  discountEnd?: string;
  skinToneRecommendation?: string[];
  styleId?: number;
}

export interface UpdateProductRequest {
  files?: File[];
  name?: string;
  description?: string;
  materialType?: string;
  dressSize?: string;
  totalSize?: string;
  patternType?: string;
  pricePerYard?: number;
  weight?: number;
  thickness?: string;
  quantityInStock?: number;
  price?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  discountStart?: string;
  discountEnd?: string;
  skinToneRecommendation?: string[];
  styleId?: number;
}

export interface CreateProductResponse {
  message: string;
  product: AdminProduct;
}

export interface UpdateProductResponse {
  message: string;
  product: AdminProduct;
}

export interface DeleteProductResponse {
  message: string;
}

// Admin Inventory Service Class
class AdminInventoryService {
  /**
   * Get product metrics
   */
  async getProductMetrics(): Promise<ProductMetrics> {
    const response = await apiClient.get<ApiResponse<ProductMetrics>>(
      "/products/metrics"
    );
    return response.data.data;
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<{
    pagination: Pagination;
    products: AdminProduct[];
  }> {
    const response = await apiClient.get<
      ApiResponse<{ pagination: Pagination; products: AdminProduct[] }>
    >("/products");
    return response.data.data;
  }

  /**
   * Get product by ID
   */
  async getProduct(productId: string): Promise<AdminProduct> {
    const response = await apiClient.get<ApiResponse<AdminProduct>>(
      `/products/${productId}`
    );
    return response.data.data;
  }

  /**
   * Create new product
   */
  async createProduct(
    data: CreateProductRequest
  ): Promise<CreateProductResponse> {
    const formData = new FormData();

    // Add files if provided
    if (data.files && data.files?.length > 0) {
      data.files.forEach((file) => formData.append("files", file));
    }

    // Add required fields
    formData.append("name", data.name);
    formData.append("category", data.category);

    // Add optional string fields
    const stringFields = [
      "description",
      "materialType",
      "dressSize",
      "totalSize",
      "patternType",
      "thickness",
      "discountType",
      "discountStart",
      "discountEnd",
    ] as const;

    stringFields.forEach((field) => {
      if (data[field]) formData.append(field, data[field]);
    });

    // Add optional numeric fields
    const numericFields = [
      "pricePerYard",
      "weight",
      "quantityInStock",
      "price",
      "discountValue",
      "styleId",
    ] as const;

    numericFields.forEach((field) => {
      if (data[field] !== undefined)
        formData.append(field, data[field].toString());
    });

    // Add skin tone recommendations if provided
    if (
      data.skinToneRecommendation &&
      data.skinToneRecommendation?.length > 0
    ) {
      formData.append(
        "skinToneRecommendation",
        data.skinToneRecommendation.join(",")
      );
      data.skinToneRecommendation.forEach((tone) => {
        formData.append("skinToneRecommendation", tone);
      });
    }

    const response = await apiClient.post<ApiResponse<CreateProductResponse>>(
      "/products/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 100000,
      }
    );
    return response.data.data;
  }

  /**
   * Update product
   */
  async updateProduct(
    productId: string,
    data: UpdateProductRequest
  ): Promise<UpdateProductResponse> {
    const formData = new FormData();

    // Add files if provided
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    // Add all other fields that are provided
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.materialType) formData.append("materialType", data.materialType);
    if (data.dressSize) formData.append("dressSize", data.dressSize);
    if (data.totalSize) formData.append("totalSize", data.totalSize);
    if (data.patternType) formData.append("patternType", data.patternType);
    if (data.pricePerYard !== undefined)
      formData.append("pricePerYard", data.pricePerYard.toString());
    if (data.weight !== undefined)
      formData.append("weight", data.weight.toString());
    if (data.thickness) formData.append("thickness", data.thickness);
    if (data.quantityInStock !== undefined)
      formData.append("quantityInStock", data.quantityInStock.toString());
    if (data.price !== undefined)
      formData.append("price", data.price.toString());
    if (data.discountType) formData.append("discountType", data.discountType);
    if (data.discountValue !== undefined)
      formData.append("discountValue", data.discountValue.toString());
    if (data.discountStart)
      formData.append("discountStart", data.discountStart);
    if (data.discountEnd) formData.append("discountEnd", data.discountEnd);
    if (data.styleId !== undefined)
      formData.append("styleId", data.styleId.toString());

    if (data.skinToneRecommendation && data.skinToneRecommendation.length > 0) {
      data.skinToneRecommendation.forEach((tone) => {
        formData.append("skinToneRecommendation", tone);
      });
    }

    const response = await apiClient.put<ApiResponse<UpdateProductResponse>>(
      `/products/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<DeleteProductResponse> {
    const response = await apiClient.delete<ApiResponse<DeleteProductResponse>>(
      `/products/${productId}`
    );

    if (response.status !== 200) {
      const error = new AxiosError(
        "Something went went wrong!",
        undefined,
        response.config,
        response.request,
        response
      );

      throw error;
    }

    return response.data;
  }
}

// Export singleton instance
export const adminInventoryService = new AdminInventoryService();
export default adminInventoryService;
