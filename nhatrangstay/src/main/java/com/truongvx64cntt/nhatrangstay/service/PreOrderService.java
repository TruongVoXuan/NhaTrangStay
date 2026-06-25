package com.truongvx64cntt.nhatrangstay.service;

import com.truongvx64cntt.nhatrangstay.entity.*;
import com.truongvx64cntt.nhatrangstay.repository.*;
import com.truongvx64cntt.nhatrangstay.service.email.EmailService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PreOrderService {

        private final PreOrderRepository preOrderRepository;
        private final PostRepository postRepository;
        private final UserRepository userRepository;
        private final EmailService emailService;

        // tạo preorder
        public void createPreOrder(Long postId, String email, LocalDateTime time) {

                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post không tồn tại"));

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
                // CHẶN CHỦ PHÒNG ĐẶT CHÍNH PHÒNG MÌNH
                if (post.getUser().getId().equals(user.getId())) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Bạn là chủ phòng này rồi");
                }
                // 1. Check phòng đã có người được duyệt trước
                boolean isBooked = preOrderRepository
                                .existsByPost_IdAndStatus(postId, PreOrder.Status.APPROVED);

                if (isBooked) {
                        throw new RuntimeException("Phòng đã có người đặt trước");
                }
                // 2. Check user đã đặt chưa
                boolean isPendingOrApproved = preOrderRepository
                                .existsByPost_IdAndUser_IdAndStatusIn(
                                                postId,
                                                user.getId(),
                                                List.of(PreOrder.Status.PENDING, PreOrder.Status.APPROVED));

                if (isPendingOrApproved) {
                        throw new RuntimeException("Bạn đã đặt phòng này rồi, vui lòng đợi chủ phòng xử lý");
                }

                // 3. Tạo mới
                PreOrder preOrder = PreOrder.builder()
                                .post(post)
                                .user(user)
                                .time(time)
                                .status(PreOrder.Status.PENDING)
                                .build();

                preOrderRepository.save(preOrder);
                // ==========================================
                // GỬI MAIL CHO CHỦ PHÒNG
                // ==========================================

                String ownerEmail = post.getUser().getEmail();

                String subject = "[NhaTrangStay] Yêu cầu xác nhận đặt phòng";

                String body = "Xin chào " + post.getUser().getUsername() + ",\n\n"
                                + user.getUsername()
                                + " muốn đặt phòng \"" + post.getTitle() + "\".\n\n"
                                + "Vui lòng vào hệ thống để kiểm tra và xác nhận yêu cầu đặt phòng.\n\n"
                                + "Trân trọng,\nNhaTrangStay";

                emailService.sendEmail(ownerEmail, subject, body);
        }

        public void cancelPreOrder(Long id) {

                PreOrder preOrder = preOrderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("PreOrder không tồn tại"));

                if (!preOrder.getStatus().equals(PreOrder.Status.APPROVED)) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Chỉ hợp đồng đang thuê mới có thể hủy");
                }

                preOrder.setStatus(PreOrder.Status.CANCELLED);
                preOrderRepository.save(preOrder);

                // Gửi email cho người đặt
                String userEmail = preOrder.getUser().getEmail();
                String userName = preOrder.getUser().getUsername();
                String postTitle = preOrder.getPost().getTitle();

                String subject = "[NhaTrangStay] Hợp đồng thuê phòng đã bị hủy";
                String body = "Xin chào " + userName + ",\n\n"
                                + "Hợp đồng thuê phòng \"" + postTitle + "\" của bạn đã bị chủ phòng hủy.\n\n"
                                + "Vui lòng liên hệ chủ phòng để biết thêm thông tin hoặc tìm phòng khác trên hệ thống.\n\n"
                                + "Trân trọng,\nNhaTrangStay";

                emailService.sendEmail(userEmail, subject, body);
        }

        // lấy preorder của user
        public List<PreOrder> getMyPreOrders(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

                return preOrderRepository.findByUser(user);
        }

        public List<PreOrder> getOwnerPreOrders(String email) {
                User owner = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

                return preOrderRepository.findByPost_User_Id(owner.getId());
        }

        // cập nhật trạng thái
        public void updateStatus(Long id, PreOrder.Status status) {
                PreOrder preOrder = preOrderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("PreOrder không tồn tại"));

                preOrder.setStatus(status);
                preOrderRepository.save(preOrder);

                // Gửi email cho người đặt
                String userEmail = preOrder.getUser().getEmail();
                String userName = preOrder.getUser().getUsername();
                String postTitle = preOrder.getPost().getTitle();

                if (status == PreOrder.Status.APPROVED) {
                        String subject = "[NhaTrangStay] Yêu cầu đặt phòng đã được xác nhận";
                        String body = "Xin chào " + userName + ",\n\n"
                                        + "Yêu cầu đặt phòng \"" + postTitle
                                        + "\" của bạn đã được chủ phòng xác nhận.\n\n"
                                        + "Trân trọng,\nNhaTrangStay";
                        emailService.sendEmail(userEmail, subject, body);

                } else if (status == PreOrder.Status.REJECTED) {
                        String subject = "[NhaTrangStay] Yêu cầu đặt phòng bị từ chối";
                        String body = "Xin chào " + userName + ",\n\n"
                                        + "Rất tiếc, yêu cầu đặt phòng \"" + postTitle + "\" của bạn đã bị từ chối.\n\n"
                                        + "Vui lòng tìm phòng khác trên hệ thống.\n\n"
                                        + "Trân trọng,\nNhaTrangStay";
                        emailService.sendEmail(userEmail, subject, body);
                }
        }

        // public void deletePreOrder(Long id) {
        // preOrderRepository.deleteById(id);
        // }
}