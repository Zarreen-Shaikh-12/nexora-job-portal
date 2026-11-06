import { createContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import { setUnauthorizedHandler } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until the first /me check finishes

  // Restore the session on page load/refresh
  useEffect(() => {
    let active = true;
    authService
      .getMe()
      .then((res) => active && setUser(res.data.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Expired session: the Axios interceptor calls this
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (credentials) => {
    await authService.loginUser(credentials);
    const res = await authService.getMe(); // full user object, same shape everywhere
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    await authService.registerUser(data);
    const res = await authService.getMe();
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      setUser(null); // clear local state even if the request fails
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
