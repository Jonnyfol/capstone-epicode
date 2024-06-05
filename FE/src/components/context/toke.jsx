import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [authorId, setAuthorId] = useState(localStorage.getItem("_id") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");

  const isAuthenticated = !!token;

  useEffect(() => {
    localStorage.setItem("token", token);
    //chiamata api /me
    //set author con il valore /me
    //set username con il valore /me
    //set avatar con il valore /me
  }, [token]);

  useEffect(() => {
    localStorage.setItem("_id", authorId);
  }, [authorId]);

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("avatar", avatar);
  }, [avatar]);

  const value = {
    token,
    setToken,
    authorId,
    setAuthorId,
    username,
    setUsername,
    avatar,
    setAvatar,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
