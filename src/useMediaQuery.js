import { useState, useEffect } from 'react';

/**
 * Custom hook to detect screen size using window.matchMedia
 * This replaces MUI's useMediaQuery without requiring MUI as a dependency
 * 
 * @param {string} query - Media query string (e.g., '(min-width: 900px)')
 * @returns {boolean} - Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Update state if the query matches initially
    setMatches(mediaQuery.matches);

    // Create a handler function
    const handler = (event) => {
      setMatches(event.matches);
    };

    // Modern browsers support addEventListener on MediaQueryList
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

/**
 * Hook to check if screen is desktop size (md breakpoint and up)
 * Uses 900px as the breakpoint (matching MUI's default md breakpoint)
 * 
 * @returns {boolean} - True if screen width >= 900px
 */
export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 900px)');
};
