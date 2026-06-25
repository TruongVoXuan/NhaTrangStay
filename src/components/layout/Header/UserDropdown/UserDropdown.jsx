import React, { useEffect, useRef } from "react";
import "./UserDropdown.scss";
import {
  Heart,
  Globe,
  Home,
  UserCog,
  History,
  Bookmark,
  CircleFadingArrowUp,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, useRole } from "hooks/useAuth";

const UserDropdown = ({ setOpenDrop, setDropArrow }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { logout, isAuthenticated, user } = useAuth();
  const { isAdmin, isUser } = useRole();

  const handleClose = () => {
    setOpenDrop(false);
    setDropArrow(false);
  };

  // click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-user-main-container" ref={dropdownRef}>
      
      {/* ===== USER INFO ===== */}
      {isAuthenticated && (
        <div className="user-info">
          <div className="avatar">
  {user?.avatar ? (
    <img
      src={user.avatar}
      alt="avatar"
      className="avatar-img"
    />
  ) : (
    user?.username?.charAt(0).toUpperCase() || "U"
  )}
</div>
          <span className="username">
            {user?.username || "User"}
          </span>
        </div>
      )}

      {/* ===== MENU CHUNG ===== */}
     

      {/* ===== CHƯA LOGIN ===== */}
      {!isAuthenticated && (
        <div
          onClick={() => {
            handleClose();
            navigate("/login");
          }}
          className="option-dropdown-navbar"
        >
          <Home size={22} />
          <span className="content-option-dropdown">Sign in</span>
        </div>
      )}

      {/* ===== LOGIN USER ===== */}
      {isAuthenticated && isUser && (
        <>
          {/* THÔNG TIN CÁ NHÂN */}
          <div
            onClick={() => {
              handleClose();
              navigate("/user/profile");
            }}
            className="option-dropdown-navbar"
          >
            <UserCog size={22} />
            <span className="content-option-dropdown">
              Thông Tin Cá Nhân
            </span>
          </div>

         

          {/* YÊU THÍCH */}
          <div
  onClick={() => {
    handleClose();
    navigate("/user/favorites");
  }}
  className="option-dropdown-navbar"
>
  <Bookmark size={22} />
  <span className="content-option-dropdown">
    Bài Đăng Yêu Thích
  </span>
</div>

       
          {/* POST */}
          <div
            onClick={() => {
              handleClose();
              navigate("/post");
            }}
            className="option-dropdown-navbar post-now"
          >
            <Home size={22} />
            <span className="content-option-dropdown">
              POST NOW
            </span>
          </div>

          {/* LOGOUT */}
          <div
            onClick={() => {
              handleClose();
              logout();
            }}
            className="option-dropdown-navbar logout-btn"
          >
            <LogOut size={22} />
            <span className="content-option-dropdown">
              Logout
            </span>
          </div>
        </>
      )}

      {/* ===== LOGIN ADMIN ===== */}
      {isAuthenticated && isAdmin && (
        <>
          <div
            onClick={() => {
        handleClose();
        window.location.href = "http://localhost:3000/admin/dashboard";
      }}
            className="option-dropdown-navbar"
          >
            <span className="content-option-dropdown">
              Admin Panel
            </span>
          </div>

          <div
            onClick={() => {
              handleClose();
              logout();
            }}
            className="option-dropdown-navbar logout-btn"
          >
            <LogOut size={22} />
            <span className="content-option-dropdown">
              Logout
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;