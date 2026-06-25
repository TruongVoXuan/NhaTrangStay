package com.truongvx64cntt.nhatrangstay.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.truongvx64cntt.nhatrangstay.dto.CreatePostRequest;
import com.truongvx64cntt.nhatrangstay.dto.PostSearchRequest;
import com.truongvx64cntt.nhatrangstay.dto.UpdatePostRequest;
import com.truongvx64cntt.nhatrangstay.entity.Image;
import com.truongvx64cntt.nhatrangstay.entity.Post;
import com.truongvx64cntt.nhatrangstay.entity.RoomType;
import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.enums.PostStatus;
import com.truongvx64cntt.nhatrangstay.repository.FavoriteRepository;
import com.truongvx64cntt.nhatrangstay.repository.PostRepository;
import com.truongvx64cntt.nhatrangstay.repository.PreOrderRepository;
import com.truongvx64cntt.nhatrangstay.repository.TypeRepository;
import com.truongvx64cntt.nhatrangstay.repository.UserRepository;
import com.truongvx64cntt.nhatrangstay.service.email.EmailService;
import com.truongvx64cntt.nhatrangstay.specification.PostSpecification;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TypeRepository typeRepository;
    private final SupabaseStorageService supabaseStorageService;
    private final FavoriteRepository favoriteRepository;
    private final PreOrderRepository preOrderRepository;
    private final EmailService emailService;
    private final AutoApproveService autoApproveService;

    // ==========================================
    // 1. CREATE POST
    // ==========================================
    public void createPost(CreatePostRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        RoomType type = typeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room type not found"));

        if (request.getPrice() == null || request.getPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The price must be greater than 0.");
        }

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setPrice(request.getPrice());
        post.setArea(request.getArea());
        post.setRoomQuantity(request.getRoomQuantity());
        post.setAddress(request.getAddress());
        post.setDescription(request.getDescription());
        post.setLatitude(request.getLatitude());
        post.setLongitude(request.getLongitude());
        post.setStatus(PostStatus.PENDING);
        post.setUser(user);
        post.setType(type);

        List<Image> images = new ArrayList<>();
        int index = 0;

        if (request.getImages() != null) {
            for (MultipartFile file : request.getImages()) {
                try {

                    String imageUrl = supabaseStorageService.uploadFile(file);

                    Image image = new Image();
                    image.setUrl(imageUrl);
                    image.setOrder_index(index++);
                    image.setPost(post);

                    images.add(image);

                } catch (Exception e) {
                    System.out.println(" REAL ERROR: " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("Upload image failed");

                }
            }
        }

        post.setImages(images);
        postRepository.save(post);

        new Thread(() -> autoApproveService.autoReview(post, false)).start();

    }

    // ==========================================
    // 2. SEARCH POSTS
    // ==========================================
    public Page<Post> searchPosts(PostSearchRequest request, Pageable pageable) {

        Specification<Post> spec = PostSpecification.filterPosts(request);

        return postRepository.findAll(spec, pageable);
    }

    // ==========================================
    // 3. GET POST DETAIL
    // ==========================================
    public Post getPostDetail(Long postId) {

        return postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    }

    // ==========================================
    // 4. UPDATE POST
    // ==========================================
    public void updatePost(Long postId, UpdatePostRequest request, String email) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to edit this post.");
        }

        RoomType type = typeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found"));

        // Update thông tin
        post.setTitle(request.getTitle());
        post.setPrice(request.getPrice());
        post.setArea(request.getArea());
        post.setRoomQuantity(request.getRoomQuantity());
        post.setAddress(request.getAddress());
        post.setDescription(request.getDescription());
        post.setLatitude(request.getLatitude());
        post.setLongitude(request.getLongitude());
        post.setType(type);

        // Xóa ảnh
        if (request.getDeleteImageIds() != null) {

            post.getImages().removeIf(image -> {

                if (request.getDeleteImageIds().contains(image.getId())) {

                    try {
                        supabaseStorageService.deleteFile(image.getUrl());
                    } catch (Exception e) {
                        throw new RuntimeException("Delete image failed");
                    }

                    return true;
                }

                return false;
            });
        }

        // Add new image
        if (request.getNewImages() != null && !request.getNewImages().isEmpty()) {

            int index = post.getImages().size();

            for (MultipartFile file : request.getNewImages()) {
                try {

                    String imageUrl = supabaseStorageService.uploadFile(file);

                    Image image = new Image();
                    image.setUrl(imageUrl);
                    image.setOrder_index(index++);
                    image.setPost(post);

                    post.getImages().add(image);

                } catch (Exception e) {
                    System.out.println(" REAL ERROR: " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("Upload image failed");
                }
            }
        }

        PostStatus statusTruocKhiSave = post.getStatus();

        postRepository.save(post);

        if (statusTruocKhiSave != PostStatus.REJECTED) {
            new Thread(() -> autoApproveService.autoReview(post, true)).start();
        }

    }

    // ==========================================
    // 5. DELETE POST (SOFT DELETE)
    // ==========================================
    @Transactional
    public void deletePost(Long postId, String email) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this post.");
        }
        // 1. XÓA PRE_ORDERS TRƯỚC (QUAN TRỌNG)
        preOrderRepository.deleteByPostId(postId);

        // 1. XÓA FAVORITES TRƯỚC
        favoriteRepository.deleteByPostId(postId);

        // 2. Xóa images trên Supabase (ĐẶT Ở ĐÂY)
        for (Image img : post.getImages()) {
            try {
                supabaseStorageService.deleteFile(img.getUrl());
            } catch (Exception e) {
                System.out.println(" Delete image failed: " + img.getUrl());
                e.printStackTrace();
                // KHÔNG throw nữa để tránh crash API
            }
        }

        // 3. XÓA POST
        postRepository.delete(post);
    }

    // ==========================================
    // 6. GET ALL POSTS
    // ==========================================
    public Page<Post> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findByStatus(PostStatus.APPROVED, pageable);
    }

    public Page<Post> getPostsByUserId(Long userId, int page, int size) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return postRepository.findByUser(user, pageable);
    }

    // ==========================================
    // 7. GET USER'S POSTS
    // ==========================================
    public Page<Post> getMyPosts(String email, int page, int size) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findByUser(user, pageable);
    }

    // get pending posts for admin
    public List<Post> getPendingPosts() {
        return postRepository.findByStatusIn(List.of(PostStatus.PENDING, PostStatus.LOCKED));
    }

    // update post status (approve/reject)
    public void updatePostStatus(Long postId, PostStatus status) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setStatus(status);

        postRepository.save(post);
    }

    public List<Post> getAllPostsForAdmin() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // Chart data
    public List<Map<String, Object>> getApprovedPostStats() {

        List<Object[]> rawData = postRepository.countApprovedPostsByMonth();

        List<Map<String, Object>> result = new ArrayList<>();

        for (int i = 1; i <= 12; i++) {

            int total = 0;

            for (Object[] row : rawData) {

                Integer month = (Integer) row[0];

                if (month == i) {
                    total = ((Number) row[1]).intValue();
                }
            }

            Map<String, Object> item = new HashMap<>();

            item.put("name", "Tháng " + i);
            item.put("current", total);

            result.add(item);
        }

        return result;
    }

    // Lấy 3 bài đăng gần đây nhất hiển thị trên dashboard
    public List<Post> getRecentApprovedPosts() {
        return postRepository
                .findTop5ByStatusOrderByUpdatedAtDesc(PostStatus.APPROVED);
    }

    // Lich sử bài đăng theo tháng
    public List<Post> getPostsByMonth(int month, int year) {

        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1);

        return postRepository.findPostsByMonthRange(start, end);
    }

    // ==========================================
    // 8. LOCK POST
    // ==========================================
    public void lockPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        post.setStatus(PostStatus.LOCKED);
        postRepository.save(post);

        // Gửi mail thông báo cho chủ trọ
        String ownerEmail = post.getUser().getEmail();
        String subject = "[NhaTrangStay] Bài đăng của bạn đã bị tạm khóa";
        String body = "Xin chào " + post.getUser().getUsername() + ",\n\n"
                + "Bài đăng \"" + post.getTitle() + "\" của bạn đã bị admin tạm khóa.\n"
                + "Vui lòng liên hệ admin để biết thêm chi tiết.\n\n"
                + "Trân trọng,\nNhaTrangStay";

        emailService.sendEmail(ownerEmail, subject, body);
    }

    public void unlockPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        post.setStatus(PostStatus.APPROVED);
        postRepository.save(post);
    }

}