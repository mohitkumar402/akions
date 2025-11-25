// API Configuration
// Uses environment variable for production, defaults to localhost for development

// For Expo, use EXPO_PUBLIC_API_URL if available
// For web, use window.location to detect environment
const getApiBaseUrl = () => {
  // Check for Expo environment variable (works in web and native)
  // Expo exposes env vars via process.env.EXPO_PUBLIC_*
  const envApiUrl = typeof process !== 'undefined' && (process as any).env?.EXPO_PUBLIC_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Check for window.location (web environment)
  if (typeof window !== 'undefined' && window.location) {
    // If running on localhost, use local backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
  }
  
  // Production backend URL (Render deployment)
  return 'https://akions.onrender.com';
};

export const API_BASE = getApiBaseUrl();
export const API_URL = `${API_BASE}/api`;
export const API_AUTH_URL = `${API_BASE}/api/auth`;

