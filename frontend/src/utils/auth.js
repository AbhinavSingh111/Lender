import { jwtDecode } from "jwt-decode";

export function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);  // updated here
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (e) {
    console.error("Token validation error:", e);
    return false;
  }
}

export const isLoggedIn = () => {
  return isTokenValid(localStorage.getItem("token"));
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};



export const getLoginMethod = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.auth_provider || "unknown";
  } catch {
    return "unknown";
  }
}
