import background from "assets/images/Background.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, Eye, EyeOff } from "lucide-react";
import "./ResetPasswordPage.scss";
import { toast } from "react-toastify";
// Preload ảnh nền để không bị chớp trắng
const preloadImage = new Image();
preloadImage.src = background;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu mới";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận lại mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Password reset successfully with:", formData.password);
      // Gọi API đổi mật khẩu ở đây...

      // Chuyển hướng về trang đăng nhập sau khi thành công
      toast.success("Đổi mật khẩu thành công!");
      navigate("/login");
    }
  };

  return (
    <div
      className="reset-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="reset-card">
        {/* Vòng tròn khóa */}
        <div className="icon-badge">
          <Key size={32} color="#000" strokeWidth={2.5} />
        </div>

        <h2 className="reset-title">Quên Mật khẩu?</h2>

        <form className="reset-form" onSubmit={handleSubmit}>
          {/* Mật khẩu mới */}
          <div className="form-group">
            <label>Nhập mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu mới"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
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

          {/* Nhập lại mật khẩu */}
          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="error-message-container">
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Xác Nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
