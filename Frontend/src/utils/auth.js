// src/utils/auth.js
export const getUserRole = () => localStorage.getItem("userRole"); // "admin" | "user" | null
export const isAdmin = () => getUserRole() === "admin";
export const isUser = () => getUserRole() === "user";
