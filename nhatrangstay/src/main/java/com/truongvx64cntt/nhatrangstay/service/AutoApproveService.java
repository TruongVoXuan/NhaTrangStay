package com.truongvx64cntt.nhatrangstay.service;

import com.truongvx64cntt.nhatrangstay.entity.Image;
import com.truongvx64cntt.nhatrangstay.entity.Post;
import com.truongvx64cntt.nhatrangstay.enums.PostStatus;
import com.truongvx64cntt.nhatrangstay.repository.PostRepository;
import com.truongvx64cntt.nhatrangstay.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class AutoApproveService {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private EmailService emailService;
    @Value("${openrouter.api.key}")
    private String openrouterApiKey;
    private final RestTemplate restTemplate = new RestTemplate();

    // ==========================================
    // MAIN
    // isUpdate = false: đăng bài mới
    // isUpdate = true: chỉnh sửa bài
    // ==========================================
    public void autoReview(Post post, boolean isUpdate) {
        try {
            System.out.println("🤖 AutoReview bắt đầu cho post: " + post.getId() + " | isUpdate: " + isUpdate);
            String result = callAI(post);
            System.out.println("🤖 AI kết quả: " + result);
            // Fetch lại post mới từ DB để tránh lỗi detached entity
            Post freshPost = postRepository.findById(post.getId())
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            if (result.startsWith("APPROVED")) {
                freshPost.setStatus(PostStatus.APPROVED);
                postRepository.save(freshPost);
                // Chỉ gửi mail khi đăng bài MỚI, không gửi khi update hợp lệ
                if (!isUpdate) {
                    emailService.sendEmail(
                            freshPost.getUser().getEmail(),
                            "[NhaTrangStay] Bài đăng của bạn đã được duyệt tự động ✅",
                            "Xin chào " + freshPost.getUser().getUsername() + ",\n\n"
                                    + "Bài đăng \"" + freshPost.getTitle()
                                    + "\" của bạn đã được hệ thống duyệt tự động.\n"
                                    + "Bài đăng hiện đã hiển thị trên NhaTrangStay.\n\n"
                                    + "Trân trọng,\nNhaTrangStay");
                }
                System.out.println(" Auto APPROVED post: " + freshPost.getId());
            } else {
                String reason = result.contains("|")
                        ? result.split("\\|", 2)[1].trim()
                        : "Nội dung không phù hợp với tiêu chuẩn cộng đồng";
                freshPost.setStatus(PostStatus.REJECTED);
                postRepository.save(freshPost);
                if (isUpdate) {
                    // Bài bị reject sau khi chỉnh sửa
                    emailService.sendEmail(
                            freshPost.getUser().getEmail(),
                            "[NhaTrangStay] Bài đăng của bạn bị ẩn do vi phạm sau khi chỉnh sửa ❌",
                            "Xin chào " + freshPost.getUser().getUsername() + ",\n\n"
                                    + "Bài đăng \"" + freshPost.getTitle()
                                    + "\" vừa được chỉnh sửa đã bị hệ thống phát hiện vi phạm.\n\n"
                                    + "Lý do: " + reason + "\n\n"
                                    + "Bài đăng đã bị ẩn khỏi danh sách. Vui lòng chỉnh sửa lại nội dung phù hợp.\n"
                                    + "Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ admin.\n\n"
                                    + "Trân trọng,\nNhaTrangStay");
                } else {
                    // Bài bị reject khi đăng mới
                    emailService.sendEmail(
                            freshPost.getUser().getEmail(),
                            "[NhaTrangStay] Bài đăng của bạn bị từ chối ",
                            "Xin chào " + freshPost.getUser().getUsername() + ",\n\n"
                                    + "Bài đăng \"" + freshPost.getTitle()
                                    + "\" của bạn đã bị hệ thống từ chối tự động.\n\n"
                                    + "Lý do: " + reason + "\n\n"
                                    + "Vui lòng chỉnh sửa nội dung và đăng lại.\n"
                                    + "Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ admin.\n\n"
                                    + "Trân trọng,\nNhaTrangStay");
                }
                System.out.println(" Auto REJECTED post: " + freshPost.getId() + " | Lý do: " + reason);
            }
        } catch (Exception e) {
            System.out.println(" AutoReview lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ==========================================
    // GỌI OPENROUTER API (GEMINI 2.5 FLASH IMAGE)
    // ==========================================
    private String callAI(Post post) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openrouterApiKey);
        headers.set("HTTP-Referer", "http://localhost:3000");
        headers.set("X-Title", "NhaTrangStay");
        List<Map<String, Object>> contentList = new ArrayList<>();
        // 1. Text prompt
        String textPrompt = """
                Bạn là hệ thống kiểm duyệt bài đăng cho thuê phòng tại NhaTrangStay Việt Nam.
                Hãy kiểm tra bài đăng sau và trả về ĐÚNG 1 trong 2 định dạng:
                - Nếu hợp lệ: APPROVED
                - Nếu vi phạm: REJECTED|<lý do cụ thể bằng tiếng Việt>
                KHÔNG giải thích thêm gì khác. Chỉ trả về đúng định dạng trên.
                Tiêu chí TỪ CHỐI:
                1. Tiêu đề hoặc mô tả chứa từ ngữ bạo lực, tục tĩu, xúc phạm
                2. Nội dung bôi nhọ, phân biệt chủng tộc, kỳ thị giới tính
                3. Quảng cáo lừa đảo, nội dung scam, cam kết phi thực tế
                4. Chứa link website ngoài hoặc spam trong mô tả
                5. Ảnh chứa nội dung bạo lực, kinh dị, nhạy cảm 18+
                Lưu ý quan trọng:
                - CHỈ xét nội dung text (tiêu đề, mô tả). KHÔNG đánh giá chất lượng hay tính xác thực của ảnh.
                - Với ảnh, CHỈ từ chối nếu có nội dung bạo lực, kinh dị, hoặc nhạy cảm 18+ rõ ràng.
                - KHÔNG từ chối vì ảnh là ảnh tổng hợp, stock photo, hay không phải ảnh thật của phòng.
                - KHÔNG từ chối vì ảnh có chứa số điện thoại hoặc watermark.
                Thông tin bài đăng cần kiểm duyệt:
                Tiêu đề: %s
                Mô tả: %s
                Địa chỉ: %s
                """.formatted(post.getTitle(), post.getDescription(), post.getAddress());
        Map<String, Object> textContent = new HashMap<>();
        textContent.put("type", "text");
        textContent.put("text", textPrompt);
        contentList.add(textContent);
        // 2. Thêm ảnh nếu có
        if (post.getImages() != null && !post.getImages().isEmpty()) {
            for (Image img : post.getImages()) {
                try {
                    byte[] imageBytes = new RestTemplate().getForObject(img.getUrl(), byte[].class);
                    if (imageBytes != null) {
                        String base64 = Base64.getEncoder().encodeToString(imageBytes);
                        String mediaType = "image/jpeg";
                        String url = img.getUrl().toLowerCase();
                        if (url.endsWith(".png"))
                            mediaType = "image/png";
                        else if (url.endsWith(".webp"))
                            mediaType = "image/webp";
                        else if (url.endsWith(".gif"))
                            mediaType = "image/gif";
                        Map<String, Object> imageContent = new HashMap<>();
                        imageContent.put("type", "image_url");
                        imageContent.put("image_url", Map.of(
                                "url", "data:" + mediaType + ";base64," + base64));
                        contentList.add(imageContent);
                        System.out.println(" Đã thêm ảnh: " + img.getUrl());
                    }
                } catch (Exception e) {
                    System.out.println(" Skip ảnh lỗi: " + img.getUrl());
                }
            }
        }
        // Build message & body
        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", contentList);
        Map<String, Object> body = new HashMap<>();
        body.put("model", "google/gemini-2.5-flash-image");
        body.put("max_tokens", 150);
        body.put("messages", List.of(message));
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://openrouter.ai/api/v1/chat/completions",
                HttpMethod.POST,
                request,
                Map.class);
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> msg = (Map<String, Object>) choices.get(0).get("message");
        return msg.get("content").toString().trim();
    }
}