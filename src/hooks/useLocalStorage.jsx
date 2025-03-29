import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to persist component state in localStorage
 * @param {string} key - The localStorage key to use
 * @param {any} initialValue - Default value if no data exists in localStorage
 * @returns {Array} - [storedValue, setStoredValue]
 */
function useLocalStorage(key, initialValue) {
  // Ref to track if this is the first render
  const isFirstRender = useRef(true);
  
  // Track if we're currently setting a value to prevent update loops
  const isSettingValue = useRef(false);
  
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      if (isFirstRender.current) {
        console.log(`Initializing localStorage for key: ${key}`);
        isFirstRender.current = false;
        const parsedItem = item ? JSON.parse(item) : initialValue;
        return parsedItem;
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Prevent update loops
      if (isSettingValue.current) return;
      
      isSettingValue.current = true;
      
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      console.log(`Saving to localStorage key "${key}"`);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Reset the setting flag after a small delay
      setTimeout(() => {
        isSettingValue.current = false;
      }, 50);
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error saving to localStorage key "${key}":`, error);
      isSettingValue.current = false;
    }
  };

  // Add effect to update localStorage when the window is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log(`Persisting final state for "${key}" before page unload`);
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;