import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiDark, CiLight } from "react-icons/ci"; 
import ModeContext from "../context/ModeContext"; // Default import
import ConfirmationModal from "./Confirmationmodal"; 
import EditProfileModal from "./EditProfileModal";
import "./Navbar.css";

export function Navbar() {
  const navigate = useNavigate();
  const ctx = useContext(ModeContext);

  // લોકલ સ્ટોરેજમાંથી ડેટા મેળવવો
  const storedData = localStorage.getItem("logindata");
  const LoggedInUserData = storedData ? JSON.parse(storedData) : {};

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("logindata");
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const userInitial = LoggedInUserData?.role?.charAt(0).toUpperCase() || "U";

  return (
    <>
      {/* ડાયનેમિક ક્લાસ: nav-dark અથવા nav-light */}
      <nav className={`nav ${ctx?.mode === "dark" ? "nav-dark" : "nav-light"}`}>
        <h3 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>BlogPost</h3>

        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Home
            </NavLink>
          </li>

          {LoggedInUserData?.role === "admin" && (
            <li>
              <NavLink to="/newpost" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Newpost
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/explore" className={({ isActive }) => (isActive ? "active-link" : "")}>
              ExplorePage
            </NavLink>
          </li>

          <li>
            <span onClick={() => setShowLogoutModal(true)} style={{ cursor: "pointer" }}>
              Logout
            </span>
          </li>
        </ul>

        <div className="nav-right-section">
          {/* ડાર્ક મોડ ટોગલ */}
          <div 
            className="mode-toggle" 
            onClick={() => ctx?.toggleMode()} 
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            {ctx?.mode === "dark" ? <CiLight size={24} /> : <CiDark size={24} />}
            <span>{ctx?.mode === "dark" ? "Light" : "Dark"}</span>
          </div>
          
          <div
            className="icon"
            onClick={() => setShowEditProfileModal(true)}
            style={{ cursor: "pointer" }}
          >
            {userInitial}
          </div>
        </div>
      </nav>

      {showLogoutModal && (
        <ConfirmationModal
          title="Logout?"
          desc="You are about to log out, are you sure?"
          onClose={() => setShowLogoutModal(false)}
          onConfirm={logoutHandler}
          confirmBtnText="Logout"
        />
      )}

      {showEditProfileModal && (
        <EditProfileModal
          userId={LoggedInUserData?.id} 
          onClose={() => setShowEditProfileModal(false)}
        />
      )}
    </>
  );
}

export default Navbar;