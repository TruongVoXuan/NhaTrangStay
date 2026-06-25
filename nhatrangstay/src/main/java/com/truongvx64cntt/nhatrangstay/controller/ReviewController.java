package com.truongvx64cntt.nhatrangstay.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.truongvx64cntt.nhatrangstay.dto.CreateReviewRequest;
import com.truongvx64cntt.nhatrangstay.dto.UpdateReviewRequest;
import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.repository.UserRepository;
import com.truongvx64cntt.nhatrangstay.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Review API", description = "API Đánh giá và Bình luận bài đăng")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewService reviewService,
            UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    // ==========================================
    // 1. TẠO ĐÁNH GIÁ
    // ==========================================
    @PostMapping("/create")
    @Operation(summary = "Tạo bình luận & đánh giá mới")
    public ResponseEntity<?> createReview(
            @RequestBody CreateReviewRequest request,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Bạn chưa đăng nhập");
        }

        // JWT của bạn = email
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        reviewService.createReview(request, user.getId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Đánh giá thành công!");
    }

    // ==========================================
    // 2. LẤY REVIEW THEO POST
    // ==========================================
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getReviewsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(reviewService.getReviewsByPostId(postId));
    }

    // ==========================================
    // 3. SỬA REVIEW
    // ==========================================
    @PutMapping("/edit/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @RequestBody UpdateReviewRequest request,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message", "Bạn chưa đăng nhập"));
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        reviewService.updateReview(reviewId, request, user.getId());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật đánh giá thành công"));
    }

    // ==========================================
    // 4. XÓA REVIEW
    // ==========================================
    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message", "Bạn chưa đăng nhập"));
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        reviewService.deleteReview(reviewId, user.getId());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Xóa đánh giá thành công"));
    }

    @GetMapping("/summary/{postId}")
    public ResponseEntity<?> getReviewSummary(@PathVariable Long postId) {

        Double avgRating = reviewService.getAvgRating(postId);
        Long reviewCount = reviewService.getReviewCount(postId);

        Map<String, Object> res = new HashMap<>();
        res.put("avgRating", avgRating != null ? avgRating : 0);
        res.put("reviewCount", reviewCount);

        return ResponseEntity.ok(res);
    }
}