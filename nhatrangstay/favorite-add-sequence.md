# Sequence thêm bài đăng yêu thích

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant FavoritePage as Trang yêu thích
    participant FavoriteController as FavoriteController
    participant FavoriteService as FavoriteService
    participant FavoriteRepository as FavoriteRepository
    participant PostRepository as PostRepository
    participant UserRepository as UserRepository
    participant DB as CSDL

    User->>FavoritePage: 1. Nhấn "Yêu thích" trên một bài đăng
    FavoritePage->>FavoriteController: 2. Gửi yêu cầu thêm vào yêu thích
    FavoriteController->>FavoriteService: 3. Gọi addFavorite(postId, email)
    FavoriteService->>UserRepository: 4. Tìm user theo email
    UserRepository->>DB: 5. Truy vấn user
    DB-->>UserRepository: 6. Trả về user
    UserRepository-->>FavoriteService: 7. Trả về user
    FavoriteService->>PostRepository: 8. Tìm post theo id
    PostRepository->>DB: 9. Truy vấn post
    DB-->>PostRepository: 10. Trả về post
    PostRepository-->>FavoriteService: 11. Trả về post
    FavoriteService->>FavoriteRepository: 12. Kiểm tra đã tồn tại yêu thích chưa
    FavoriteRepository->>DB: 13. Truy vấn favorite
    DB-->>FavoriteRepository: 14. Trả về trạng thái
    alt Chưa tồn tại
        FavoriteService->>FavoriteRepository: 15. Lưu favorite mới
        FavoriteRepository->>DB: 16. Lưu dữ liệu
        DB-->>FavoriteRepository: 17. Lưu thành công
        FavoriteRepository-->>FavoriteService: 18. Trả về kết quả
        FavoriteService-->>FavoriteController: 19. Trả về thành công
        FavoriteController-->>FavoritePage: 20. Cập nhật trạng thái yêu thích
    else Đã tồn tại
        FavoriteService-->>FavoriteController: 21. Trả về thông báo đã yêu thích
        FavoriteController-->>FavoritePage: 22. Giữ trạng thái không đổi
    end
```

## Mô tả luồng

1. Người dùng nhấn nút yêu thích trên một bài đăng.
2. Frontend gửi yêu cầu đến `FavoriteController`.
3. `FavoriteController` gọi `FavoriteService.addFavorite(postId, email)`.
4. `FavoriteService` lấy thông tin người dùng từ `UserRepository`.
5. `FavoriteService` lấy thông tin bài đăng từ `PostRepository`.
6. `FavoriteRepository` kiểm tra xem bài đăng này đã được yêu thích bởi người dùng hay chưa.
7. Nếu chưa tồn tại, hệ thống tạo bản ghi yêu thích mới trong CSDL.
8. Frontend cập nhật lại trạng thái yêu thích trên UI.

## Ghi chú

- Endpoint chính của chức năng: `POST /api/favorites/like/{postId}`.
- `FavoriteService` là nơi xử lý nghiệp vụ kiểm tra và lưu yêu thích.
- `FavoriteRepository` đảm nhiệm thao tác dữ liệu với bảng yêu thích.
