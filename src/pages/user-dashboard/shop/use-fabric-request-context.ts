import { useLocation } from "react-router-dom";

/**
 * Hook to determine if we're in guest or dashboard context
 * Returns the base path and navigation helpers
 */
export function useFabricRequestContext() {
  const location = useLocation();
  const isGuestContext = location.pathname.startsWith("/shop");
  
  const basePath = isGuestContext ? "/shop" : "/dashboard/shop";
  const fabricsPath = isGuestContext ? "/shop" : "/dashboard/shop/fabrics";
  
  return {
    isGuestContext,
    basePath,
    fabricsPath,
  };
}

