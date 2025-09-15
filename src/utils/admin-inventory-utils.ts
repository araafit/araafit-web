import type { AdminProduct, ProductMetrics } from "../services/admin-inventory.service";
import { formatCurrency, formatDate } from "./admin-dashboard-utils";

// Convert API product to inventory table format
export const convertApiProductToInventoryFormat = (apiProduct: AdminProduct) => {
  // Determine stock status based on quantity
  const getStockStatus = (quantity?: number, lowStockThreshold = 5) => {
    if (!quantity || quantity === 0) return "Out of Stock";
    if (quantity <= lowStockThreshold) return "Low Stock";
    return "In Stock";
  };

  return {
    orderId: apiProduct.id,
    Price: apiProduct.price || 0,
    DiscountsType: apiProduct.discountType || "none",
    stock: apiProduct.quantityInStock || 0,
    status: getStockStatus(apiProduct.quantityInStock),
    DiscountValue: apiProduct.discountValue || 0,
    startDate: apiProduct.discountStart,
    endDate: apiProduct.discountEnd,

    generalInformation: {
      name: apiProduct.name,
      image: apiProduct.images[0]?.url || "", // Use first image
      category: apiProduct.category as "dress" | "fabric",
      ProductDescription: apiProduct.description || "",
    },

    // Dress-specific info
    dressInformation: apiProduct.category === "dress" ? {
      materialType: apiProduct.materialType || "",
      dressSize: apiProduct.dressSize || "",
      weight: apiProduct.weight || 0,
      thickness: apiProduct.thickness || "",
    } : undefined,

    // Fabric-specific info
    fabricInformation: apiProduct.category === "fabric" ? {
      materialType: apiProduct.materialType || "",
      patternType: apiProduct.patternType || "",
      style: apiProduct.style || "",
      totalSize: apiProduct.totalSize || "",
      weight: apiProduct.weight || 0,
      thickness: apiProduct.thickness || "",
    } : undefined,

    skinTone: apiProduct.skinToneRecommendation || [],
    quantity: apiProduct.quantityInStock || 0,
  };
};

// Convert multiple API products to inventory table format
export const convertApiProductsToInventoryFormat = (apiProducts: AdminProduct[]) => {
  return apiProducts.map(convertApiProductToInventoryFormat);
};

// Calculate stock distribution for the stock bar component
export const calculateStockDistribution = (metrics: ProductMetrics) => {
  return [
    {
      color: "#00BA00",
      label: "In Stock",
      value: metrics.totalInStock,
    },
    {
      color: "#F3BF02", 
      label: "Low Stock",
      value: metrics.totalLowStock,
    },
    {
      color: "#FF0005",
      label: "Out of Stock", 
      value: metrics.totalOutOfStock,
    },
  ];
};

// Format inventory metrics for display
export const formatInventoryMetrics = (metrics: ProductMetrics) => {
  return {
    totalInventory: metrics.totalInventory,
    totalDresses: metrics.totalDresses,
    totalFabrics: metrics.totalFabrics,
    inStock: metrics.totalInStock,
    lowStock: metrics.totalLowStock,
    outOfStock: metrics.totalOutOfStock,
  };
};

// Get product category display name
export const getCategoryDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    dress: "Dress",
    fabric: "Fabric",
  };
  return categoryMap[category.toLowerCase()] || category;
};

// Format product price for display
export const formatProductPrice = (price?: number): string => {
  if (!price) return "₦0";
  return formatCurrency(price);
};

// Format product date for display
export const formatProductDate = (dateString: string): string => {
  return formatDate(dateString);
};

// Get stock status color classes
export const getStockStatusColorClasses = (status: string) => {
  const statusMap: Record<string, { textColor: string; bgColor: string }> = {
    "in stock": {
      textColor: "text-[#16A34A]",
      bgColor: "bg-[#F0FDF5]",
    },
    "low stock": {
      textColor: "text-[#F59E0B]", 
      bgColor: "bg-[#FEF3C7]",
    },
    "out of stock": {
      textColor: "text-[#DC2626]",
      bgColor: "bg-[#FEF2F2]",
    },
  };

  return statusMap[status.toLowerCase()] || {
    textColor: "text-[#6B7280]",
    bgColor: "bg-[#F3F4F6]",
  };
};
