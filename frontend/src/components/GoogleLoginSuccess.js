import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function GoogleLoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse token from URL query string
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Save token in localStorage or wherever you store your JWT
      localStorage.setItem("token", token);

      // Optionally, fetch user info or set app state here

      // Redirect to dashboard or home page
      navigate("/", { replace: true });
    } else {
      // If no token, redirect to login or home
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  return <div>Logging you in...</div>;
}

export default GoogleLoginSuccess;
