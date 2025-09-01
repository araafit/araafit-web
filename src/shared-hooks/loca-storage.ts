import React from "react";

/* ---------------------------------------------------- */

type UseLocalStorage = {
  storedValue: any;
  setValue: (value: any | ((val: any) => void)) => void;
  removeValue: () => void;
};

/**
 * Hook to store and retrieve data from browser localStorage API.
 *
 * @param key
 * @param initialValue
 * @returns
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorage {
  // Read stored if available or return initial value
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Unable to read local storage key ${key}:`, error);

      return initialValue;
    }
  };

  // State to store storage value
  const [storedValue, setStoredValue] = React.useState<T>(readValue);

  // Return a wrapped version of useState's setter function
  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window === "undefined") {
      console.error(
        `Can't set localStorage with key '${key}'. Environment is not a client`
      );
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value;

      window.localStorage.setItem(key, JSON.stringify(newValue));

      // Save state
      setStoredValue(newValue);

      // Dispatch a custom event so other components can react to storage changes
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.error(`Error setting localStorage key '${key}':`, error);
    }
  };

  const removeValue = () => {
    if (typeof window === "undefined") {
      console.error(
        `Can't remove key '${key}' from localStorage. Environment is not a client`
      );
    }

    // Remove value
    localStorage.removeItem(key);
  };

  return { storedValue, setValue, removeValue };
}