import React, { createContext, useState, useEffect, useContext} from "react";
import { useAuth } from "hooks/useAuth";
import { favoriteAPI } from "lib/apiService";
import { toast } from "react-toastify";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [likedPostIds, setLikedPostIds] = useState([]);
    const [isLoadingFav, setLoadingFav] = useState(false);

    const favoriteCount = likedPostIds.length;

    useEffect(() => {
        const fetchFavorites = async () => {
            if (isAuthenticated) {
                try {
                    const res = await favoriteAPI.getMyFavorites();
                    const posts = res.data?.content || res.data || [];

                    setLikedPostIds(posts.map((post) => post.id || post.postId));
                } catch (error) {
                    console.error("Không thể tải danh sách yêu thích:", error);
                }
            } else {
                setLikedPostIds([]);
            }
        };
        fetchFavorites();
    }, [isAuthenticated]);

    const toggleFavorite = async (postId) => {
        if (!isAuthenticated) {
            toast.info("Vui lòng đăng nhập để lưu bài viết này!", {
                containerId: "default",
                position: "top-right",
                autoClose: 3000,
            });
            return false;
        }

        const isLiked = likedPostIds.includes(postId);

        try {
            if (isLiked) {
                await favoriteAPI.unlikePost(postId);
                setLikedPostIds((prev) => prev.filter((id) => id !== postId));
                toast.success("Đã bỏ lưu bài viết!", {
                    containerId: "default",
                    autoClose: 1500
                });
            } else {
                await favoriteAPI.likePost(postId);
                setLikedPostIds((prev) => [...prev, postId]);
                toast.success("Đã lưu vào danh sách yêu thích!", {
                    containerId: "default",
                    autoClose: 1500
                });
            }
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
            toast.error(msg, {
                containerId: "errors"
            });
            console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
            return false;
        }
    }

    const value = {
        favoriteCount, likedPostIds, toggleFavorite,
    }

    return (
        <FavoriteContext.Provider value={value}>
            {children}
        </FavoriteContext.Provider>
    );
}

export const useFavorite = () => useContext(FavoriteContext);