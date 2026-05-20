import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import LoginPage from "./LoginPage";
import { useAuth } from "hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Mock dependencies
jest.mock("assets/images/logo.png", () => "test-logo.png");
jest.mock("assets/icons/google-logo.png", () => "test-google.png");
jest.mock("react-toastify");
jest.mock("hooks/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  let mockLogin;
  let mockNavigate;

  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation((...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("React Router Future Flag Warning")
      )
        return;
      console.warn(...args);
    });
  });

  afterAll(() => {
    console.warn.mockRestore();
  });

  beforeEach(() => {
    mockLogin = jest.fn();
    mockNavigate = jest.fn();
    useAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  describe("Form Submission", () => {
    const fillValidForm = () => {
      fireEvent.change(screen.getByPlaceholderText("Nhập địa chỉ email"), {
        target: { value: "test1@123.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Mật Khẩu"), {
        target: { value: "123456" },
      });
    };

    test("đăng nhập thành công và chuyển hướng đến /user/home", async () => {
      mockLogin.mockResolvedValue({
        email: "test1@123.com",
        role: "USER",
      });

      renderLogin();
      fillValidForm();

      const submitButton = screen.getByRole("button", { name: "Đăng Nhập" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: "test1@123.com",
          password: "123456",
        });
      });

      expect(toast.success).toHaveBeenCalledWith("Đăng nhập thành công!", expect.any(Object));
      
      // SỬA TẠI ĐÂY: Trong LoginPage bạn navigate đến /user/home chứ không phải /
      expect(mockNavigate).toHaveBeenCalledWith("/user/home");
    });
  });

  describe("Password Visibility Toggle", () => {
    test("toggle hiển thị/ẩn mật khẩu", () => {
      renderLogin();

      const passwordInput = screen.getByPlaceholderText("Mật Khẩu");
      expect(passwordInput).toHaveAttribute("type", "password");

      // SỬA TẠI ĐÂY: Vì button không có text, ta nên tìm theo class hoặc cấu trúc
      const eyeButton = screen.getByRole("button", { name: "" });
      // Nếu vẫn fail, hãy thêm aria-label="toggle password" vào component LoginPage và dùng nó ở đây

      fireEvent.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      fireEvent.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  // ... Các test case khác giữ nguyên vì đã ổn
});
