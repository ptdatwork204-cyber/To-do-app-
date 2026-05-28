import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  //  LOAD USER
  const loadUser = async (jwt) => {
    const res = await axios.get("http://localhost:8080/api/user/me", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    setUser(res.data);
  };

  //  REFRESH USER (IMPORTANT ADDITION)
  const refreshUser = async () => {
    if (!token) return;
    await loadUser(token);
  };

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      email,
      password,
    });

    const jwt = res.data.token;

    localStorage.setItem("token", jwt);
    setToken(jwt);

    await loadUser(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) loadUser(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);