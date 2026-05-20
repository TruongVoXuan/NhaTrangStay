import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Hàm tiện ích: Giải mã JWT Token để lấy thông tin bên trong (không cần cài thêm thư viện)
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // 1. Lưu token (Lưu cả 2 tên cho chắc ăn giống y hệt F12 của team bạn)
      localStorage.setItem("authToken", token);
      localStorage.setItem("accessToken", token);

      // 2. Giải mã token để lấy thông tin user
      const decodedToken = parseJwt(token);

      if (decodedToken) {
        // Tạo object user giống form của team bạn (sub thường là nơi chứa email trong JWT)
        const userObj = {
          email: decodedToken.sub || "google-user@vuatro.com",
          role: decodedToken.role || "USER",
        };

        // 3. Nhét thông tin user vào kho
        localStorage.setItem("authUser", JSON.stringify(userObj));
      }

      toast.success("Đăng nhập Google thành công!", { containerId: "default" });

      // 4. Ép tải lại trang để React đọc đủ bộ 3 chìa khóa
      window.location.href = "/";
    } else {
      toast.error("Đăng nhập Google thất bại!", { containerId: "errors" });
      navigate("/login");
    }
  }, [navigate, location]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <h2>Đang xác thực tài khoản Google... ⏳</h2>
    </div>
  );
};

export default OAuth2RedirectHandler;
