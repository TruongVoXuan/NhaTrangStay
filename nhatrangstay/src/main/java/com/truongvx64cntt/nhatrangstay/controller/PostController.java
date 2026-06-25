package com.truongvx64cntt.nhatrangstay.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.truongvx64cntt.nhatrangstay.dto.CreatePostRequest;
import com.truongvx64cntt.nhatrangstay.dto.PostSearchRequest;
import com.truongvx64cntt.nhatrangstay.dto.UpdatePostRequest;
import com.truongvx64cntt.nhatrangstay.entity.Post;
import com.truongvx64cntt.nhatrangstay.service.PostService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Post API", description = "Manage posts an upload images API")
public class PostController {

    private final PostService postService;

    // ==========================================
    // 1. API TẠO BÀI ĐĂNG
    // ==========================================
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create post", description = "Create a post with information about the room")
    public ResponseEntity<?> createPost(
            @ModelAttribute CreatePostRequest request,
            Authentication authentication) {

        System.out.println("===== DEBUG CREATE POST =====");

        // Check auth
        if (authentication == null) {
            System.out.println(" Authentication NULL");

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("status", 401);
            response.put("message", "User not logged in");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String email = authentication.getName();
        System.out.println(" User email: " + email);

        // Log request data
        System.out.println("Title: " + request.getTitle());
        System.out.println("Price: " + request.getPrice());
        System.out.println("Area: " + request.getArea());
        System.out.println("RoomQuantity: " + request.getRoomQuantity());
        System.out.println("TypeId: " + request.getTypeId());
        System.out.println("Address: " + request.getAddress());
        System.out.println("Lat: " + request.getLatitude());
        System.out.println("Lng: " + request.getLongitude());

        // Debug images
        if (request.getImages() == null) {
            System.out.println(" Images NULL (Swagger chưa gửi file)");
        } else {
            System.out.println(" Images size: " + request.getImages().size());

            for (int i = 0; i < request.getImages().size(); i++) {
                var file = request.getImages().get(i);

                if (file == null) {
                    System.out.println(" File " + i + " = NULL");
                } else {
                    System.out.println(" File " + i + ": " + file.getOriginalFilename()
                            + " | size=" + file.getSize()
                            + " | empty=" + file.isEmpty());
                }
            }
        }

        try {
            postService.createPost(request, email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("status", 201);
            response.put("message", "Create post successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.out.println(" ERROR CREATE POST: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("status", 400);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search posts", description = "Filter and search posts")
    public ResponseEntity<Page<Post>> searchPosts(
            @ModelAttribute PostSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {

        // parse sort
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(direction, sortParams[0]));

        Page<Post> result = postService.searchPosts(request, pageable);

        return ResponseEntity.ok(result);
    }

    // ==========================================
    // 3. GET POST DETAIL
    // ==========================================
    @GetMapping("/{id:\\d+}")
    @Operation(summary = "Get post detail", description = "Choose a post to get information about it.")
    public ResponseEntity<Post> getPostDetail(@PathVariable Long id) {

        Post post = postService.getPostDetail(id);

        return ResponseEntity.ok(post);
    }

    // ==========================================
    // 4. EDIT POST API
    // ==========================================
    @PostMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Edit Post", description = "Choose a post to edit content of that post.")
    public ResponseEntity<?> updatePost(
            @Parameter(description = "Post ID") @PathVariable Long id,
            @ModelAttribute UpdatePostRequest request,
            Authentication authentication) {

        if (authentication == null) {

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("status", 401);
            response.put("message", "User not logged in");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        String email = authentication.getName();

        postService.updatePost(id, request, email);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("status", 200);
        response.put("message", "Update post successfully");

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // 5. DELETE POST API
    // ==========================================
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete post", description = "Choose a post to delete it (Soft Delete)")
    public ResponseEntity<?> deletePost(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        postService.deletePost(id, email);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("status", 200);
        response.put("message", "Delete post successfully");
        return ResponseEntity.ok(response);
    }

    // ==========================================

    // 6. LOCK POST API

    // ==========================================

    @PutMapping("/{id}/lock")

    @Operation(summary = "Lock post", description = "Admin locks a post, sets status to PENDING and notifies owner")

    public ResponseEntity<?> lockPost(@PathVariable Long id) {

        postService.lockPost(id);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);

        response.put("status", 200);

        response.put("message", "Đã khóa bài đăng");

        return ResponseEntity.ok(response);

    }

    @PutMapping("/{id}/unlock")
    public ResponseEntity<?> unlockPost(@PathVariable Long id) {
        postService.unlockPost(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã mở khóa bài đăng");
        return ResponseEntity.ok(response);
    }

}
