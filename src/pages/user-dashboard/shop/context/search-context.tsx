import React, { useState, createContext, useContext, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

/* --------------------------------------------------------------------- */

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  debouncedSearchQuery: string;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query to avoid too many API calls
  const updateDebouncedSearch = useCallback(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update debounced search when search query changes
  React.useEffect(() => {
    const cleanup = updateDebouncedSearch();
    return cleanup;
  }, [updateDebouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, []);

  const value = {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return context;
};
