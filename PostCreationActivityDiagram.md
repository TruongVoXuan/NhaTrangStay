# Post Creation Activity Diagram

Biểu đồ dưới đây mô tả luồng đăng bài bất động sản trong NhaTrangStay, bao gồm quy trình kiểm duyệt tự động bằng AI Gemini 2.5 Flash, dựa theo `InforBase.jsx`.

```mermaid
flowchart TD
  A[Start] --> B[Chủ nhà truy cập trang Đăng Tin]
  B --> C[Nhập thông tin bài đăng]
  
  subgraph Input Data
    D1[Tiêu đề bài đăng]
    D2[Mô tả chi tiết]
    D3[Địa chỉ cụ thể]
    D4[Giá thuê]
    D5[Diện tích]
    D6[Loại hình bất động sản]
  end
  
  C --> D1
  C --> D2
  C --> D3
  C --> D4
  C --> D5
  C --> D6
  
  D1 --> E[Upload hình ảnh bất động sản]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  D6 --> E
  
  E --> F{Kiểm tra hình ảnh?}
  F -->|Loại tệp không phải ảnh| G[Hiển thị cảnh báo]
  F -->|Ảnh vượt quá 1MB| H[Hiển thị cảnh báo]
  F -->|Vượt quá 6 ảnh| I[Hiển thị cảnh báo]
  G --> J[Yêu cầu chỉnh sửa]
  H --> J
  I --> J
  F -->|Hợp lệ| K[Chủ nhà nhấn Đăng Bài]
  
  J --> E
  
  K --> L[Tạo FormData: text + images]
  L --> M[Gửi POST /api/posts/create<br/>đến Backend]
  
  M --> N[Backend gửi dữ liệu tới<br/>AI Gemini 2.5 Flash]
  N --> O{AI kiểm duyệt nội dung}
  
  subgraph AI Review
    O1[Kiểm tra text spam/lừa đảo]
    O2[Kiểm tra hình ảnh phù hợp]
    O3[Kiểm tra thông tin đầy đủ]
  end
  
  O -->|Content vi phạm| P[AI trả về lỗi + chi tiết vi phạm]
  O -->|Ảnh không phù hợp| Q[AI trả về lỗi ảnh]
  O -->|Hợp lệ| R[AI trả về approved]
  
  P --> S[Backend trả về lỗi cho Frontend]
  Q --> S
  R --> T[Backend lưu bài đăng vào DB]
  
  S --> U[Hiển thị thông báo lỗi<br/>+ yêu cầu chỉnh sửa]
  T --> V[Đặt trạng thái = PENDING<br/>chờ Admin duyệt]
  V --> W[Hiển thị: Đăng bài thành công!<br/>Chờ Admin phê duyệt]
  
  U --> X[Reset form]
  X --> Y[Yêu cầu chủ nhà<br/>chỉnh sửa và đăng lại]
  Y --> E
  
  W --> Z[End - Bài đăng trong hàng chờ]

  click M href "src/components/shared/User/Post/InforBase/InforBase.jsx" "Xem form đăng bài"
  click N href "https://ai.google.dev/gemini-2-5/" "Xem Gemini 2.5 Flash"
``` 

## Ghi chú

- **Input validation frontend**: Kiểm tra loại tệp (phải là ảnh) và kích thước (max 1MB), tối đa 6 ảnh.
- **AI Review backend**: Sau khi nhận dữ liệu, backend gửi text + hình ảnh tới Gemini 2.5 Flash để:
  - Phát hiện spam, lừa đảo, nội dung không phù hợp trong text.
  - Kiểm tra hình ảnh có chứa nội dung vi phạm (ảnh đen, ảnh không rõ, ảnh người khác, v.v.).
  - Xác nhận đầy đủ thông tin bắt buộc.
  
- **Nếu AI phê duyệt**: Bài đăng được lưu vào DB với trạng thái `PENDING`, chờ Admin kiểm tra và phê duyệt lần cuối.
- **Nếu AI từ chối**: Backend trả về mã lỗi và chi tiết, Frontend hiển thị thông báo cho phép chủ nhà chỉnh sửa và đăng lại.
- Mỗi bài đăng được tạo bằng `FormData` để hỗ trợ upload file nhị phân (multipart/form-data).
