# Sequence xem chi tiết phòng

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant HomePage as Trang chủ / danh sách phòng
    participant PostController as PostController
    participant PostService as PostService
    participant PostRepository as PostRepository
    participant DB as CSDL

    User->>HomePage: 1. Mở chi tiết một phòng
    HomePage->>PostController: 2. Gửi yêu cầu lấy chi tiết phòng
    PostController->>PostService: 3. Gọi getPostDetail(id)
    PostService->>PostRepository: 4. Tìm bài đăng theo id
    PostRepository->>DB: 5. Truy vấn dữ liệu bài đăng
    DB-->>PostRepository: 6. Trả về bài đăng
    PostRepository-->>PostService: 7. Trả về kết quả
    PostService-->>PostController: 8. Trả về thông tin bài đăng
    PostController-->>HomePage: 9. Trả kết quả cho giao diện
    HomePage-->>User: 10. Hiển thị chi tiết phòng
```

## Mô tả luồng

1. Người dùng chọn một phòng từ danh sách hoặc trang chủ.
2. Frontend gọi API `GET /api/posts/{id}` thông qua `PostController`.
3. `PostController` chuyển yêu cầu đến `PostService`.
4. `PostService` dùng `PostRepository` truy vấn bài đăng theo `id`.
5. Dữ liệu được lấy từ CSDL và trả ngược về chuỗi xử lý.
6. Kết quả được trả về cho frontend và hiển thị chi tiết phòng cho người dùng.

## Ghi chú

- Luồng này phù hợp với cách hiện tại dự án NhaTrangStay hiển thị chi tiết phòng.
- Endpoint chính: `GET /api/posts/{id}`.
- Dữ liệu phòng được truy vấn trực tiếp từ bảng bài đăng trong CSDL.
