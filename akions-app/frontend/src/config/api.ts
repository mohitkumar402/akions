// API Configuration – uses env for production, localhost for development.
// For Expo web, EXPO_PUBLIC_API_URL is set at build time.

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL?: string;
    }
  }
}

const getApiBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return 'https://akions.onrender.com';
  }
  return 'https://akions.onrender.com';
};

export const API_BASE = getApiBaseUrl();
export const API_URL = `${API_BASE}/api`;
export const API_AUTH_URL = `${API_BASE}/api/auth`;
