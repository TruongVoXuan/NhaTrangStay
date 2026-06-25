package com.truongvx64cntt.nhatrangstay.controller;

import com.truongvx64cntt.nhatrangstay.dto.ChangePasswordRequest;
import com.truongvx64cntt.nhatrangstay.dto.ChangePasswordRequestADMIN;
import com.truongvx64cntt.nhatrangstay.dto.UserResponse;
import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.enums.PostStatus;
import com.truongvx64cntt.nhatrangstay.service.PostService;
import com.truongvx64cntt.nhatrangstay.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.truongvx64cntt.nhatrangstay.dto.UserResponse;
import java.util.List;
import com.truongvx64cntt.nhatrangstay.enums.PostStatus;
import org.springframework.security.core.Authentication;
import com.truongvx64cntt.nhatrangstay.dto.ChangePasswordRequestADMIN;

@RestController
@RequestMapping("/api/users") // ĐÚNG URL FRONTEND GỌI
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;
    private final PostService postService;

    @GetMapping("/{id}/posts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPostsByUser(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getPostsByUserId(id, page, size));
    }

    @PreAuthorize("hasRole('ADMIN')") // ĐẶT Ở ĐÂY

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/lock/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> lockUser(@PathVariable Long id) {
        userService.lockUser(id);
        return ResponseEntity.ok("User locked");
    }

    @PutMapping("/unlock/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unlockUser(@PathVariable Long id) {
        userService.unlockUser(id);
        return ResponseEntity.ok("User unlocked");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // chỉ admin mới xóa
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Deleted user");
    }

    @GetMapping("/pending-posts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingPosts() {
        return ResponseEntity.ok(postService.getPendingPosts());
    }

    @PutMapping("/posts/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approvePost(@PathVariable Long id) {
        postService.updatePostStatus(id, PostStatus.APPROVED);
        return ResponseEntity.ok("Approved");
    }

    @PutMapping("/posts/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectPost(@PathVariable Long id) {
        postService.updatePostStatus(id, PostStatus.REJECTED);
        return ResponseEntity.ok("Rejected");
    }

    // Lấy tất cả bài đăng trong trạng thái
    @GetMapping("/posts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPostsAdmin() {
        return ResponseEntity.ok(postService.getAllPostsForAdmin());
    }

    // hiển thị Chart thống kê số lượng bài đăng theo trạng thái
    @GetMapping("/posts/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPostStats() {
        return ResponseEntity.ok(postService.getApprovedPostStats());
    }

    // Lấy 3 bài đăng gần đây nhất hiển thị trên dashboard
    @GetMapping("/posts/recent-approved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRecentApprovedPosts() {
        return ResponseEntity.ok(
                postService.getRecentApprovedPosts());
    }

    // Lịch sử bài đăng theo tháng
    @GetMapping("/posts/by-month")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPostsByMonth(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(
                postService.getPostsByMonth(month, year));
    }

    // CHange password ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequestADMIN request) {
        return ResponseEntity.ok(
                userService.changeAdminPassword(request));
    }
}