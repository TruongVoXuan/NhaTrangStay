# Sequence tìm kiếm phòng (kèm chatbot hỗ trợ)

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant SearchPage as Trang tìm kiếm
    participant Chatbot as Chatbot hỗ trợ
    participant PostController as PostController
    participant PostService as PostService
    participant PostSpecification as PostSpecification
    participant PostRepository as PostRepository
    participant DB as CSDL

    User->>SearchPage: 1. Nhập tiêu chí tìm kiếm
    alt Người dùng dùng chatbot
        User->>Chatbot: 2. Nhập ngôn ngữ tự nhiên
        Chatbot->>PostService: 3. Chuyển yêu cầu hiểu ngữ nghĩa
        PostService->>PostSpecification: 4. Tạo điều kiện lọc từ truy vấn
        PostSpecification->>PostRepository: 5. Tìm các phòng phù hợp
        PostRepository->>DB: 6. Truy vấn CSDL theo điều kiện
        DB-->>PostRepository: 7. Trả về danh sách phòng
        PostRepository-->>PostService: 8. Trả về kết quả
        PostService-->>Chatbot: 9. Trả danh sách gợi ý
        Chatbot-->>SearchPage: 10. Hiển thị kết quả tìm kiếm
    else Người dùng dùng bộ lọc truyền thống
        SearchPage->>PostController: 2. Gửi yêu cầu tìm kiếm
        PostController->>PostService: 3. Gọi searchPosts(request, pageable)
        PostService->>PostSpecification: 4. Xây dựng Specification
        PostSpecification->>PostRepository: 5. Truy vấn dữ liệu
        PostRepository->>DB: 6. Lọc theo tiêu chí
        DB-->>PostRepository: 7. Trả về danh sách phòng
        PostRepository-->>PostService: 8. Trả về kết quả
        PostService-->>PostController: 9. Trả danh sách phòng
        PostController-->>SearchPage: 10. Hiển thị kết quả
    end
    SearchPage-->>User: 11. Hiển thị danh sách phòng phù hợp
```

## Mô tả luồng

### 1. Tìm kiếm thông thường
1. Người dùng nhập tiêu chí tìm kiếm trên giao diện.
2. `SearchPage` gửi yêu cầu đến `PostController`.
3. `PostController` gọi `PostService.searchPosts()`.
4. `PostService` tạo `Specification` thông qua `PostSpecification`.
5. `PostRepository` truy vấn CSDL theo điều kiện lọc.
6. Kết quả trả về và được hiển thị lên giao diện.

### 2. Tìm kiếm bằng chatbot hỗ trợ
1. Người dùng nhập câu hỏi tự nhiên vào chatbot.
2. Chatbot chuyển yêu cầu đến `PostService` để hiểu ý định tìm kiếm.
3. `PostSpecification` tạo điều kiện lọc từ truy vấn.
4. Hệ thống truy vấn CSDL và trả về phòng phù hợp.
5. Chatbot hiển thị kết quả hoặc gợi ý cho người dùng.

## Ghi chú

- Endpoint chính của tìm kiếm: `GET /api/posts/search`.
- `PostSpecification` là nơi xử lý bộ lọc nâng cao.
- Bot hỗ trợ có thể giúp người dùng tìm kiếm bằng câu tự nhiên thay vì chỉ nhập tiêu chí cố định.
