import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    if(localStorage.getItem("authToken")){
      setAuth(localStorage.getItem("authToken"))
      setUser(JSON.parse(localStorage.getItem("user")))
    }
  },[])

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/api/login", { email, password });
      const { token, user } = response.data;
      setAuth(token);
      setUser(user);
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user }; // Return the response data
    } catch (error) {
      throw error.response?.data || "An error occurred during login";
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axiosInstance.post("/api/register", {
        name,
        email,
        password,
      });
      return response.data.message || "Registration successful";
    } catch (error) {
      throw error.response?.data || "An error occurred during registration";
    }
  };


  const logout = () => {
    setAuth(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
