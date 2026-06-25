package com.truongvx64cntt.nhatrangstay.controller;

import com.truongvx64cntt.nhatrangstay.dto.*;
import com.truongvx64cntt.nhatrangstay.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import com.truongvx64cntt.nhatrangstay.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication API", description = "Account management API")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // =========================
    // SIGNUP (ĐĂNG KÝ)
    // =========================
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        authService.signup(request);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 201);
        response.put("message", "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================
    // VERIFY EMAIL (XÁC THỰC)
    // =========================
    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        authService.verifyEmail(token);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Xác thực email thành công");

        return ResponseEntity.ok(response);
    }

    // =========================
    // LOGIN (ĐĂNG NHẬP) - PHẦN VỪA ĐƯỢC BỔ SUNG
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserInfo() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        UserResponse response = userService.getUserInfoByEmail(email);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserRequest request) {
        String message = userService.updateProfile(
                request.getUsername(),
                request.getEmail(),
                request.getPhone(),
                request.getAvatar() // giờ là STRING URL
        );

        return ResponseEntity.ok(message);
    }

    // 4 FORGOT PASSWORD (QUÊN MẬT KHẨU)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> requestPasswordReset(@RequestBody ForgotPasswordRequest request) {
        // Check email và tạo otp
        String content = this.authService.generateAndSendPasswordResetOtp(request);
        return ResponseEntity.ok(content);
    }

    @GetMapping("/verify-resettoken-mail")
    public ResponseEntity<?> verifyResetPasswordEmail(@RequestParam String resetToken) {

        String verifyResetPasswordEmail = this.authService.verifyPasswordResetOtpEmail(resetToken);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Xác thực thành công");
        response.put("resetToken", verifyResetPasswordEmail);

        return ResponseEntity.ok(response);
    }

    // 4️2 Change Password (QUÊN MẬT KHẨU)
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        if (!request.getComfirmPassword().equals(request.getNewPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu xác nhận không khớp");
        }

        // Check reset token;
        String changePassword = this.authService.changePassword(request);

        return ResponseEntity.ok(changePassword);
    }

}