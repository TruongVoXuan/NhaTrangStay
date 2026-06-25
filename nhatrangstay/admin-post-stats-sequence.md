# Sequence xem thống kê bài đăng bên ADMIN

```mermaid
sequenceDiagram
    participant Admin as Admin
    participant AdminPage as Trang thống kê admin
    participant AdminUserController as AdminUserController
    participant PostService as PostService
    participant PostRepository as PostRepository
    participant DB as CSDL

    Admin->>AdminPage: 1. Mở trang thống kê bài đăng
    AdminPage->>AdminUserController: 2. Gửi yêu cầu lấy thống kê
    AdminUserController->>PostService: 3. Gọi getApprovedPostStats()
    PostService->>PostRepository: 4. Truy vấn thống kê bài đăng đã duyệt
    PostRepository->>DB: 5. Lấy dữ liệu bài đăng theo trạng thái
    DB-->>PostRepository: 6. Trả về dữ liệu
    PostRepository-->>PostService: 7. Trả về kết quả
    PostService-->>AdminUserController: 8. Trả về thống kê
    AdminUserController-->>AdminPage: 9. Hiển thị báo cáo

    AdminPage->>AdminUserController: 10. Gửi yêu cầu danh sách bài đăng gần đây
    AdminUserController->>PostService: 11. Gọi getRecentApprovedPosts()
    PostService->>PostRepository: 12. Truy vấn bài đăng đã duyệt gần đây
    PostRepository->>DB: 13. Lấy dữ liệu
    DB-->>PostRepository: 14. Trả về dữ liệu
    PostRepository-->>PostService: 15. Trả về kết quả
    PostService-->>AdminUserController: 16. Trả về danh sách
    AdminUserController-->>AdminPage: 17. Hiển thị bài đăng gần đây

    AdminPage->>AdminUserController: 18. Gửi yêu cầu thống kê theo tháng
    AdminUserController->>PostService: 19. Gọi getPostsByMonth(month, year)
    PostService->>PostRepository: 20. Truy vấn bài đăng theo tháng/năm
    PostRepository->>DB: 21. Lấy dữ liệu
    DB-->>PostRepository: 22. Trả về dữ liệu
    PostRepository-->>PostService: 23. Trả về kết quả
    PostService-->>AdminUserController: 24. Trả về thống kê theo tháng
    AdminUserController-->>AdminPage: 25. Hiển thị biểu đồ / bảng
```

## Mô tả luồng

### 1. Xem thống kê tổng quan
1. Admin truy cập trang thống kê bài đăng.
2. Frontend gọi `GET /api/users/posts/stats`.
3. `AdminUserController` gọi `PostService.getApprovedPostStats()`.
4. `PostService` truy vấn dữ liệu từ `PostRepository`.
5. Kết quả thống kê được trả về cho giao diện.

### 2. Xem bài đăng gần đây đã duyệt
1. Admin mở phần bài đăng gần đây.
2. Frontend gọi `GET /api/users/posts/recent-approved`.
3. `AdminUserController` gọi `PostService.getRecentApprovedPosts()`.
4. Dữ liệu được truy vấn và hiển thị.

### 3. Xem thống kê theo tháng
1. Admin chọn tháng/năm cần xem.
2. Frontend gọi `GET /api/users/posts/by-month?month=&year=`.
3. `AdminUserController` gọi `PostService.getPostsByMonth(month, year)`.
4. Dữ liệu được trả về và hiển thị trên biểu đồ hoặc bảng.

## Ghi chú

- Các endpoint chính:
  - `GET /api/users/posts/stats`
  - `GET /api/users/posts/recent-approved`
  - `GET /api/users/posts/by-month`
- `PostService` là nơi tổng hợp dữ liệu thống kê cho admin.
- Các thống kê này bám sát các API hiện có trong `AdminUserController`.
