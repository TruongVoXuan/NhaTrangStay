import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const handleSuccessLogin = (token) => {
    console.log("✅ Google login successful, token:", token.substring(0, 20) + "...");

    // Lưu token vào localStorage (giống Normal Login)
    localStorage.setItem("authToken", token);
    
    // Decode token để lấy user info (nếu cần)
    try {
      // Parse JWT token để lấy email
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      // Lưu user info (giống Normal Login)
      const userInfo = {
        email: payload.sub || payload.email, // JWT thường có 'sub' hoặc 'email'
        provider: "GOOGLE"
      };
      localStorage.setItem("authUser", JSON.stringify(userInfo));
      
      console.log("📧 User email:", userInfo.email);
    } catch (error) {
      console.warn("⚠️ Could not parse token payload:", error);
      // Fallback: lưu user info cơ bản
      localStorage.setItem("authUser", JSON.stringify({ provider: "GOOGLE" }));
    }

    // Hiển thị thông báo thành công
    toast.success("Đăng nhập Google thành công!", {
      autoClose: 2000,
    });

    // Redirect về trang chủ
    setTimeout(() => {
      navigate("/");
    }, 500);
  };    const handleGoogleCallback = async () => {
      try {
        // Log để debug
        console.log("🔍 Google Callback URL:", window.location.href);
        console.log("🔍 Search params:", location.search);
        console.log("🔍 Hash:", location.hash);

        // Trường hợp 1: Token trong query params (?token=xxx)
        const urlParams = new URLSearchParams(location.search);
        let token = urlParams.get("token");

        if (token) {
          console.log("✅ Found token in query params");
          handleSuccessLogin(token);
          return;
        }

        // Trường hợp 2: Token trong hash (#token=xxx)
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          token = hashParams.get("token");
          if (token) {
            console.log("✅ Found token in hash");
            handleSuccessLogin(token);
            return;
          }
        }

        // Trường hợp 3: Backend trả JSON response trong body
        // Đọc từ document body nếu có
        const bodyText = document.body.textContent || document.body.innerText;
        console.log("🔍 Body text:", bodyText);

        try {
          const jsonMatch = bodyText.match(/\{.*"token".*\}/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0]);
            if (jsonData.token) {
              console.log("✅ Found token in response body");
              handleSuccessLogin(jsonData.token);
              return;
            }
          }
        } catch (parseError) {
          console.log("⚠️ Could not parse JSON from body");
        }

        // Trường hợp 4: Nếu có code và state, redirect lại backend để lấy token
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        
        if (code && state) {
          console.log("� Found OAuth code, exchanging for token...");
          
          // Gọi backend API để đổi code lấy token
          const response = await fetch(
            `http://localhost:8080/login/oauth2/code/google?code=${code}&state=${state}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.token) {
              console.log("✅ Got token from backend");
              handleSuccessLogin(data.token);
              return;
            }
          }
        }

        throw new Error("Token not found in any location");
      } catch (error) {
        console.error("❌ Google login error:", error);
        toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.", {
          autoClose: 3000,
        });
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [navigate, location]);

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Đang xử lý đăng nhập Google...</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #0063B8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#333",
  },
};

// Add CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default GoogleCallback;
