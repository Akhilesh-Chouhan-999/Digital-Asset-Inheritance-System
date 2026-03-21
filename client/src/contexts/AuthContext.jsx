import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const userWithName = {
          ...userData,
          name: userData.name || `${userData.firstName} ${userData.lastName}`.trim(),
        };
        setUser(userWithName);
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authService.register({ name, email, password });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      const { token, user: userData } = response.data.data;
      const userWithName = {
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`.trim(),
      };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithName));
      setUser(userWithName);
      return userWithName;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await authService.forgotPassword(email);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to send reset email";
      setError(message);
      throw err;
    }
  };

  const resetPassword = async (token, password, confirmPassword) => {
    try {
      setError(null);
      await authService.resetPassword(token, password, confirmPassword);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset password";
      setError(message);
      throw err;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
