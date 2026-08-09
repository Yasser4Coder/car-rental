import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, userApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      applySession(data.user, data.token);
      return data.user;
    },
    [applySession],
  );

  const register = useCallback(
    async (payload) => {
      const data = await authApi.register(payload);
      applySession(data.user, data.token);
      return data.user;
    },
    [applySession],
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    userApi
      .getProfile()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
