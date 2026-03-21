import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Menu, X } from "lucide-react";
import "./Header.css";

export const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <Link to="/" className="logo">
            <span className="logo-text">DAIS</span>
            <span className="logo-sub">Digital Asset Inheritance</span>
          </Link>
        </div>

        <div className="header-right">
          {user && (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {(user.firstName || user.name)?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <div className="user-name">{user.firstName || user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
