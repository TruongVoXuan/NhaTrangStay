import React, {useState, useEffect}from 'react';
import { NavLink } from 'react-router-dom';
import { getCurrentUser } from 'lib/auth';
import { authAPI } from 'lib/apiService';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    History,
    Settings,
    LogOut
} from 'lucide-react';
import ava from "assets/images/avatar1.png";
import './AdminSidebar.scss';


const AdminSidebar = ({ setShowLogout }) => {
    const [adminInfo, setAdminInfo] = useState(() => {
        const savedUser = getCurrentUser();
        return {
            fullName: savedUser?.fullName || savedUser?.name || "Admin",
            avatar: savedUser?.avatar || ava
        }
    })

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("authToken");

            if (!token || token ==="undefined" || token === "null") {
                return;
            }

            try {
                const response = await authAPI.getProfile();
                const userData = response.data;
                
                if (userData) {
                    setAdminInfo({
                        fullName: userData.fullName || userData.username || userData.name,
                        avatar: userData.avatar || ava
                    });
                }
            } catch (error) {
                console.error("Không thể cập nhật thông tin Admin:", error);
            }
        };

        fetchProfile();
    }, []);

    const mainMenus = [
        { path: "/admin/dashboard", icon: <LayoutDashboard size={24} />, label: "Bảng điều khiển" },
        { path: "/admin/users", icon: <Users size={24} />, label: "Người dùng" },
        { path: "/admin/pending-posts", icon: <ShieldCheck size={24} />, label: "Bài đăng chờ duyệt" },
  
    ];

    const systemMenus = [
        { path: "/admin/settings", icon: <Settings size={24} />, label: "Cài đặt" },
    ];

    const renderLinks = (items) => items.map((item) => (
        <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive}) => isActive ? "menu-item active" : "menu-item"}
        >
            <div className="icon-wrapper">
                {item.icon}
                {item.badge && <span className="badge">{item.badge}</span>}
            </div>
            <span>{item.label}</span>
        </NavLink>
    ));

    return (
        <>
            <aside className="admin-sidebar">
            <div className="sidebar-top">
                <p className="section-title">MENU</p>
                <nav className="menu-list">
                    {renderLinks(mainMenus)}
                </nav>

                <div className="separator" />

                <p className="section-title">HỆ THỐNG</p>
                <nav className="menu-list">
                    {renderLinks(systemMenus)}
                </nav>
            </div>

            <div className="sidebar-bottom">
                <div className="admin-profile">
                    <img 
    src={adminInfo.avatar}
    alt="Avatar"
    className="avatar"
/>
                    <div className="profile-info">
                        <p className="name">{adminInfo.fullName}</p>
                        <p className="role">Quản trị hệ thống</p>
                    </div>
                </div>

                <button className="logout-btn" onClick={() => setShowLogout(true)}>
                    <LogOut size={24} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
        </>
    );
};

export default AdminSidebar;