import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import { useState } from "react";
import LogoutModal from "components/layout/Header/UserDropdown/LogoutModal";

function UserLayout() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="user-layout" style={{ position: "relative" }}>
      {showLogout && <LogoutModal setShowLogout={setShowLogout}/>}

      <main className="content-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default UserLayout;
