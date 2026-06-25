# Activity: AI kiểm duyệt bài đăng (AutoApprove)

Mô tả: biểu đồ hoạt động (Activity Diagram) minh họa luồng kiểm duyệt bài đăng sử dụng AI (`AutoApproveService`).

```mermaid
flowchart TD
  A[Người dùng gửi bài / chỉnh sửa bài] --> B[PostService lưu bài trạng thái PENDING]
  B --> C[Khởi chạy AutoApproveService.autoReview(post, isUpdate)]
  C --> D{Kiểm tra text prompt}
  D --> E[Chuẩn bị prompt: tiêu đề, mô tả, địa chỉ]
  E --> F[Thêm ảnh: tải ảnh -> encode base64 -> đính kèm]
  F --> G[Gọi OpenRouter / Gemini (chat/completions)]
  G --> H{API trả về đáp án}
  H -->|"APPROVED"| I[Đặt trạng thái post = APPROVED]
  H -->|"REJECTED|<lý do>"| J[Đặt trạng thái post = REJECTED và lưu lý do tạm]
  I --> K{isUpdate?}
  K -->|false| L[Gửi email thông báo duyệt cho chủ bài]
  K -->|true| M[Không gửi email]
  J --> N{isUpdate?}
  N -->|false| O[Gửi email thông báo từ chối (đăng mới)]
  N -->|true| P[Gửi email thông báo bị ẩn do chỉnh sửa]
  L --> Q[Log kết quả & kết thúc]
  M --> Q
  O --> Q
  P --> Q

  %% Lưu ý:
  %% - Nếu gọi AI lỗi hoặc timeout -> fallback: giữ trạng thái PENDING và ghi log lỗi
  H --- R[AI lỗi/timeout] --> S[Giữ PENDING + ghi log]
```

## Ghi chú chi tiết

- `AutoApproveService` tạo một `textPrompt` chi tiết và đính kèm ảnh (nếu có) dưới dạng base64.
- Gọi HTTP POST tới `https://openrouter.ai/api/v1/chat/completions` với header `Authorization: Bearer ${openrouter.api.key}`.
- Kết quả AI phải trả đúng định dạng:
  - `APPROVED`
  - `REJECTED|<lý do tiếng Việt>`
- Hành vi sau khi nhận kết quả:
  - `APPROVED` → cập nhật `post.status = APPROVED`; gửi email nếu là bài mới.
  - `REJECTED` → cập nhật `post.status = REJECTED`; gửi email thông báo kèm lý do.
  - Lỗi gọi AI → giữ `PENDING`, ghi log, (tùy cấu hình có thể retry sau)

## Vị trí liên quan trong mã

- `AutoApproveService` : `src/main/java/com/truongvx64cntt/nhatrangstay/service/AutoApproveService.java`
- Gọi từ `PostService` sau khi lưu bài: `PostService.createPost(...)` / `PostService.updatePost(...)`

```
```
