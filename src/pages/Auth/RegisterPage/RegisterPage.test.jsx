import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import { useAuth } from "hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Mock dependencies
jest.mock("assets/images/logo.png", () => "test-logo.png");
jest.mock("react-toastify");
jest.mock("hooks/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Register Component", () => {
  let mockSignup;
  let mockNavigate;

  beforeEach(() => {
    mockSignup = jest.fn();
    mockNavigate = jest.fn();
    useAuth.mockReturnValue({
      signup: mockSignup,
      isLoading: false,
    });
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>,
    );
  };

  describe("Rendering", () => {
    test("hiển thị tất cả các trường form", () => {
      renderRegister();

      expect(screen.getByText("Đăng Ký Tài Khoản Mới")).toBeInTheDocument();
      expect(screen.getByText("Tên Tài Khoản")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Mật Khẩu")).toBeInTheDocument();
      expect(screen.getByText("Xác Nhận Mật Khẩu")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Nhập tên tài khoản"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Nhập địa chỉ email"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Nhập mật khẩu (tối thiểu 6 ký tự)"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Nhập lại mật khẩu"),
      ).toBeInTheDocument();
      expect(screen.getByText("Chấp Nhận Điều Khoản")).toBeInTheDocument();
      expect(screen.getByText("Tiếp Tục Đăng Nhập")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Đăng Ký" }),
      ).toBeInTheDocument();
    });

    test("hiển thị logo", () => {
      renderRegister();
      const logo = screen.getByAltText("Vuatrovn");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "test-logo.png");
    });
  });

  describe("Form Validation", () => {
    test("hiển thị lỗi khi submit form trống", async () => {
      renderRegister();

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Vui lòng nhập tên tài khoản"),
        ).toBeInTheDocument();
      });

      expect(screen.getByText("Vui lòng nhập email")).toBeInTheDocument();
      expect(screen.getByText("Vui lòng nhập mật khẩu")).toBeInTheDocument();
      expect(
        screen.getByText("Vui lòng xác nhận mật khẩu"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Bạn cần chấp nhận điều khoản"),
      ).toBeInTheDocument();
      expect(mockSignup).not.toHaveBeenCalled();
    });

    test("hiển thị lỗi khi username quá ngắn", async () => {
      renderRegister();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      fireEvent.change(usernameInput, { target: { value: "ab" } });

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Tên tài khoản phải có ít nhất 3 ký tự"),
        ).toBeInTheDocument();
      });
    });

    test("hiển thị lỗi khi email không hợp lệ", async () => {
      renderRegister();

      const emailInput = screen.getByPlaceholderText("Nhập địa chỉ email");
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
      });
    });

    test("hiển thị lỗi khi password quá ngắn", async () => {
      renderRegister();

      const passwordInput = screen.getByPlaceholderText(
        "Nhập mật khẩu (tối thiểu 6 ký tự)",
      );
      fireEvent.change(passwordInput, { target: { value: "12345" } });

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Mật khẩu phải có ít nhất 6 ký tự"),
        ).toBeInTheDocument();
      });
    });

    test("hiển thị lỗi khi password và confirmPassword không khớp", async () => {
      renderRegister();

      const passwordInput = screen.getByPlaceholderText(
        "Nhập mật khẩu (tối thiểu 6 ký tự)",
      );
      const confirmPasswordInput =
        screen.getByPlaceholderText("Nhập lại mật khẩu");

      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "different123" },
      });

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Mật khẩu không khớp")).toBeInTheDocument();
      });
    });

    test("xóa lỗi khi người dùng nhập lại", async () => {
      renderRegister();

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Vui lòng nhập tên tài khoản"),
        ).toBeInTheDocument();
      });

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      fireEvent.change(usernameInput, { target: { value: "newuser" } });

      await waitFor(() => {
        expect(
          screen.queryByText("Vui lòng nhập tên tài khoản"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Password Visibility Toggle", () => {
    test("toggle hiển thị/ẩn mật khẩu", () => {
      renderRegister();

      const passwordInput = screen.getByPlaceholderText(
        "Nhập mật khẩu (tối thiểu 6 ký tự)",
      );
      expect(passwordInput).toHaveAttribute("type", "password");

      const eyeButtons = screen.getAllByRole("button", { name: "" });
      const passwordToggle = eyeButtons[0];

      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute("type", "text");

      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("toggle hiển thị/ẩn xác nhận mật khẩu", () => {
      renderRegister();

      const confirmPasswordInput =
        screen.getByPlaceholderText("Nhập lại mật khẩu");
      expect(confirmPasswordInput).toHaveAttribute("type", "password");

      const eyeButtons = screen.getAllByRole("button", { name: "" });
      const confirmPasswordToggle = eyeButtons[1];

      fireEvent.click(confirmPasswordToggle);
      expect(confirmPasswordInput).toHaveAttribute("type", "text");

      fireEvent.click(confirmPasswordToggle);
      expect(confirmPasswordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Submission", () => {
    const fillValidForm = () => {
      fireEvent.change(screen.getByPlaceholderText("Nhập tên tài khoản"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Nhập địa chỉ email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Nhập mật khẩu (tối thiểu 6 ký tự)"),
        {
          target: { value: "password123" },
        },
      );
      fireEvent.change(screen.getByPlaceholderText("Nhập lại mật khẩu"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("checkbox"));
    };

    test("đăng ký thành công", async () => {
      mockSignup.mockResolvedValue({
        message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
        status: 200,
      });

      renderRegister();
      fillValidForm();

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123",
        });
      });

      expect(toast.success).toHaveBeenCalledWith(
        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
      );

      jest.advanceTimersByTime(2000);
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test("hiển thị lỗi khi email đã tồn tại", async () => {
      mockSignup.mockRejectedValue({
        response: {
          data: {
            message: "Email đã tồn tại",
            status: 400,
          },
        },
      });

      renderRegister();
      fillValidForm();

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Email đã tồn tại");
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("hiển thị lỗi mặc định khi không có message từ backend", async () => {
      mockSignup.mockRejectedValue({
        response: {},
      });

      renderRegister();
      fillValidForm();

      const submitButton = screen.getByRole("button", { name: "Đăng Ký" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Đăng ký thất bại. Vui lòng thử lại.",
        );
      });
    });
  });

  describe("Loading State", () => {
    test("disable form khi đang loading", () => {
      useAuth.mockReturnValue({
        signup: mockSignup,
        isLoading: true,
      });

      renderRegister();

      expect(screen.getByPlaceholderText("Nhập tên tài khoản")).toBeDisabled();
      expect(screen.getByPlaceholderText("Nhập địa chỉ email")).toBeDisabled();
      expect(
        screen.getByPlaceholderText("Nhập mật khẩu (tối thiểu 6 ký tự)"),
      ).toBeDisabled();
      expect(screen.getByPlaceholderText("Nhập lại mật khẩu")).toBeDisabled();
      expect(screen.getByRole("checkbox")).toBeDisabled();
      expect(
        screen.getByRole("button", { name: "Đang xử lý..." }),
      ).toBeDisabled();
    });

    test("hiển thị text 'Đang xử lý...' khi loading", () => {
      useAuth.mockReturnValue({
        signup: mockSignup,
        isLoading: true,
      });

      renderRegister();
      expect(screen.getByText("Đang xử lý...")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    test("chuyển đến trang login khi click 'Tiếp Tục Đăng Nhập'", () => {
      renderRegister();

      const loginLink = screen.getByText("Tiếp Tục Đăng Nhập");
      fireEvent.click(loginLink);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
