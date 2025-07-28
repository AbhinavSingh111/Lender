import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import BorrowerList from "./components/BorrowerList";
import BorrowerDetail from "./components/BorrowerDetail";
import LendingForm from "./components/LendingForm";
import RepaymentForm from "./components/RepaymentForm";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import LandingPage from "./components/LandingPage";
import { isTokenValid, logout } from './utils/auth';
import OAuthRedirect from "./components/OAuthRedirect";
import GoogleLoginSuccess from "./components/GoogleLoginSuccess";


function AppWrapper() {
  const navigate = useNavigate();
  return <App navigate={navigate} />;
}

function App({ navigate }) {
  const token = localStorage.getItem("token");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = isTokenValid(token);
  
  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode");
    if (storedMode === "dark") setDarkMode(true);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <nav className="navbar">
            <div className="nav-left">
              <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                &#9776;
              </button>
              <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                <Link to="/" onClick={() => setMenuOpen(false)}>Borrowers</Link>
                <Link to="/add-lending" onClick={() => setMenuOpen(false)}>Lend</Link>
                <Link to="/add-repayment" onClick={() => setMenuOpen(false)}>Receive</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="logout-btn"
              aria-label="Logout"
            >
              Logout
            </button>
          </nav>

          <Routes>
            <Route path="/" element={<BorrowerList />} />
            <Route path="/borrower/:id" element={<BorrowerDetail />} />
            <Route path="/add-lending" element={<LendingForm />} />
            <Route path="/add-repayment" element={<RepaymentForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage darkMode={darkMode} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/google/callback" element={<OAuthRedirect />} />
          <Route path="/google-login-success" element={<GoogleLoginSuccess />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fafdff;
          border-bottom: 1px solid #eee;
          padding: 12px 24px;
          font-weight: 700;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-links {
          display: flex;
          gap: 24px;
        }
        .nav-links a {
          color: #d97742;
          text-decoration: none;
          font-weight: 700;
          transition: color 0.3s;
        }
        .nav-links a:hover {
          color: #b85c2e;
        }
        .logout-btn {
          background-color: #d97742;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .logout-btn:hover {
          background-color: #b85c2e;
        }
        .menu-toggle {
          display: none;
          font-size: 28px;
          background: none;
          border: none;
          cursor: pointer;
          color: #d97742;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .nav-links {
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background: #fafdff;
            flex-direction: column;
            gap: 16px;
            padding: 16px 0;
            border-bottom: 1px solid #eee;
            display: none;
          }
          .nav-links.open {
            display: flex;
          }
          .menu-toggle {
            display: block;
          }
        }
      `}</style>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
