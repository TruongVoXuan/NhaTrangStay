# Sequence đăng bài

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant CreatePostPage as Trang đăng bài
    participant PostController as PostController
    participant PostService as PostService
    participant UserRepository as UserRepository
    participant TypeRepository as TypeRepository
    participant SupabaseStorageService as SupabaseStorageService
    participant PostRepository as PostRepository
    participant AutoApproveService as AutoApproveService
    participant DB as CSDL

    User->>CreatePostPage: 1. Nhập thông tin bài đăng
    CreatePostPage->>PostController: 2. Gửi yêu cầu tạo bài đăng
    PostController->>PostService: 3. Gọi createPost(request, email)
    PostService->>UserRepository: 4. Tìm user theo email
    UserRepository->>DB: 5. Truy vấn user
    DB-->>UserRepository: 6. Trả về user
    UserRepository-->>PostService: 7. Trả về user
    PostService->>TypeRepository: 8. Tìm room type theo id
    TypeRepository->>DB: 9. Truy vấn room type
    DB-->>TypeRepository: 10. Trả về loại phòng
    TypeRepository-->>PostService: 11. Trả về type
    loop Với từng ảnh người dùng upload
        PostService->>SupabaseStorageService: 12. Upload ảnh lên Supabase
        SupabaseStorageService-->>PostService: 13. Trả về URL ảnh
    end
    PostService->>PostRepository: 14. Lưu post mới với trạng thái PENDING
    PostRepository->>DB: 15. Lưu dữ liệu
    DB-->>PostRepository: 16. Lưu thành công
    PostRepository-->>PostService: 17. Trả về kết quả
    PostService->>AutoApproveService: 18. Gọi autoReview(post, false)
    AutoApproveService-->>PostService: 19. Hoàn tất kiểm duyệt
    PostService-->>PostController: 20. Trả về thông báo thành công
    PostController-->>CreatePostPage: 21. Hiển thị thông báo tạo bài đăng thành công
```

## Mô tả luồng

1. Người dùng đăng nhập và truy cập màn hình tạo bài đăng.
2. Người dùng nhập thông tin phòng, địa chỉ, mô tả, giá, diện tích, số phòng và upload ảnh.
3. `CreatePostPage` gửi dữ liệu tới `PostController`.
4. `PostController` gọi `PostService.createPost(request, email)`.
5. `PostService` lấy thông tin người dùng và loại phòng từ CSDL.
6. Mỗi ảnh được upload lên Supabase thông qua `SupabaseStorageService`.
7. Bài đăng được lưu với trạng thái `PENDING`.
8. Hệ thống tự động gọi `AutoApproveService` để kiểm duyệt bài đăng.
9. Kết quả được trả về cho giao diện để người dùng biết bài đăng đã được tạo.

## Ghi chú

- Bài đăng được lưu ở trạng thái `PENDING` trước khi được tự động duyệt.
- `AutoApproveService` sử dụng OpenRouter/Gemini để đánh giá nội dung và ảnh.
- Upload ảnh dùng `SupabaseStorageService` để lưu tài nguyên trực tuyến.
- Endpoint chính: `POST /api/posts/create`.
