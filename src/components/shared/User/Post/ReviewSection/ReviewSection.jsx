import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Star, User, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { reviewAPI } from "lib/apiService";
import { isAuthenticated } from "lib/auth";
import "./ReviewSection.scss";

const ReviewSection = ({ postId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewAPI.getReviewsByPost(postId);

      setReviews(res.data?.content || res.data || []);
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchReviews();
    }
  }, [postId]);

  const handleRequireLogin = () => {
    if (!isAuthenticated()) {
      toast.warning("Vui lòng đăng nhập để viết đánh giá nhé!", { containerId: "default" });
      return false;
    }
    return true;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!handleRequireLogin()) return;
    if (newRating === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá!", { containerId: "default" });
      return;
    }

    if (!newComment.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá!", { containerId: "default" });
      return;
    }

    try {
      const payload = {
        postId: postId,
        rating: newRating,
        content: newComment,
      };

      await reviewAPI.createReview(payload);
      toast.success("Gửi đánh giá thành công!", { containerId: "default" });

      setNewComment("");
      setNewRating(0);
      fetchReviews();
    } catch (error) {
      const responseData = error.response?.data;
      const errorMessage = responseData?.message || responseData || "Lỗi khi gửi đánh giá. Có thể bạn chưa đăng nhập!";
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Bạn đã đánh giá bài đăng này rồi!", { containerId: "default" });
    }
  };

  const groupedReviews = reviews.reduce((acc, review) => {
  const userId = review.user?.id || "anonymous";

  if (!acc[userId]) {
    acc[userId] = {
      user: review.user,
      reviews: [],
    };
  }

  acc[userId].reviews.push(review);

  return acc;
}, {});

  return (
    <div className="review-section-container">
      <h3 className="review-title">
        Đánh giá từ người thuê ({reviews.length})
      </h3>

      {/* --- FORM VIẾT ĐÁNH GIÁ --- */}
      <form className="review-form" onSubmit={handleSubmitReview}>
        <div className="rating-selector">
          <span>Đánh giá của bạn:</span>
          <div className="stars" role="radiogroup" aria-label="Chọn số sao">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} sao`}
                aria-pressed={star <= (hoverRating || newRating)}
                className={`star-button ${star <= (hoverRating || newRating) ? "active" : ""}`}
                onMouseEnter={() => isAuthenticated() && setHoverRating(star)}
                onMouseLeave={() => isAuthenticated() && setHoverRating(0)}
                onClick={() => {
                  if (!handleRequireLogin()) return;
                  if (newRating === star) {
                    setNewRating(0);
                    setHoverRating(0);
                  } else {
                    setNewRating(star);
                  }
                }}
              >
                <Star 
                  size={24} 
                  className="star-icon" 
                  fill={star <= (hoverRating || newRating) ? "#E1A730" : "none"}
                  color={star <= (hoverRating || newRating) ? "#E1A730" : "#ccc"}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <textarea
            placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ này..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
          />
          <button type="submit" className="btn-submit-review">
            <Send size={18} /> Gửi
          </button>
        </div>
      </form>

      {/* --- DANH SÁCH ĐÁNH GIÁ --- */}
      <div className="review-list">
        {loading ? (
          <p className="loading-text">Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="empty-text">
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
          </p>
        ) : (
          // reviews.map((rev, index) => (
          //   <div key={rev.id || index} className="review-item">
          //     <div className="reviewer-avatar">
          //       {rev.user?.avatar ? (
          //         <img src={rev.user.avatar} alt="avatar" />
          //       ) : (
          //         <User size={24} color="#666" />
          //       )}
          //     </div>
          //     <div className="review-content-box">
          //       <div className="review-header">
          //         <span className="reviewer-name">
          //           {rev.user?.username || "Người dùng ẩn danh"}
          //         </span>
          //         <span className="review-date">
          //           {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
          //         </span>
          //       </div>
          //       <div className="review-stars">
          //         {/* Hiển thị số sao của comment này */}
          //         {[...Array(5)].map((_, i) => (
          //           <Star
          //             key={i}
          //             size={14}
          //             className={
          //               i < (rev.rating || 5) ? "star-active" : "star-inactive"
          //             }
          //           />
          //         ))}
          //       </div>
          //       <p className="review-text">{rev.content || rev.comment}</p>
          //     </div>
          //   </div>
          // ))

          Object.values(groupedReviews).map((group, groupIndex) => (
  <div key={group.user?.id || groupIndex} className="review-group">

    <div className="review-group-header">
      <div className="reviewer-avatar">
        {group.user?.avatar ? (
          <img src={group.user.avatar} alt="avatar" />
        ) : (
          <User size={24} color="#666" />
        )}
      </div>

      <div className="reviewer-name">
        {group.user?.username || "Người dùng ẩn danh"}
      </div>
    </div>

    {group.reviews.map((rev, index) => (
      <div key={rev.id || index} className="review-item nested">

        <div className="review-content-box">
          <div className="review-header">
            <span className="review-date">
              {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="review-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < (rev.rating || 5)
                    ? "star-active"
                    : "star-inactive"
                }
              />
            ))}
          </div>

          <p className="review-text">
            {rev.content || rev.comment}
          </p>

        </div>
      </div>
    ))}
  </div>
))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
