# Admin User Management Activity Diagram

Biểu đồ dưới đây mô tả luồng quản lý người dùng của Admin trong NhaTrangStay, dựa theo `src/pages/Admin/AdminUser/AdminUsers.jsx`.

```mermaid
flowchart TD
  A[Start] --> B[Admin truy cập trang Quản lý Người dùng]
  B --> C[Load danh sách tất cả users từ backend<br/>GET /api/users]
  C --> D{Load thành công?}
  D -->|Yes| E[Hiển thị danh sách users trong bảng]
  D -->|No| F[Hiển thị lỗi load users]

  E --> G[Admin nhập từ khóa tìm kiếm]
  G --> H{Có nhập từ khóa?}
  H -->|Yes| I[Lọc users cục bộ theo<br/>tên, email, số điện thoại]
  H -->|No| J[Hiển thị toàn bộ users]

  I --> K[Hiển thị kết quả lọc]
  J --> K

  K --> L{Admin chọn hành động}
  
  L -->|Xem Bài viết| M[Admin nhấn nút Eye<br/>cho một user]
  L -->|Khóa/Mở khóa| N[Admin nhấn nút Lock<br/>cho một user]
  L -->|Xóa| O[Admin nhấn nút Delete<br/>cho một user]

  M --> P[Fetch bài viết của user<br/>GET /api/users/:id/posts]
  P --> Q{Load thành công?}
  Q -->|Yes| R[Lưu user và danh sách posts vào state]
  Q -->|No| S[Hiển thị lỗi load posts]
  R --> T[Điều hướng tới trang<br/>chi tiết bài viết của user]
  S --> K

  N --> U{User status là ACTIVE?}
  U -->|Yes| V[Gọi API khóa user<br/>POST /api/users/:id/lock]
  U -->|No| W[Gọi API mở khóa user<br/>POST /api/users/:id/unlock]
  
  V --> X{Khóa thành công?}
  W --> X
  X -->|Yes| Y[Cập nhật status = BANNED hoặc ACTIVE]
  X -->|No| Z[Hiển thị lỗi lock/unlock]
  Y --> K
  Z --> K

  O --> AA[Hiển thị dialog xác nhận xóa user]
  AA --> AB{Admin xác nhận?}
  AB -->|Có| AC[Gọi API xóa user<br/>DELETE /api/users/:id]
  AB -->|Không| K

  AC --> AD{Xóa thành công?}
  AD -->|Yes| AE[Refresh danh sách users]
  AD -->|No| AF[Hiển thị lỗi xóa]
  AE --> AG[Hiển thị thông báo thành công]
  AF --> K
  AG --> K

  T --> A
```

## Ghi chú

- **Load danh sách users**: Admin mở trang, hệ thống gọi `userAPI.getAll()` để lấy toàn bộ user từ backend.
- **Tìm kiếm cục bộ**: Không gọi API mỗi khi nhập, chỉ lọc dữ liệu đã load trên client theo:
  - Full Name
  - Username
  - Email
  - Số điện thoại
- **Xem Bài viết**: Admin nhấn nút Eye, hệ thống gọi `userAPI.getPostsByUser(user.id)` để lấy bài viết của user đó, sau đó điều hướng tới trang chi tiết.
- **Khóa / Mở khóa User**: 
  - Nếu user status = `ACTIVE` → gọi `userAPI.lockUser(user.id)` → status thành `BANNED`
  - Nếu user status = `BANNED` → gọi `userAPI.unlockUser(user.id)` → status thành `ACTIVE`
  - Cập nhật ngay trên UI sau khi thành công
- **Xóa User**:
  - Hiển thị dialog xác nhận
  - Nếu chọn Xóa → gọi `userAPI.deleteUser(id)` → refresh danh sách → hiển thị thông báo thành công
  - Nếu chọn Hủy → quay lại danh sách
- **Trạng thái hiển thị**:
  - `ACTIVE` = "Available" (xanh)
  - `BANNED` = "Unavailable" (đỏ)
