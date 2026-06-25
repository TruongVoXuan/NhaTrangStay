# Chatbot AI Activity Diagram

Biểu đồ dưới đây mô tả luồng hoạt động của Chatbot AI trong NhaTrangStay, dựa theo `src/components/shared/User/common/ChatBot/ChatBot.jsx`.

```mermaid
flowchart TD
  A[Start] --> B[Người dùng mở Chatbot]
  B --> C[Người dùng nhập yêu cầu tìm kiếm bất động sản]
  C --> D[Người dùng nhấn Enter hoặc nút Gửi]
  D --> E[Hiển thị message user trong lịch sử chat]
  E --> F[Fetch danh sách posts hiện có từ backend]
  F --> G[Chuyển dữ liệu posts thành context văn bản cho AI]
  G --> H[Gọi OpenRouter API với model Claude Haiku 4.5]

  H --> I{OpenRouter trả về thành công?}
  I -->|Yes| J[Nhận phản hồi từ AI]
  I -->|No| K[Hiển thị lỗi AI: `err.message`. Vui lòng thử lại]

  J --> L[Phân tích phản hồi: tìm `SUGGEST_IDS` nếu có]
  L --> M[Làm sạch text trả về]
  M --> N[Hiển thị câu trả lời AI trên giao diện chat]

  N --> O{Có `suggestedIds` không?}
  O -->|Yes| P[Hiển thị danh sách gợi ý phòng dưới chat]
  O -->|No| Q[Chỉ hiển thị câu trả lời văn bản]

  P --> R[Người dùng có thể bấm chọn phòng gợi ý]
  Q --> R
  R --> S[End]

  click F href "src/components/shared/User/common/ChatBot/ChatBot.jsx" "Xem fetchPosts"
  click H href "src/components/shared/User/common/ChatBot/ChatBot.jsx" "Xem askAI/OpenRouter call"
```

## Ghi chú

- Chatbot lấy tối đa 50 bài đăng hiện có từ `GET /api/posts/search` để tạo ngữ cảnh cho AI.
- Text gửi tới OpenRouter bao gồm:
  - prompt hệ thống với hướng dẫn tư vấn phòng trọ NhaTrangStay
  - danh sách phòng hiện có dưới dạng text
  - lịch sử hội thoại gần nhất của người dùng
- Mô hình sử dụng là `anthropic/claude-haiku-4.5`.
- Nếu OpenRouter trả lỗi, chatbot hiển thị `err.message` trong khung chat và người dùng có thể thử lại.
- Nếu phản hồi chứa `SUGGEST_IDS`, chatbot sẽ hiển thị các bài đăng tương ứng dưới dạng thẻ nhỏ.
- Phản hồi AI được làm sạch trước khi hiển thị để loại bỏ dòng `SUGGEST_IDS`.
