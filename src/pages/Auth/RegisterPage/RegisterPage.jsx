import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {Users,
  LayoutDashboard,
  ShieldCheck, Eye, EyeOff } from "lucide-react";
import logo from "assets/images/backLogin.png";
import { useAuth } from "hooks/useAuth";
import "./RegisterPage.scss";

const Register = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleAcceptTerms = () => {
  setFormData((prev) => ({
    ...prev,
    acceptTerms: true,
  }));
  setShowTerms(false);
};
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

    if (!formData.username) {
      newErrors.username = "Vui lòng nhập tên tài khoản";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên tài khoản phải có ít nhất 3 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Bạn cần chấp nhận điều khoản";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        // Xử lý response thành công
        toast.success(
          response?.message ||
            "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
        );
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        // Xử lý error từ backend
        const errorMessage =
          error.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng thử lại.";

        // Hiển thị toast error
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
          {/* SIDEBAR giống Login */}
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
        <div className="auth-content">
          <h2 className="register-title">Đăng Ký Tài Khoản Mới</h2>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>
                Tên Tài Khoản <span className="required">*</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Nhập tên tài khoản"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "input-error" : ""}
                disabled={isLoading}
              />
              <div className="error-message-container">
                {errors.username && (
                  <span className="error-text">{errors.username}</span>
                )}
              </div>
            </div>

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
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="error-message-container">
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                Xác Nhận Mật Khẩu <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "input-error" : ""}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              <div className="error-message-container">
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="terms-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span>
                Chấp Nhận Điều Khoản
                <span
                className="terms-link"
                onClick={() => setShowTerms(true)}
                >
                (Xem Điều Khoản)
                </span>
                </span>
              </label>
              <span className="blue-link" onClick={() => navigate("/login")}>
                Tiếp Tục Đăng Nhập
              </span>
            </div>
            <div className="error-message-container checkbox-error">
              {errors.acceptTerms && (
                <span className="error-text">{errors.acceptTerms}</span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng Ký"}
            </button>
          </form>
        </div>
      </div>
      {showTerms && (
  <div className="terms-modal-overlay">
    <div className="terms-modal">
      <div className="terms-header">
        <h3>Điều Khoản Sử Dụng</h3>
        <button
          className="close-btn"
          onClick={() => setShowTerms(false)}
        >
          ✕
        </button>
      </div>

      <div className="terms-content">
  <h4>1. Thông tin tài khoản</h4>
  <p>
    Người dùng phải cung cấp thông tin chính xác khi đăng ký tài khoản.
    Không được sử dụng thông tin giả mạo hoặc của người khác.
    Mọi thông tin đăng ký cần được cập nhật khi có thay đổi.
    Hệ thống có quyền từ chối tài khoản có thông tin không hợp lệ.
  </p>

  <h4>2. Bảo mật tài khoản</h4>
  <p>
    Người dùng có trách nhiệm bảo mật mật khẩu và thông tin đăng nhập.
    Không chia sẻ tài khoản với người khác dưới bất kỳ hình thức nào.
    Nếu phát hiện truy cập trái phép, người dùng cần thông báo ngay cho hệ thống.
    Hệ thống không chịu trách nhiệm cho các thiệt hại do lộ thông tin đăng nhập.
  </p>

  <h4>3. Nội dung sử dụng</h4>
  <p>
    Người dùng không được đăng tải nội dung vi phạm pháp luật hoặc thuần phong mỹ tục.
    Không đăng nội dung xúc phạm, gây hiểu lầm hoặc lừa đảo người khác.
    Nội dung phải tuân thủ quy định của hệ thống và pháp luật hiện hành.
    Các nội dung vi phạm có thể bị xóa mà không cần thông báo trước.
  </p>

  <h4>4. Quyền của hệ thống</h4>
  <p>
    Hệ thống có quyền chỉnh sửa hoặc cập nhật điều khoản khi cần thiết.
    Các tài khoản vi phạm quy định có thể bị cảnh cáo hoặc khóa.
    Hệ thống có thể tạm ngưng dịch vụ để bảo trì hoặc nâng cấp.
    Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các điều khoản này.
  </p>
</div>

      <div className="terms-footer">
        <button
          className="accept-btn"
          onClick={handleAcceptTerms}
        >
          Đồng ý điều khoản
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Register;
