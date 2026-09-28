import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("smartcampus_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("smartcampus_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("smartcampus_user");
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      
      let fullUser = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role || "STUDENT",
        token: response.token,
      };

      // If user is a student and has a valid ID, fetch their full profile details
      if (fullUser.role === "STUDENT" && fullUser.id) {
        try {
          const studentProfile = await api.getStudentById(fullUser.id);
          fullUser = { ...fullUser, ...studentProfile };
        } catch (profileErr) {
          console.warn("Could not fetch detailed student profile:", profileErr);
        }
      }

      setUser(fullUser);
      return fullUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (studentData) => {
    setLoading(true);
    try {
      const created = await api.register(studentData);
      // Auto login after registration
      return await login(studentData.email, studentData.password);
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("smartcampus_user");
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.role === "STUDENT" && user?.id) {
      try {
        const studentProfile = await api.getStudentById(user.id);
        setUser((prev) => ({ ...prev, ...studentProfile }));
      } catch (err) {
        console.error("Failed to refresh student profile:", err);
      }
    }
  }, [user?.role, user?.id]);

  const updateUserProfile = useCallback((updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
