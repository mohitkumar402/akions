import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const API_BASE = 'http://localhost:3000/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  accessToken: string | null;
  refreshToken: string | null;
  applyForInternship: (internshipId: string) => Promise<void>;
  myApplications: string[];
  reloadApplications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [myApplications, setMyApplications] = useState<string[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedAccess = await AsyncStorage.getItem('accessToken');
      const storedRefresh = await AsyncStorage.getItem('refreshToken');
      if (storedAccess) setAccessToken(storedAccess);
      if (storedRefresh) setRefreshToken(storedRefresh);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
      } else if (storedAccess) {
        await fetchMe(storedAccess);
        setIsLoading(false);
      } else {
        // No stored user or token - user is not logged in, allow public access
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Failed to load user:', e);
      setIsLoading(false);
    }
  };

  const fetchMe = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const enriched: User = { ...data, avatar: data.avatar || 'https://via.placeholder.com/100' };
        setUser(enriched);
        await AsyncStorage.setItem('user', JSON.stringify(enriched));
      } else if (res.status === 401 && refreshToken) {
        await attemptRefresh();
      }
    } catch (e) {
      console.error('Failed to fetch current user:', e);
    }
  };

  const attemptRefresh = async () => {
    if (!refreshToken) return;
    try {
      const res = await fetch(`${API_BASE}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        await AsyncStorage.setItem('accessToken', data.accessToken);
        if (data.accessToken) await fetchMe(data.accessToken);
      } else {
        await logout();
      }
    } catch (e) {
      console.error('Token refresh failed:', e);
      await logout();
    }
  };

  const reloadApplications = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`http://localhost:3000/api/internships/applications/mine`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyApplications(data.map((a: any) => a.internshipId));
      }
    } catch (e) {
      console.error('Failed loading applications', e);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }
      const data = await res.json();
      const user: User = { ...data.user, avatar: data.user.avatar || 'https://via.placeholder.com/100' };
      setUser(user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['accessToken', data.accessToken],
        ['refreshToken', data.refreshToken]
      ]);
      await reloadApplications();
    } catch (e: any) {
      console.error('Login error:', e);
      throw e;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Admin login failed');
      }
      const data = await res.json();
      // Verify that the user is actually an admin
      if (data.user.role !== 'admin') {
        throw new Error('Access denied. This login is for administrators only.');
      }
      const user: User = { ...data.user, avatar: data.user.avatar || 'https://via.placeholder.com/100' };
      setUser(user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['accessToken', data.accessToken],
        ['refreshToken', data.refreshToken]
      ]);
      // Don't reload applications for admin login
    } catch (e: any) {
      console.error('Admin login error:', e);
      throw e;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Signup failed');
      }
      const data = await res.json();
      const user: User = { ...data.user, avatar: data.user.avatar || 'https://via.placeholder.com/100' };
      setUser(user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['accessToken', data.accessToken],
        ['refreshToken', data.refreshToken]
      ]);
      setMyApplications([]);
    } catch (e: any) {
      console.error('Signup error:', e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setMyApplications([]);
    }
  };

  const applyForInternship = async (internshipId: string) => {
    if (!accessToken) throw new Error('Not authenticated');
    try {
      const res = await fetch('http://localhost:3000/api/internships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ internshipId })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to apply');
      }
      await reloadApplications();
    } catch (e) {
      console.error('Apply internship error:', e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, adminLogin, signup, logout, accessToken, refreshToken, applyForInternship, myApplications, reloadApplications }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
