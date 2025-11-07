import React, { createContext, useState, useEffect } from "react";
import { setAuthToken, apiClient } from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post("/api/auth/login", { email, password });
      const { token: tk, user: u } = res.data;
      setToken(tk);
      setUser(u);
      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || err.message };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const res = await apiClient.post("/api/auth/register", { name, email, password });
      const { token: tk, user: u } = res.data;
      setToken(tk);
      setUser(u);
      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateProfile = (partial) => {
    const updated = { ...user, ...partial };
    setUser(updated);
    // optionally call API to persist changes
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
