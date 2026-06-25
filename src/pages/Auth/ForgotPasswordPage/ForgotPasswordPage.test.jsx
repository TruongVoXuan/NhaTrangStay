import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPasswordPage from "./ForgotPasswordPage";

jest.mock("assets/images/background.png", () => "test-background.png", {
  virtual: true,
});

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ForgotPassword", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  test("hiển thị form quên mật khẩu", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Quên Mật Khẩu ?")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Vui Lòng Nhập Email Hoặc Số Điện Thoại"),
    ).toBeInTheDocument();
  });

  test("hiển thị lỗi khi submit rỗng", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Gửi Mã Xác Nhận"));

    expect(
      screen.getByText("Vui lòng nhập Email hoặc Số Điện Thoại"),
    ).toBeInTheDocument();
  });

  test("gọi console.log khi nhập email hợp lệ", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(
      screen.getByPlaceholderText("Vui Lòng Nhập Email Hoặc Số Điện Thoại"),
      { target: { value: "test@gmail.com" } },
    );

    fireEvent.click(screen.getByText("Gửi Mã Xác Nhận"));

    expect(console.log).toHaveBeenCalledWith(
      "Request reset password for:",
      "test@gmail.com",
    );
  });
});
