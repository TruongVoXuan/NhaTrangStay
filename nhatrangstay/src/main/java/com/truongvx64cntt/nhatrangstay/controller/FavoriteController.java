package com.truongvx64cntt.nhatrangstay.controller;

import com.truongvx64cntt.nhatrangstay.service.FavoriteService;
import com.truongvx64cntt.nhatrangstay.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@Tag(name = "Favorite API", description = "Bài đăng Yêu thích")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private UserService userService;

    // LẤY USER ID TỪ TOKEN
    private Long getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        return userService.getUserByEmail(email).getId();
    }

    // ================= GET FAVORITES =================
    @GetMapping("/my-favorites")
    public ResponseEntity<?> getMyFavorites(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(favoriteService.getMyFavorites(userId));
    }

    // ================= LIKE =================
    @PostMapping("/like/{postId}")
    public ResponseEntity<?> likePost(
            @PathVariable Long postId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);

        favoriteService.likePost(postId, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Đã lưu vào danh sách yêu thích!");

        return ResponseEntity.ok(response);
    }

    // ================= UNLIKE =================
    @PostMapping("/unlike/{postId}")
    public ResponseEntity<?> unlikePost(
            @PathVariable Long postId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);

        favoriteService.unlikePost(postId, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Đã bỏ lưu phòng!");

        return ResponseEntity.ok(response);
    }
}