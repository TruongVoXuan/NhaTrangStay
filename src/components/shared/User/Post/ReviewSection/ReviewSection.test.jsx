import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewSection from "./ReviewSection";
import { reviewAPI } from "lib/apiService";
import { toast } from "react-toastify";

// 1. MOCK CÁC THƯ VIỆN BẰNG JEST (Không cần import jest, vì nó là global)
jest.mock("lib/apiService", () => ({
  reviewAPI: {
    getReviewsByPost: jest.fn(),
    createReview: jest.fn(),
  },
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

describe("ReviewSection Component", () => {
  const mockPostId = 1;

  // Xóa rác sau mỗi lần test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. Hiển thị trạng thái đang tải ban đầu", () => {
    reviewAPI.getReviewsByPost.mockResolvedValueOnce({ data: [] });
    render(<ReviewSection postId={mockPostId} />);

    // Dùng Testing Library chuẩn chỉ, không querySelector
    expect(screen.getByText(/Đang tải đánh giá/i)).toBeInTheDocument();
  });

  test("2. Hiển thị thông báo khi chưa có đánh giá nào", async () => {
    reviewAPI.getReviewsByPost.mockResolvedValueOnce({ data: [] });
    render(<ReviewSection postId={mockPostId} />);

    await waitFor(() => {
      expect(screen.getByText(/Chưa có đánh giá nào/i)).toBeInTheDocument();
    });
  });

  test("3. Render danh sách đánh giá thành công", async () => {
    const mockReviews = [
      {
        id: 1,
        user: { username: "Khách Thuê 1", avatar: "" },
        rating: 5,
        content: "Phòng rất đẹp, chủ trọ thân thiện!",
        createdAt: "2026-03-30T10:00:00Z",
      },
    ];

    // Giả lập API trả về data
    reviewAPI.getReviewsByPost.mockResolvedValueOnce({
      data: { content: mockReviews },
    });

    render(<ReviewSection postId={mockPostId} />);

    // Đợi API load xong và kiểm tra từng nội dung khác nhau riêng lẻ
    await waitFor(() => {
      expect(
        screen.getByText("Phòng rất đẹp, chủ trọ thân thiện!"),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Khách Thuê 1")).toBeInTheDocument();
  });

  test("4. Báo lỗi (warning) khi gửi bình luận trống", async () => {
    reviewAPI.getReviewsByPost.mockResolvedValueOnce({ data: [] });
    render(<ReviewSection postId={mockPostId} />);

    // Tìm nút Gửi bằng Role và bấm
    const submitBtn = screen.getByRole("button", { name: /Gửi/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        "Vui lòng nhập nội dung đánh giá!",
      );
    });
    expect(reviewAPI.createReview).not.toHaveBeenCalled();
  });

  test("5. Cho phép người dùng nhập và gửi đánh giá thành công", async () => {
    reviewAPI.getReviewsByPost.mockResolvedValueOnce({ data: [] });
    reviewAPI.createReview.mockResolvedValueOnce({}); // Giả lập POST thành công

    render(<ReviewSection postId={mockPostId} />);

    // Chọn rating 5 sao bằng Testing Library API
    const fifthStar = screen.getByRole("button", { name: /5 sao/i });
    fireEvent.click(fifthStar);

    // Tìm ô nhập liệu bằng Placeholder
    const textarea = screen.getByPlaceholderText(
      /Chia sẻ trải nghiệm của bạn/i,
    );

    // Gõ chữ vào ô input
    fireEvent.change(textarea, {
      target: { value: "Phòng thoáng mát, an ninh tốt!" },
    });

    // Bấm nút Gửi
    const submitBtn = screen.getByRole("button", { name: /Gửi/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Kiểm tra xem payload bắn xuống Backend có chuẩn không
      expect(reviewAPI.createReview).toHaveBeenCalledWith({
        postId: mockPostId,
        rating: 5,
        content: "Phòng thoáng mát, an ninh tốt!",
      });
    });
    expect(toast.success).toHaveBeenCalledWith("Gửi đánh giá thành công!");
  });
});
