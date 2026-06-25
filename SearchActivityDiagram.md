# Search Activity Diagram

Biểu đồ dưới đây mô tả luồng tìm kiếm bất động sản trong NhaTrangStay, dựa theo `usePostSearch.js` và trang Home.

```mermaid
flowchart TD
  A[Start] --> B[User mở trang Home]
  B --> C[usePostSearch khởi tạo filters và page từ URL]
  C --> D[useEffect gọi searchPosts() khi page/filters/sort thay đổi]

  subgraph Filter Input
    E[Nhập keyword / chọn khu vực]
    F[Chọn khoảng giá]
    G[Chọn diện tích]
    H[Chọn loại phòng]
    I[Chọn sort]
  end

  D --> J[Hiển thị trạng thái loading]
  E --> K[updateFilters(newFilters)]
  F --> K
  G --> K
  H --> K
  I --> K
  K --> L[
    Cập nhật filters
    Đặt page = 0
  ]
  L --> D

  D --> M{searchPosts()}
  M --> N[Làm sạch filters:
    loại bỏ giá trị rỗng,
    convert số]
  N --> O[Gọi postAPI.search(cleanFilters, page, size, sort)]

  O --> P{API thành công?}
  P -->|No| Q[Set error và hiển thị thông báo lỗi]
  P -->|Yes| R[Map dữ liệu trả về và setPosts]
  R --> S[setTotalPages, setTotalElements]
  S --> T[Hiển thị danh sách bài đăng
    hoặc trạng thái không có dữ liệu]

  Q --> T

  T --> U[End]

  click O href "src/lib/apiService.js" "Xem postAPI.search"
  click C href "src/hooks/usePostSearch.js" "Xem usePostSearch"
``` 

## Ghi chú

- Luồng tìm kiếm được kích hoạt mỗi khi `filters`, `page`, hoặc `sort` thay đổi.
- `updateFilters` reset page về 0 để tìm kiếm từ trang đầu.
- Hàm `searchPosts` sẽ convert các giá trị số và loại bỏ giá trị rỗng trước khi gọi backend.
- Kết quả trả về được lưu vào `posts`, `totalPages`, và `totalElements`.
- Nếu API lỗi, hook set `error` và component Home hiển thị thông báo phù hợp.
