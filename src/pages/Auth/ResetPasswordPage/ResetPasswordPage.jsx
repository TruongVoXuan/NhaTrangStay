import background  from "assets/images/backLogin.png";
import React, { useState, useEffect  } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import { Key, Eye, EyeOff } from "lucide-react";
import "./ResetPasswordPage.scss";
import { toast } from "react-toastify";
import { api } from "../../../lib/api";


// Preload ảnh nền để không bị chớp trắng
const preloadImage = new Image();
preloadImage.src = background;

const ResetPasswordPage = () => {

  
const [searchParams] = useSearchParams();

const resetToken = searchParams.get("resetToken");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
  const verifyToken = async () => {
    try {
      await api.get(
        `/api/auth/verify-resettoken-mail?resetToken=${resetToken}`
      );
    } catch (err) {
      toast.error("Token không hợp lệ hoặc đã hết hạn");
      navigate("/forgot-password");
    }
  };

  if (resetToken) {
    verifyToken();
  }
}, [resetToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!formData.password) {
    newErrors.password = "Vui lòng nhập mật khẩu mới";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Mật khẩu không khớp";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      await api.post("/api/auth/change-password", {
        resetToken,
        newPassword: formData.password,
        comfirmPassword: formData.confirmPassword,
      });

      toast.success("Đổi mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data ||
        "Đổi mật khẩu thất bại"
      );
    }
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
