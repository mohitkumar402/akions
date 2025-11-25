// API Configuration
// Uses environment variable for production, defaults to localhost for development

// For Expo, use EXPO_PUBLIC_API_URL if available
// For web, use window.location to detect environment
const getApiBaseUrl = () => {
  // Priority 1: Check for Expo environment variable (works in web and native)
  // This is set at build time and works in production deployments
  if (typeof process !== 'undefined') {
    const envApiUrl = (process as any).env?.EXPO_PUBLIC_API_URL;
    if (envApiUrl) {
      console.log('[API Config] Using EXPO_PUBLIC_API_URL:', envApiUrl);
      return envApiUrl;
    }
  }
  
  // Priority 2: Check for window.location (web environment)
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    
    // If running on localhost, use local backend (development mode)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('[API Config] Detected localhost, using local backend');
      return 'http://localhost:3000';
    }
    
    // If running on a production domain (not localhost), use production backend
    console.log('[API Config] Detected production domain, using Render backend');
    return 'https://akions.onrender.com';
  }
  
  // Priority 3: Fallback to production backend URL (Render deployment)
  console.log('[API Config] Using fallback production backend');
  return 'https://akions.onrender.com';
};

export const API_BASE = getApiBaseUrl();
export const API_URL = `${API_BASE}/api`;
export const API_AUTH_URL = `${API_BASE}/api/auth`;

