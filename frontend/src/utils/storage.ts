/**
 * Storage Utilities
 * Helper functions for localStorage and sessionStorage
 */

/**
 * Get item from localStorage
 */
export const getLocalStorage = <T = any>(key: string, defaultValue?: T): T | null => {
  try {
    if (typeof window === 'undefined') return defaultValue || null;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue || null;
  }
};

/**
 * Set item in localStorage
 */
export const setLocalStorage = <T = any>(key: string, value: T): void => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
};

/**
 * Remove item from localStorage
 */
export const removeLocalStorage = (key: string): void => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
};

/**
 * Clear all localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};

/**
 * Get item from sessionStorage
 */
export const getSessionStorage = <T = any>(key: string, defaultValue?: T): T | null => {
  try {
    if (typeof window === 'undefined') return defaultValue || null;
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error(`Error reading from sessionStorage: ${key}`, error);
    return defaultValue || null;
  }
};

/**
 * Set item in sessionStorage
 */
export const setSessionStorage = <T = any>(key: string, value: T): void => {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to sessionStorage: ${key}`, error);
  }
};

/**
 * Remove item from sessionStorage
 */
export const removeSessionStorage = (key: string): void => {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from sessionStorage: ${key}`, error);
  }
};

/**
 * Clear all sessionStorage
 */
export const clearSessionStorage = (): void => {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage', error);
  }
};

/**
 * Storage keys constant
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
} as const;
