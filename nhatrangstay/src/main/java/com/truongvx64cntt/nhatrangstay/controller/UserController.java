package com.truongvx64cntt.nhatrangstay.controller;

import com.truongvx64cntt.nhatrangstay.dto.UserRequest;
import com.truongvx64cntt.nhatrangstay.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import com.truongvx64cntt.nhatrangstay.service.sms.SmsService;

@RestController
@RequestMapping("/api/user")
@Tag(name = "OTP API", description = "OTP")
@RequiredArgsConstructor
public class UserController {

    private final SmsService service;

    private final UserService userService;

    @PostMapping("/sendOtp") /* sinh mã otp */
    public ResponseEntity<?> generateOtp(@RequestBody UserRequest request) {

        String phoneOtp;
        String emailOtp;

        boolean hasEmail = request.getEmail() != null && !request.getEmail().isBlank();
        boolean hasPhone = request.getPhone() != null && !request.getPhone().isBlank();

        /* cả 2 đều rỗng */
        if (!hasEmail && !hasPhone) {
            return ResponseEntity.badRequest().body("Vui lòng nhập email mới hoặc số điện thoại mới");
        }

        /* chỉ có phone */
        if (!hasEmail) {
            phoneOtp = this.userService.generatePhoneOtp(request);
            return ResponseEntity.ok(phoneOtp);
        }

        /* chỉ có email */
        if (!hasPhone) {
            emailOtp = this.userService.generateEmailOtp(request);
            return ResponseEntity.ok(Map.of(
                    "status", 200,
                    "message", emailOtp));
        }

        /* có cả 2 */
        phoneOtp = this.userService.generatePhoneOtp(request);
        emailOtp = this.userService.generateEmailOtp(request);

        String otpCode = """
                phone otp code : %s
                email otp code : %s
                """.formatted(phoneOtp, emailOtp);

        return ResponseEntity.ok(otpCode);
    }

    /* Verify email */
    @GetMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {
        String result = this.userService.verifyOtp(email, otp);
        return ResponseEntity.ok(result);

    }
}
