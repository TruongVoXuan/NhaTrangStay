import React, { useEffect, useState } from "react";
import logo from "assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import "./Header.scss";
import {
  Heart,
  LogIn,
  ChevronUp,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";
import UserDropdown from "components/layout/Header/UserDropdown/UserDropdown";
import { decodeBase64 } from "utils/decodeBase64";  

const Header = ({ setShowLogout }) => {
  const [openDrop, setOpenDrop] = useState(false);
  const isLogin = !!localStorage.getItem("authToken");
  const [dropArrow, setDropArrow] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const data = JSON.parse(jsonPayload);
      setUserName(data.username);
    } catch (error) {
      console.error("Decode token error:", error);
    }
  }, []);



  return (
    <div className="main-container">
      <div className="header-left">
        <div className="logo-box" onClick={() => navigate("/user/home")}>
          <img className="logo-img" src={logo} alt="logo" />
        </div>

        <div className="search-container">
          <div className="search-box">
            <span className="menu-item">Apartment</span>
            <span className="menu-item">Houses</span>
            <span className="menu-item">Support</span>
            <span className="menu-item">Messages</span>
          </div>
        
        </div>
      </div>

      <div className="infor-container">
  <span className="host-text">Host with us</span>

  <div
    className="menu-icon"
    onClick={() => {
      setOpenDrop(!openDrop);
    }}
  >
    <div
  className="menu-icon"
  onClick={() => setOpenDrop(!openDrop)}
>
  <Menu size={22} />
</div>
  </div>

  {openDrop && (
    <UserDropdown
      setOpenDrop={setOpenDrop}
      setShowLogout={setShowLogout}
      setDropArrow={setDropArrow}
    />
  )}
</div>
    </div>
  );
};

export default Header;