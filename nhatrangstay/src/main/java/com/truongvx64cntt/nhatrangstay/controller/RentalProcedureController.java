package com.truongvx64cntt.nhatrangstay.controller;

import com.truongvx64cntt.nhatrangstay.entity.PreOrder;
import com.truongvx64cntt.nhatrangstay.service.PreOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rental-procedures")
@RequiredArgsConstructor
public class RentalProcedureController {

    private final PreOrderService preOrderService;

    // ĐẶT LỊCH (FIX CHÍNH Ở ĐÂY)
    @PostMapping("/register-view/{postId}")
    public String registerView(
            @PathVariable Long postId,
            Authentication authentication) {
        String email = authentication.getName();

        System.out.println(">>> CALL REGISTER VIEW");

        preOrderService.createPreOrder(
                postId,
                email,
                LocalDateTime.now());

        System.out.println(">>> SAVED PREORDER");

        return "Đặt lịch thành công";
    }

    // LẤY DANH SÁCH
    @GetMapping("/my-requests")
    public List<PreOrder> getMyRequests(Authentication authentication) {
        String email = authentication.getName();
        return preOrderService.getMyPreOrders(email);
    }

    // CHỦ NHÀ XEM NGƯỜI KHÁC ĐẶT PHÒNG CỦA MÌNH
    @GetMapping("/owner-requests")
    public List<PreOrder> getOwnerRequests(Authentication authentication) {
        String email = authentication.getName();
        return preOrderService.getOwnerPreOrders(email);
    }

    // Xác nhận and hủy đặt lịch
    @PutMapping("/approve/{id}")
    public String approvePreOrder(@PathVariable Long id) {
        preOrderService.updateStatus(id, PreOrder.Status.APPROVED);
        return "Approved";
    }

    // @DeleteMapping("/reject/{id}")
    // public String rejectPreOrder(@PathVariable Long id) {
    // preOrderService.deletePreOrder(id);
    // return "Deleted";
    // }

    @PutMapping("/reject/{id}")
    public String rejectPreOrder(@PathVariable Long id) {
        preOrderService.updateStatus(id, PreOrder.Status.REJECTED);
        return "Rejected";
    }

    @PutMapping("/cancel/{id}")
    public String cancelContract(@PathVariable Long id) {

        preOrderService.cancelPreOrder(id);

        return "Cancelled";
    }

}