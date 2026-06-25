package com.truongvx64cntt.nhatrangstay.service;

import com.truongvx64cntt.nhatrangstay.dto.UserRequest;
import com.truongvx64cntt.nhatrangstay.dto.UserResponse;
import com.truongvx64cntt.nhatrangstay.entity.OtpVerifications;
import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.enums.OtpType;
import com.truongvx64cntt.nhatrangstay.repository.OtpVerificationRepository;
import com.truongvx64cntt.nhatrangstay.repository.UserRepository;
import com.truongvx64cntt.nhatrangstay.service.email.EmailSender;
import com.truongvx64cntt.nhatrangstay.service.email.EmailService;
import com.truongvx64cntt.nhatrangstay.service.sms.SmsSender;
import com.truongvx64cntt.nhatrangstay.service.sms.SmsService;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Files;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.io.IOException;
import java.util.UUID;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import com.truongvx64cntt.nhatrangstay.enums.Role;
import com.truongvx64cntt.nhatrangstay.enums.UserStatus;
import com.truongvx64cntt.nhatrangstay.repository.PostRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.truongvx64cntt.nhatrangstay.dto.ChangePasswordRequest;
import com.truongvx64cntt.nhatrangstay.dto.ChangePasswordRequestADMIN;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class UserService {
        private final UserRepository userRepository;

        private final OtpVerificationRepository otpVerificationRepository;

        /* Add loose coupling */
        private final SmsSender smsService;

        private final EmailSender emailService;

        private final PostRepository postRepository;

        private final PasswordEncoder passwordEncoder;

        public UserResponse ConvertUserToDTo(User user) {

                int postCount = postRepository.countPostsByUserId(user.getId());
                return UserResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .avatar(user.getAvatar())
                                .role(user.getRole())
                                .provider(user.getProvider())
                                .status(user.getStatus())
                                .postCount(postCount)
                                .build();
        }

        public UserResponse getUserInfoByEmail(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Không tìm thấy user"));

                return ConvertUserToDTo(user);
        }

        public UserResponse getUserInfoById(Long id) {
                User user = this.userRepository.findById(id).orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khong tim thay user"));

                return ConvertUserToDTo(user);

        }

        public String updateProfile(String username, String email, String phone, String avatar) {

                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String userEmail = auth.getName();

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setUsername(username);
                user.setEmail(email);
                user.setPhone(phone);

                if (avatar != null && !avatar.isEmpty()) {
                        user.setAvatar(avatar); // lưu URL supabase
                }

                userRepository.save(user);

                return "Cập nhật thành công";
        }

        public String generatePhoneOtp(UserRequest request) {

                /* Lấy thông tin đăng nhập của hệ thống */
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String phoneOtp = String.format(
                                "%06d", new SecureRandom().nextInt(1_000_000));

                String email = authentication.getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "khong tim thay user"));

                if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {

                        // Check xem số mới có ai xài chưa
                        if (userRepository.existsByPhone(request.getPhone())) {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Số điện thoại đã được sử dụng, vui lòng sử dụng số khác");
                        }

                        // Nếu qua ải kiểm tra, set SĐT mới cho user (và lưu thẳng vào DB luôn nếu bạn
                        // muốn)
                        user.setPhone(request.getPhone());
                        userRepository.save(user);
                }

                Optional<OtpVerifications> otpPhoneVerifications = this.otpVerificationRepository
                                .findByTargetValue(request.getPhone());
                /* Check tồn tại */
                if (otpPhoneVerifications.isPresent()) {
                        if (Instant.now().isAfter(otpPhoneVerifications.get().getExpired_at())) {
                                otpVerificationRepository.delete(otpPhoneVerifications.get());
                                OtpVerifications otpVerifications = new OtpVerifications();
                                otpVerifications.setOtp(phoneOtp);
                                otpVerifications.setUser(user);
                                otpVerifications.setExpired_at(
                                                Instant.now().plus(5, ChronoUnit.MINUTES));
                                otpVerifications.setType(OtpType.PHONE);
                                otpVerifications.setTargetValue(request.getPhone());
                                otpVerifications.setNewName(request.getUsername());
                                otpVerificationRepository.save(otpVerifications);
                                return "OTP đã được gửi tới số điện thoại " + request.getPhone()
                                                + "Vui long kiem tra SMS";
                        }
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "OTP đã được gửi tới số điện thoại " + request.getPhone() +
                                                        ". Vui lòng kiểm tra SMS hoặc đợi OTP hết hạn để gửi lại.");
                }
                OtpVerifications newOtp = new OtpVerifications();
                newOtp.setOtp(phoneOtp);
                newOtp.setUser(user);
                newOtp.setType(OtpType.PHONE);
                newOtp.setTargetValue(request.getPhone());
                newOtp.setNewName(request.getUsername());
                newOtp.setExpired_at(Instant.now().plus(5, ChronoUnit.MINUTES));

                otpVerificationRepository.save(newOtp);

                //// Gửi SMS
                // String result = smsService.sendSms(
                // request.getNewPhone(),phoneOtp
                // );

                return "OTP đã được gửi tới số điện thoại " + request.getPhone() + "Vui long kiem tra SMS";
        }

        public String generateEmailOtp(UserRequest request) {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                // String userID = authentication.getName();
                // System.out.printf(userID);

                String email = authentication.getName();

                String emailOtp = String.format(
                                "%06d", new SecureRandom().nextInt(1_000_000));

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "khong tim thay user"));
                /* Check email nhập xem có nhập hoặc trùng ko */
                /* Check trùng với email hiện tại */
                /* Check xem SDT co thay doi khong */
                boolean isSameEmail = java.util.Objects.equals(user.getEmail(), request.getEmail());
                boolean isSameUsername = java.util.Objects.equals(user.getUsername(), request.getUsername());
                boolean isSamePhone = java.util.Objects.equals(user.getPhone(), request.getPhone());

                // nhập lại email
                if (isSameEmail) {
                        // nhập lại username
                        if (isSameUsername && isSamePhone) {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Bạn đang nhập lại thông tin hiện tại");
                        }
                        // username khác
                        if (!isSameUsername && request.getUsername() != null && !request.getUsername().isBlank()) {
                                user.setUsername(request.getUsername());
                        }
                        // phone khac
                        if (!isSamePhone && request.getPhone() != null && !request.getPhone().isBlank()) {
                                if (userRepository.existsByPhone(request.getPhone())) {
                                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                        "Số điện thoại đã được sử dụng");
                                }
                                user.setPhone(request.getPhone());
                        }

                        userRepository.save(user);
                        return "Cập nhật username thành công";
                }

                // Email thuộc user khác
                if (!isSameEmail && userRepository.existsByEmail(request.getEmail())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        request.getEmail() + " đã được sử dụng");
                }

                if (!isSameUsername && request.getUsername() != null && !request.getUsername().isBlank()) {
                        user.setUsername(request.getUsername());
                }

                if (!isSamePhone && request.getPhone() != null && !request.getPhone().isBlank()) {
                        if (userRepository.existsByPhone(request.getPhone())) {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Số điện thoại đã được sử dụng");
                        }
                        user.setPhone(request.getPhone());
                }
                userRepository.save(user);

                Optional<OtpVerifications> otpEmailVerifications = this.otpVerificationRepository
                                .findByTargetValue(request.getEmail());

                /* Check xem có bản ghi chưa */
                if (otpEmailVerifications.isPresent()) {

                        if (Instant.now().isAfter(otpEmailVerifications.get().getExpired_at())) {
                                /* Có nhưng hết hạn */
                                this.otpVerificationRepository.delete(otpEmailVerifications.get());

                                OtpVerifications otpVerifications = new OtpVerifications();
                                otpVerifications.setOtp(emailOtp);
                                otpVerifications.setUser(user);
                                otpVerifications.setType(OtpType.EMAIL);
                                otpVerifications.setNewName(request.getUsername());
                                otpVerifications.setExpired_at(Instant.now().plus(5, ChronoUnit.MINUTES));
                                otpVerifications.setTargetValue(request.getEmail());
                                otpVerificationRepository.save(otpVerifications);

                                emailService.confirmEmailChangeOtp(request.getEmail(), emailOtp);

                                return "OTP đã được gửi tới email " + request.getEmail() +
                                                ". Vui lòng kiểm tra email";
                        }

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "OTP đã được gửi tới email " + request.getEmail() +
                                                        ". Vui lòng kiểm tra email hoặc đợi OTP hết hạn để gửi lại.");
                }

                OtpVerifications otpVerifications = new OtpVerifications();
                otpVerifications.setOtp(emailOtp);
                otpVerifications.setType(OtpType.EMAIL);
                otpVerifications.setTargetValue(request.getEmail());
                otpVerifications.setNewName(request.getUsername());
                otpVerifications.setUser(user);
                otpVerifications.setExpired_at(
                                Instant.now().plus(5, ChronoUnit.MINUTES));
                otpVerificationRepository.save(otpVerifications);

                // gửi mail
                emailService.confirmEmailChangeOtp(request.getEmail(), emailOtp);
                return "OTP đã được gửi tới email " + request.getEmail() +
                                ". Vui lòng kiểm tra email.";
        }

        // Check Otp Email;
        public String verifyOtp(String targetEmail, String otp) {

                OtpVerifications otpVerifications = this.otpVerificationRepository
                                .findByTargetValueAndOtpAndType(targetEmail, otp, OtpType.EMAIL).orElseThrow(
                                                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                                "Sai otp hoac chua co otp"));

                /* Có thì check xem token đã hết hạn chưa */
                if (Instant.now().isAfter(otpVerifications.getExpired_at())) {

                        otpVerificationRepository.delete(otpVerifications);
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Otp het hạn vui lòng thực hiện lại");
                }
                /* Con han thi check xem truong new name co data ko */

                User user = otpVerifications.getUser();

                if (otpVerifications.getNewName() == null || otpVerifications.getNewName().isBlank()) {
                        otpVerifications.setNewName(user.getUsername());
                }

                user.setEmail(targetEmail);
                user.setUsername(otpVerifications.getNewName());
                this.userRepository.save(user);
                this.otpVerificationRepository.delete(otpVerifications);

                return "xac thuc thanh cong";
        }

        // THÊM Ở ĐÂY
        public User getUserByEmail(String email) {
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        public List<UserResponse> getAllUsers() {
                return userRepository.findByRoleNot(Role.ADMIN)
                                .stream()
                                .map(this::ConvertUserToDTo) // gọi hàm có postCount
                                .toList();
        }

        public void lockUser(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setStatus(UserStatus.BANNED); // đổi trạng thái
                userRepository.save(user);
                // Gửi mail thông báo
                String subject = "[NhaTrangStay] Tài khoản của bạn đã bị tạm khóa";
                String body = "Xin chào " + user.getUsername() + ",\n\n"
                                + "Tài khoản của bạn đã bị admin tạm khóa.\n"
                                + "Vui lòng liên hệ admin để biết thêm chi tiết.\n\n"
                                + "Email admin: admin@nhatrangstay.com\n\n"
                                + "Trân trọng,\nNhaTrangStay";
                emailService.sendEmail(user.getEmail(), subject, body);
        }

        public void unlockUser(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);
                // Gửi mail thông báo
                String subject = "[NhaTrangStay] Tài khoản của bạn đã được mở khóa";
                String body = "Xin chào " + user.getUsername() + ",\n\n"
                                + "Tài khoản của bạn đã được admin mở khóa thành công.\n"
                                + "Bạn có thể đăng nhập và sử dụng dịch vụ bình thường.\n\n"
                                + "Trân trọng,\nNhaTrangStay";

                emailService.sendEmail(user.getEmail(), subject, body);
        }

        public void deleteUser(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                userRepository.delete(user); // xóa khỏi DB
        }

        public String changeAdminPassword(ChangePasswordRequestADMIN request) {

                Authentication auth = SecurityContextHolder.getContext().getAuthentication();

                String email = auth.getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                System.out.println("EMAIL AUTH: " + auth.getName());
                System.out.println("INPUT PASS: [" + request.getCurrentPassword() + "]");
                System.out.println("DB PASS: " + user.getPassword());
                // 1. check mật khẩu cũ
                if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không đúng");
                }

                // update password
                user.setPassword(
                                passwordEncoder.encode(request.getNewPassword()));

                userRepository.save(user);

                return "Đổi mật khẩu thành công";
        }

}
