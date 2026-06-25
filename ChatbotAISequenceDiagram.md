# Chatbot AI Sequence Diagram

File này mô tả trình tự các bước trong luồng tư vấn Chatbot AI của NhaTrangStay. Nội dung dựa theo `src/components/shared/User/common/ChatBot/ChatBot.jsx`.

```mermaid
sequenceDiagram
  participant User as Người dùng
  participant UI as Giao diện Chatbot
  participant Browser as Trình duyệt
  participant API as OpenRouter Claude Haiku 4.5
  participant Backend as Backend NhaTrangStay

  User->>UI: Mở widget Chatbot
  UI->>Browser: Fetch danh sách posts hiện có
  Browser->>Backend: GET /api/posts/search?page=0&size=50&sort=id,desc
  Backend-->>Browser: Trả về posts list
  Browser-->>UI: Cập nhật state posts

  User->>UI: Nhập yêu cầu tìm kiếm BĐS
  User->>UI: Nhấn Enter/Gửi
  UI-->>UI: Thêm message user vào lịch sử chat
  UI->>Browser: Chuẩn bị prompt system + postsContext + messages
  Browser->>API: POST /api/v1/chat/completions
  Note right of API: Model chính: anthropic/claude-haiku-4.5

  alt OpenRouter thành công
    API-->>Browser: Trả về content AI
    Browser-->>UI: Phân tích text, trích `SUGGEST_IDS`
    UI-->>UI: Loại bỏ dòng `SUGGEST_IDS` khỏi nội dung hiển thị
    UI-->>User: Hiển thị câu trả lời AI
    alt Có phòng gợi ý
      UI-->>User: Hiển thị danh sách bài đăng gợi ý dưới chat
    else Không có gợi ý cụ thể
      UI-->>User: Chỉ hiển thị câu trả lời văn bản
    end
  else OpenRouter lỗi / timeout
    API-->>Browser: Trả về lỗi
    Browser-->>UI: Hiển thị thông báo lỗi `err.message`
    UI-->>User: Yêu cầu thử lại
  end

  User->>UI: Có thể bấm chọn phòng gợi ý để xem chi tiết
  UI->>Browser: Điều hướng tới trang chi tiết bài đăng
```

## Ghi chú

- Trình tự này phản ánh hành vi trực tiếp của client React: Chatbot gọi OpenRouter ngay từ trình duyệt.
- `postsContext` được tạo từ dữ liệu bài đăng hiện có để giúp AI đối sánh ngữ nghĩa với yêu cầu của người dùng.
- Dòng `SUGGEST_IDS` là cơ chế nội bộ để ánh xạ gợi ý phòng từ phản hồi AI về các thẻ bài đăng hiển thị.
- Nếu OpenRouter gặp lỗi, chatbot không tự động retry mà hiển thị lỗi cho người dùng và cho phép họ gửi lại.
