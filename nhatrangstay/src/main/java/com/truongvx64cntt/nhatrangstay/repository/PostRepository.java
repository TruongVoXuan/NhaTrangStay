package com.truongvx64cntt.nhatrangstay.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // Bổ sung import
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.truongvx64cntt.nhatrangstay.entity.Post;
import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.enums.PostStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    Page<Post> findByUser(User user, Pageable pageable);

    Page<Post> findByStatus(PostStatus status, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.id = :userId")
    int countPostsByUserId(@Param("userId") Long userId);

    List<Post> findByStatus(PostStatus status);

    List<Post> findAllByOrderByCreatedAtDesc();

    // Chart data
    @Query("""
                SELECT MONTH(p.createdAt), COUNT(p)
                FROM Post p
                WHERE p.status = 'APPROVED'
                GROUP BY MONTH(p.createdAt)
                ORDER BY MONTH(p.createdAt)
            """)
    List<Object[]> countApprovedPostsByMonth();

    // Data bài đăng gần đây nhất (3 bài)
    List<Post> findTop5ByStatusOrderByUpdatedAtDesc(PostStatus status);

    // Lịch sử bài đăng của user theo tháng
    @Query("""
                SELECT p
                FROM Post p
                WHERE p.createdAt >= :start
                AND p.createdAt < :end
                ORDER BY p.createdAt DESC
            """)
    List<Post> findPostsByMonthRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    List<Post> findByStatusIn(List<PostStatus> statuses);

}