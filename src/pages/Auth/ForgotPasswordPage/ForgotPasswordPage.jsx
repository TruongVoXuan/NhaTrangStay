import background from "assets/images/Background.png";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Key, ArrowLeft, Loader } from "lucide-react";
import "./ForgotPasswordPage.scss";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Vui lòng nhập Email hoặc Số Điện Thoại");
      return;
    }

    console.log("Request reset password for:", identifier);
    setIsSubmitted(true);
    setCountdown(60);
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
              <label>Email / Số Điện Thoại</label>
              <input
                type="text"
                placeholder="Vui Lòng Nhập Email Hoặc Số Điện Thoại"
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

            <div className="loading-text-wrapper">
              <span className="loading-text">LOADING...</span>
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
