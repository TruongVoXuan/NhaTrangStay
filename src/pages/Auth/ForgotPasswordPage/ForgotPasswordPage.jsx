import background  from "assets/images/backLogin.png";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Key, ArrowLeft, Loader } from "lucide-react";
import "./ForgotPasswordPage.scss";
import { api } from "../../../lib/api";
// Tải trước ảnh (vẫn giữ nguyên để tối ưu)
const preloadImage = new Image();
preloadImage.src = background;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleChange = (e) => {
    setIdentifier(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!identifier.trim()) {
    setError("Vui lòng nhập Email đã đăng ký");
    return;
  }

  try {
    const response = await api.post("/api/auth/forgot-password", {
      email: identifier,
    });

    console.log(response.data);

    setIsSubmitted(true);
    setCountdown(60);
  } catch (error) {
    console.error(error);

    setError(
      error.response?.data?.message ||
      error.response?.data ||
      "Không thể gửi email xác nhận"
    );
  }
};

  useEffect(() => {
    let timer;
    if (isSubmitted && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitted, countdown]);

  const handleResend = () => {
    if (countdown === 0) {
      console.log("Đang gửi lại mã xác nhận cho:", identifier);
      setCountdown(60);
    }
  };

  return (
    // Đã xóa style={{ backgroundImage: ... }}
    <div className="forgot-page">
      {/* Thẻ img đóng vai trò làm background */}
      <img src={background} alt="Background" className="bg-image" />

      <div className="forgot-card">
        <div className="icon-badge">
          <Key size={32} color="#000" strokeWidth={2.5} />
        </div>

        {isSubmitted && (
          <div
            className="back-btn"
            onClick={() => {
              setIsSubmitted(false);
              setCountdown(60);
            }}
          >
            <ArrowLeft size={16} strokeWidth={3} /> Quay Lại
          </div>
        )}

        <h2 className="forgot-title">Quên Mật Khẩu ?</h2>

        {!isSubmitted ? (
          <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nhập Email đã đăng ký</label>
              <input
                type="text"
                placeholder="Vui Lòng Nhập Email Đã Đăng Ký"
                value={identifier}
                onChange={handleChange}
                className={error ? "input-error" : ""}
              />
              <div className="error-message-container">
                {error && <span className="error-text">{error}</span>}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Gửi Mã Xác Nhận
              <span className="btn-icon">&#9658;</span>
            </button>

            <div className="back-to-login">
              <span onClick={() => navigate("/login")}>Quay lại Đăng nhập</span>
            </div>
          </form>
        ) : (
          <div className="loading-container">
            <div className="spinner-wrapper">
              <Loader size={64} color="#aaa" className="spinner-icon" />
            </div>

            <div className="success-container">
  <h3>Đã gửi email xác nhận</h3>
  <p>
    Vui lòng kiểm tra email để tiếp tục đặt lại mật khẩu.
  </p>
</div>

            <div
              className={`resend-text ${countdown === 0 ? "active" : ""}`}
              onClick={handleResend}
            >
              {countdown > 0
                ? `Gửi lại mã sau ${countdown}s`
                : "Gửi Lại Mã Xác Nhận"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
