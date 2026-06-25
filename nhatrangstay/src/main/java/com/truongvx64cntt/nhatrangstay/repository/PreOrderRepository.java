package com.truongvx64cntt.nhatrangstay.repository;

import com.truongvx64cntt.nhatrangstay.entity.PreOrder;
import com.truongvx64cntt.nhatrangstay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreOrderRepository extends JpaRepository<PreOrder, Long> {

        List<PreOrder> findByUser(User user);

        List<PreOrder> findByPost_User_Id(Long userId);

        boolean existsByPost_IdAndStatus(Long postId, PreOrder.Status status);

        boolean existsByPost_IdAndUser_Id(Long postId, Long userId);

        boolean existsByPost_IdAndUser_IdAndStatusIn(
                        Long postId,
                        Long userId,
                        List<PreOrder.Status> statuses);

        boolean existsByPost_IdAndStatusIn(
                        Long postId,
                        List<PreOrder.Status> statuses);

        void deleteByPostId(Long postId);
}