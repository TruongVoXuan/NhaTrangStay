package com.truongvx64cntt.nhatrangstay.service;

import com.truongvx64cntt.nhatrangstay.entity.Favorite;
import com.truongvx64cntt.nhatrangstay.entity.Post;
import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.repository.FavoriteRepository;
import com.truongvx64cntt.nhatrangstay.repository.PostRepository;
import com.truongvx64cntt.nhatrangstay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

        @Autowired
        private FavoriteRepository favoriteRepository;

        @Autowired
        private PostRepository postRepository;

        @Autowired
        private UserRepository userRepository;

        public void likePost(Long postId, Long userId) {
                User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                if (favoriteRepository.findByUserAndPost(user, post).isPresent()) {
                        throw new RuntimeException("Bạn đã thêm vào mục Yêu thích!");
                }

                Favorite favorite = new Favorite();
                favorite.setUser(user);
                favorite.setPost(post);
                favoriteRepository.save(favorite);
        }

        public void unlikePost(Long postId, Long userId) {
                User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                Favorite favorite = favoriteRepository.findByUserAndPost(user, post)
                                .orElseThrow(() -> new RuntimeException("Bạn chưa thêm vào mục Yêu thích!"));

                favoriteRepository.delete(favorite);
        }

        // Đổi thành Long userId
        public List<Post> getMyFavorites(Long userId) {
                User user = this.userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Favorite> favorites = favoriteRepository.findByUserOrderByCreatedAtDesc(user);

                return favorites.stream().map(Favorite::getPost).collect(Collectors.toList());
        }
}
