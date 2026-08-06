import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    role: u.role ? u.role.toLowerCase() : "attendee",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("eventify_token");
    const savedUser = localStorage.getItem("eventify_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(normalizeUser(JSON.parse(savedUser)));
      } catch {
        localStorage.removeItem("eventify_token");
        localStorage.removeItem("eventify_user");
        setLoading(false);
        return;
      }
      getCurrentUser()
        .then((u) => {
          if (u) {
            setUser(normalizeUser(u));
            localStorage.setItem("eventify_user", JSON.stringify(normalizeUser(u)));
          }
        })
        .catch(() => {
          localStorage.removeItem("eventify_token");
          localStorage.removeItem("eventify_user");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser(email, password);
    const normalized = normalizeUser(res.user);
    localStorage.setItem("eventify_token", res.token);
    localStorage.setItem("eventify_user", JSON.stringify(normalized));
    setToken(res.token);
    setUser(normalized);
    return res;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await registerUser(userData);
    const normalized = normalizeUser(res.user);
    localStorage.setItem("eventify_token", res.token);
    localStorage.setItem("eventify_user", JSON.stringify(normalized));
    setToken(res.token);
    setUser(normalized);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("eventify_token");
    localStorage.removeItem("eventify_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
