import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useSearch } from "../context/search-context";

/* --------------------------------------------------------------------- */

/**
 * Search input component for the shop page
 *
 * @returns ReactElement
 */
export default function SearchInput() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
