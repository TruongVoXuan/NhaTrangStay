package com.truongvx64cntt.nhatrangstay.repository;

import com.truongvx64cntt.nhatrangstay.entity.Favorite;
import com.truongvx64cntt.nhatrangstay.entity.Post;
import com.truongvx64cntt.nhatrangstay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    // Check if this user has already liked this post
    Optional<Favorite> findByUserAndPost(User user, Post post);

    // Check if all room posts that user has already liked
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);

    void deleteByPostId(Long postId);
}
