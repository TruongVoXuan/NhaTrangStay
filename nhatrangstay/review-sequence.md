# Sequence đánh giá bài đăng

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant ReviewPage as Trang đánh giá
    participant ReviewController as ReviewController
    participant ReviewService as ReviewService
    participant ReviewRepository as ReviewRepository
    participant PostRepository as PostRepository
    participant DB as CSDL

    User->>ReviewPage: 1. Mở đánh giá cho một bài đăng
    ReviewPage->>ReviewController: 2. Gửi yêu cầu lấy đánh giá
    ReviewController->>ReviewService: 3. Gọi getReviewsByPostId(postId)
    ReviewService->>ReviewRepository: 4. Truy vấn review theo postId
    ReviewRepository->>DB: 5. Lấy dữ liệu đánh giá
    DB-->>ReviewRepository: 6. Trả về danh sách đánh giá
    ReviewRepository-->>ReviewService: 7. Trả về kết quả
    ReviewService-->>ReviewController: 8. Trả về danh sách đánh giá
    ReviewController-->>ReviewPage: 9. Hiển thị đánh giá

    User->>ReviewPage: 10. Nhập đánh giá mới
    ReviewPage->>ReviewController: 11. Gửi yêu cầu tạo đánh giá
    ReviewController->>ReviewService: 12. Gọi createReview(request)
    ReviewService->>PostRepository: 13. Kiểm tra bài đăng tồn tại
    PostRepository->>DB: 14. Truy vấn post
    DB-->>PostRepository: 15. Trả về bài đăng
    ReviewService->>ReviewRepository: 16. Lưu đánh giá mới
    ReviewRepository->>DB: 17. Lưu dữ liệu
    DB-->>ReviewRepository: 18. Lưu thành công
    ReviewRepository-->>ReviewService: 19. Trả về kết quả
    ReviewService-->>ReviewController: 20. Trả về thông báo thành công
    ReviewController-->>ReviewPage: 21. Cập nhật giao diện

    User->>ReviewPage: 22. Chọn sửa đánh giá
    ReviewPage->>ReviewController: 23. Gửi yêu cầu cập nhật
    ReviewController->>ReviewService: 24. Gọi updateReview(reviewId, request)
    ReviewService->>ReviewRepository: 25. Tìm đánh giá theo id
    ReviewRepository->>DB: 26. Truy vấn đánh giá
    DB-->>ReviewRepository: 27. Trả về đánh giá
    ReviewService->>ReviewRepository: 28. Cập nhật dữ liệu
    ReviewRepository->>DB: 29. Lưu thay đổi
    DB-->>ReviewRepository: 30. Cập nhật thành công
    ReviewRepository-->>ReviewService: 31. Trả về kết quả
    ReviewService-->>ReviewController: 32. Trả về thông báo cập nhật
    ReviewController-->>ReviewPage: 33. Cập nhật giao diện

    User->>ReviewPage: 34. Chọn xóa đánh giá
    ReviewPage->>ReviewController: 35. Gửi yêu cầu xóa
    ReviewController->>ReviewService: 36. Gọi deleteReview(reviewId)
    ReviewService->>ReviewRepository: 37. Xóa đánh giá
    ReviewRepository->>DB: 38. Xóa dữ liệu
    DB-->>ReviewRepository: 39. Xóa thành công
    ReviewRepository-->>ReviewService: 40. Trả về kết quả
    ReviewService-->>ReviewController: 41. Trả về thông báo
    ReviewController-->>ReviewPage: 42. Cập nhật giao diện
```

## Mô tả luồng

### 1. Xem đánh giá bài đăng
1. Người dùng mở trang chi tiết phòng.
2. Frontend gọi `GET /api/reviews/post/{postId}`.
3. `ReviewController` gọi `ReviewService` để lấy danh sách đánh giá.
4. `ReviewRepository` truy vấn dữ liệu từ CSDL.
5. Danh sách đánh giá được trả về và hiển thị.

### 2. Tạo đánh giá
1. Người dùng nhập nội dung đánh giá và gửi.
2. Frontend gọi API tạo đánh giá.
3. `ReviewService` kiểm tra bài đăng tồn tại.
4. Thông tin đánh giá được lưu vào CSDL.
5. Giao diện cập nhật lại danh sách đánh giá.

### 3. Sửa đánh giá
1. Người dùng chọn một đánh giá và chỉnh sửa.
2. Frontend gửi yêu cầu cập nhật.
3. `ReviewService` tìm đánh giá theo `reviewId`.
4. Dữ liệu được cập nhật trong CSDL.
5. Giao diện phản ánh thay đổi mới.

### 4. Xóa đánh giá
1. Người dùng chọn xóa đánh giá.
2. Frontend gửi yêu cầu xóa.
3. `ReviewService` gọi `ReviewRepository` để xóa.
4. Dữ liệu bị xóa khỏi CSDL.
5. Giao diện cập nhật lại.

## Ghi chú

- Các endpoint chính:
  - `GET /api/reviews/post/{postId}`
  - `POST /api/reviews/create`
  - `PUT /api/reviews/edit/{reviewId}`
  - `DELETE /api/reviews/delete/{reviewId}`
- `ReviewService` là trung tâm xử lý nghiệp vụ đánh giá.
- `ReviewRepository` chịu trách nhiệm thao tác dữ liệu với CSDL.
