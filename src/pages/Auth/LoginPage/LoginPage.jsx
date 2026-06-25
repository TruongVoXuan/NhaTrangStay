import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Users,
  LayoutDashboard,
  ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import logo from "assets/images/backLogin.png";
import googleLogo from "assets/icons/google-logo.png";
import { useAuth } from "hooks/useAuth";
import "./LoginPage.scss";
import {
  
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
  await login({
    email: formData.email,
    password: formData.password,
  });

  toast.success("Đăng nhập thành công!", {
    autoClose: false,
    closeButton: true,
  });

  const user = JSON.parse(localStorage.getItem("authUser"));
  const role = user?.role?.toUpperCase();

  if (role === "ADMIN") {
    navigate("/admin/dashboard");
  } else {
    navigate("/");
  }

} catch (error) {
  const errorMessage =
    error.response?.data?.message ||
    "Đăng nhập thất bại. Vui lòng thử lại.";

  toast.error(errorMessage, {
    autoClose: false,
    closeButton: true,
  });
}
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
      <div className="login-sidebar" style={{
  background: `url(${logo}) center/cover no-repeat`
}}>
  <div className="overlay" />

  <div className="sidebar-content">
    <h1>
      Host your home in <br />
      <span className="highlight">Nha Trang Stay</span>
    </h1>

    <p className="subtitle">
      Join thousands of homeowners earning extra income while sharing
      the beauty of the coast with global travelers.
    </p>

    <div className="features1">
      <div className="feature1-item">
        <Users className="icon" size={22} />
        <div>
          <h4>Reach more guests</h4>
          <p>Access our exclusive network...</p>
        </div>
      </div>

      <div className="feature1-item">
        <LayoutDashboard className="icon" size={22} />
        <div>
          <h4>Easy management</h4>
          <p>Our intuitive dashboard...</p>
        </div>
      </div>

      <div className="feature1-item">
        <ShieldCheck className="icon" size={22} />
        <div>
          <h4>Secure payments</h4>
          <p>Get paid directly and securely...</p>
        </div>
      </div>
    </div>

    <p className="footer-text">
      Trusted by over 500+ hosts in the city
    </p>
  </div>
</div>

        <div className="login-content">
          <h2 className="login-title">Welcome to, Host NHATRANGSTAY</h2>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                disabled={isLoading}
              />
              <div className="error-message-container">
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                Mật Khẩu <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật Khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="error-message-container">
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>
            </div>

            <div className="link-row">
              <span
                className="blue-link"
                onClick={() => navigate("/forgot-password")}
              >
                Quên Mật Khẩu?
              </span>
              <span className="blue-link" onClick={() => navigate("/register")}>
                Đăng Ký Tài Khoản
              </span>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>
          </form>

          <button
            className="google-login-btn"
            onClick={() =>
              (window.location.href =
                "http://localhost:8080/oauth2/authorization/google")
            }
            type="button"
          >
            <img src={googleLogo} alt="G" />
            <span>Đăng nhập bằng Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
