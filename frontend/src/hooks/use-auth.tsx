"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  LoginPayload,
  ChangePasswordPayload,
  loginApi,
  logoutApi,
  getMeApi,
  changePasswordApi,
  updateMeApi,
} from "../services/api/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  updateUser: (payload: Partial<User>) => Promise<User>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const userData = await getMeApi();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginPayload) => {
    setLoading(true);
    try {
      const res = await loginApi(credentials);
      if (res.user) {
        setUser(res.user);
      } else {
        await refreshUser();
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutApi();
    } catch {
      // Ignore errors on logout
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const changePassword = async (payload: ChangePasswordPayload) => {
    await changePasswordApi(payload);
  };

  const updateUser = async (payload: Partial<User>) => {
    const updated = await updateMeApi(payload);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        changePassword,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
