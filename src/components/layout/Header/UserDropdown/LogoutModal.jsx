import React from "react";
import "./LogoutModal.scss";
import { LogOut } from "lucide-react";
import { clearAuth } from "lib/auth";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ setShowLogout }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: "#00000080",
        position: "fixed",
        zIndex: "1009",
        height: "100%",
        width: "100%",
        display: "grid",
      }}
    >
      <div
        className="modal-animation"
        style={{
          placeSelf: "center",
          width: "480px",
          height: "275px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFC3C9",
              width: "auto",
              padding: "15px 17px",
              borderRadius: "50%",
            }}
          >
            <LogOut color="#8C161F" />
          </div>
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            Xác nhận đăng xuất
          </div>
          <div style={{ textAlign: "center", padding: "0 55px" }}>
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không? Các phiên làm
            việc hiện tại sẽ bị kết thúc.
          </div>
        </div>
        <hr style={{ border: "1px solid #00000040", marginTop: "15px" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flex: "1",
          }}
        >
          <div>
            <button
              className="button-logout"
              onClick={() => setShowLogout(false)}
              style={{
                color: "#636363",
                backgroundColor: "#F0F0F0",
                border: "1px solid #D2D2D2",
                height: "42px",
                width: "160px",
                borderRadius: "6px",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              Hủy
            </button>
          </div>

          <div>
            <button
              onClick={() => {
  clearAuth();
  setShowLogout(false);
  navigate("/login");
}}
              className="button-logout"
              style={{
                color: "#FFFFFF",
                backgroundColor: "#BB2A33",
                border: "1px solid #FF99A1",
                height: "42px",
                width: "160px",
                borderRadius: "6px",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LogoutModal;
