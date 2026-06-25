import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ResetPasswordPage from "./ResetPasswordPage";

jest.mock("assets/images/background.png", () => "test-background.png", {
  virtual: true,
});

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { identifier: "test@gmail.com", otp: "123456" },
  }),
}));

describe("ResetPassword", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("hiển thị form reset password", () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Quên Mật khẩu?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mật khẩu mới")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nhập lại mật khẩu"),
    ).toBeInTheDocument();
  });

  test("hiển thị lỗi khi thiếu mật khẩu", () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Xác Nhận"));

    expect(screen.getByText("Vui lòng nhập mật khẩu mới")).toBeInTheDocument();
  });

  test("hiển thị lỗi khi mật khẩu không khớp", () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Mật khẩu mới"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập lại mật khẩu"), {
      target: { value: "654321" },
    });

    fireEvent.click(screen.getByText("Xác Nhận"));

    expect(screen.getByText("Mật khẩu không khớp")).toBeInTheDocument();
  });

  test("chuyển về login khi hợp lệ", () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Mật khẩu mới"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập lại mật khẩu"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Xác Nhận"));

    expect(window.alert).toHaveBeenCalledWith("Đổi mật khẩu thành công!");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
