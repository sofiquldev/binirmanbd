'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const data = await authService.me();
          // Merge privileges and abilities into user object
          const userData = {
            ...data.user,
            privileges: data.privileges || [],
            abilities: data.abilities || [],
          };
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      // Merge privileges and abilities into user object
      const userData = {
        ...data.user,
        privileges: data.privileges || [],
        abilities: data.abilities || [],
      };
      setUser(userData);
      return data;
    } catch (error) {
      // Re-throw the error so the form can handle it
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

