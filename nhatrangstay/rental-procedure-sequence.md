# Sequence đặt lịch xem phòng

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant RentalPage as Trang đặt lịch xem phòng
    participant RentalProcedureController as RentalProcedureController
    participant RentalRegistrationService as RentalRegistrationService
    participant PostRepository as PostRepository
    participant UserRepository as UserRepository
    participant RentalRegistrationRepository as RentalRegistrationRepository
    participant DB as CSDL

    User->>RentalPage: 1. Chọn bài đăng và gửi yêu cầu xem phòng
    RentalPage->>RentalProcedureController: 2. Gửi yêu cầu đăng ký xem phòng
    RentalProcedureController->>RentalRegistrationService: 3. Gọi registerView(postId, email)
    RentalRegistrationService->>PostRepository: 4. Tìm bài đăng theo id
    PostRepository->>DB: 5. Truy vấn post
    DB-->>PostRepository: 6. Trả về post
    PostRepository-->>RentalRegistrationService: 7. Trả về post
    RentalRegistrationService->>UserRepository: 8. Tìm user theo email
    UserRepository->>DB: 9. Truy vấn user
    DB-->>UserRepository: 10. Trả về user
    UserRepository-->>RentalRegistrationService: 11. Trả về user
    RentalRegistrationService->>RentalRegistrationRepository: 12. Lưu đăng ký xem phòng
    RentalRegistrationRepository->>DB: 13. Lưu dữ liệu
    DB-->>RentalRegistrationRepository: 14. Lưu thành công
    RentalRegistrationRepository-->>RentalRegistrationService: 15. Trả về kết quả
    RentalRegistrationService-->>RentalProcedureController: 16. Trả về đăng ký thành công
    RentalProcedureController-->>RentalPage: 17. Hiển thị thông báo thành công

    User->>RentalPage: 18. Mở danh sách lịch xem phòng của mình
    RentalPage->>RentalProcedureController: 19. Gửi yêu cầu lấy danh sách của tôi
    RentalProcedureController->>RentalRegistrationService: 20. Gọi getMyRequests(email)
    RentalRegistrationService->>RentalRegistrationRepository: 21. Truy vấn đăng ký theo user
    RentalRegistrationRepository->>DB: 22. Lấy danh sách
    DB-->>RentalRegistrationRepository: 23. Trả về dữ liệu
    RentalRegistrationRepository-->>RentalRegistrationService: 24. Trả về kết quả
    RentalRegistrationService-->>RentalProcedureController: 25. Trả về danh sách
    RentalProcedureController-->>RentalPage: 26. Hiển thị lịch xem phòng

    User->>RentalPage: 27. Chủ nhà mở danh sách yêu cầu của chủ sở hữu
    RentalPage->>RentalProcedureController: 28. Gửi yêu cầu lấy owner requests
    RentalProcedureController->>RentalRegistrationService: 29. Gọi getOwnerRequests(email)
    RentalRegistrationService->>RentalRegistrationRepository: 30. Truy vấn đăng ký theo owner
    RentalRegistrationRepository->>DB: 31. Lấy danh sách
    DB-->>RentalRegistrationRepository: 32. Trả về dữ liệu
    RentalRegistrationRepository-->>RentalRegistrationService: 33. Trả về kết quả
    RentalRegistrationService-->>RentalProcedureController: 34. Trả về danh sách
    RentalProcedureController-->>RentalPage: 35. Hiển thị danh sách yêu cầu

    User->>RentalPage: 36. Chủ nhà chấp nhận / từ chối yêu cầu
    RentalPage->>RentalProcedureController: 37. Gửi yêu cầu approve/reject/cancel
    RentalProcedureController->>RentalRegistrationService: 38. Gọi approve/reject/cancel
    RentalRegistrationService->>RentalRegistrationRepository: 39. Cập nhật trạng thái
    RentalRegistrationRepository->>DB: 40. Lưu thay đổi
    DB-->>RentalRegistrationRepository: 41. Cập nhật thành công
    RentalRegistrationRepository-->>RentalRegistrationService: 42. Trả về kết quả
    RentalRegistrationService-->>RentalProcedureController: 43. Trả về thông báo
    RentalProcedureController-->>RentalPage: 44. Hiển thị trạng thái mới
```

## Mô tả luồng

### 1. Đăng ký xem phòng
1. Người dùng chọn một bài đăng và nhấn yêu cầu xem phòng.
2. Frontend gọi `POST /api/rental-procedures/register-view/{postId}`.
3. `RentalProcedureController` chuyển yêu cầu sang `RentalRegistrationService`.
4. `RentalRegistrationService` kiểm tra bài đăng và người dùng tồn tại.
5. Hệ thống lưu đăng ký xem phòng vào CSDL.
6. Giao diện hiển thị thông báo đăng ký thành công.

### 2. Xem danh sách lịch của tôi
1. Người dùng mở trang cá nhân hoặc lịch đã đặt.
2. Frontend gọi `GET /api/rental-procedures/my-requests`.
3. `RentalProcedureController` lấy dữ liệu từ `RentalRegistrationService`.
4. Dữ liệu được trả về và hiển thị cho người dùng.

### 3. Xem yêu cầu của chủ nhà
1. Chủ nhà truy cập danh sách yêu cầu xem phòng.
2. Frontend gọi `GET /api/rental-procedures/owner-requests`.
3. `RentalRegistrationService` truy vấn các yêu cầu thuộc bài đăng của chủ nhà.
4. Danh sách hiển thị lên giao diện.

### 4. Duyệt / từ chối / hủy
1. Chủ nhà hoặc người thuê thao tác trên một yêu cầu.
2. Frontend gửi yêu cầu đến các endpoint approve/reject/cancel.
3. `RentalRegistrationService` cập nhật trạng thái trong CSDL.
4. Giao diện phản ánh trạng thái mới.

## Ghi chú

- Endpoint chính:
  - `POST /api/rental-procedures/register-view/{postId}`
  - `GET /api/rental-procedures/my-requests`
  - `GET /api/rental-procedures/owner-requests`
  - `PUT /api/rental-procedures/approve/{id}`
  - `PUT /api/rental-procedures/reject/{id}`
  - `PUT /api/rental-procedures/cancel/{id}`
- `RentalRegistrationService` xử lý nghiệp vụ đặt lịch và cập nhật trạng thái.
- `RentalRegistrationRepository` chịu trách nhiệm truy vấn và lưu dữ liệu đăng ký.
