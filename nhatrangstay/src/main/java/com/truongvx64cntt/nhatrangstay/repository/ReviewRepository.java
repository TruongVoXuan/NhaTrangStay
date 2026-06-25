package com.truongvx64cntt.nhatrangstay.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.truongvx64cntt.nhatrangstay.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Spring Data JPA sẽ tự động viết câu query SQL để tìm tất cả bình luận theo ID
    // bài viết
    List<Review> findByPostId(Long postId);

    // Kiểm tra xem User này đã từng đánh giá Post này chưa
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.post.id = :postId")
    Double getAvgRatingByPostId(Long postId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.post.id = :postId")
    Long countByPostId(Long postId);
}