import "./AdminLayout.scss";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/layout/AdminHeader/AdminHeader";
import AdminSidebar from "../components/layout/AdminSidebar/AdminSidebar";
import { useState } from "react";
import LogoutModal from "components/layout/Header/UserDropdown/LogoutModal";

function AdminLayout() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="admin-layout">
      {showLogout && <LogoutModal setShowLogout={setShowLogout}/>}
      <AdminHeader />
      <div className="layout-body"> 
        <AdminSidebar setShowLogout={setShowLogout} />
        
        <main className="content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;