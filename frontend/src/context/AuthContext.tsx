import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { User } from "../types";
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
}
// FIX: Export AuthContext to resolve import error in hooks/useAuth.ts
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const verifyUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // The interceptor will add the token
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    verifyUser();
  }, [verifyUser]);
  const login = async (credentials: any) => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    navigate("/");
  };
  const signup = async (userData: any) => {
    const { data } = await api.post("/auth/signup", userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    navigate("/");
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };
  const value = { user, isAuthenticated, isLoading, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
