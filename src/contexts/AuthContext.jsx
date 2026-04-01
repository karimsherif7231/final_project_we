import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ts_session');
    return saved ? JSON.parse(saved) : null;
  });

  const API = '/api';

  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.ok) {
      setUser(data.user);
      localStorage.setItem('ts_session', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.ok) {
      setUser(data.user);
      localStorage.setItem('ts_session', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ts_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
