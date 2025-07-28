import { useEffect } from "react";
import { useNavigate,useLocation  } from "react-router-dom";

function OAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/",{ replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [location,navigate]);

  return <div>Logging you in...</div>;
}

export default OAuthRedirect;
