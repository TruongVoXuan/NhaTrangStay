import React from "react";
import { Camera, Star, StarHalf, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "components/contexts/FavoriteContext";
import "./RoomCard.scss";
import Avatar from "components/shared/common/Avatar";
import RoomImage from "components/shared/common/RoomImg";
import { useEffect, useState } from "react";
function RoomCard({ data }) {
  const navigate = useNavigate();
 console.log("DATA:", data);
  console.log("REVIEWS:", data?.reviews);

  const [rating, setRating] = useState(0);
const [reviewCount, setReviewCount] = useState(0);
  const {
    id,
    title = "Tiêu đề đang cập nhật",
    price = 0,
    area = 0,
    address,
    location,
    description = "Chưa có mô tả nào cho phòng này.",
    images = [],
    user,
    landlord,
    createdAt,
    postDate,
  } = data || {};

  // ==============================
  //  FIX RATING FROM REVIEWS
  // ==============================
  useEffect(() => {
  if (!id) return;

  fetch(`http://localhost:8080/api/reviews/post/${id}`)
    .then(res => {
      console.log("STATUS:", res.status); //  thêm dòng này để kiểm tra status code
      return res.json();
    })
    .then(data => {
      console.log("DATA:", data);

      if (!data || data.length === 0) {
        setRating(0);
        setReviewCount(0);
        return;
      }

      const avg =
        data.reduce((sum, r) => sum + (r.rating || 0), 0) / data.length;

      setRating(avg);
      setReviewCount(data.length);
    })
    .catch(err => console.error(err));
}, [id]);

  const { likedPostIds, toggleFavorite } = useFavorite();
  const isLiked = likedPostIds.includes(id);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  const owner = user || landlord || {};
  const displayLocation = address || location || "Chưa có địa chỉ nào";

  const displayDate =
    createdAt || postDate
      ? new Date(createdAt || postDate).toLocaleDateString("vi-VN")
      : "Chưa có ngày đăng";

  const getImg = (index) =>
    images[index]?.url || images[index] || null;

  return (
    <div className="view-room-card">
      <div className="room-card" onClick={() => navigate(`/posts/${id}`)}>

        {/* ================= IMAGE ================= */}
        <div className="room-image-container">
          <div className="main-image">
            <RoomImage src={getImg(0)} alt={title} />
            <div className="image-count">
              <Camera size={14} /> {images.length || 0}
            </div>
          </div>

          <div className="sub-images">
            <div className="sub-image-item">
              <RoomImage src={getImg(1)} alt={title} />
            </div>
            <div className="sub-image-group-bottom">
              <div className="sub-image-item">
                <RoomImage src={getImg(2)} alt={title} />
              </div>
              <div className="sub-image-item">
                <RoomImage src={getImg(3)} alt={title} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="room-details">
          <div className="head-row">
            <h2 className="room-title">{title}</h2>

            <div className="room-rating">
              {reviewCount === 0 ? (
                <span className="no-rating">Chưa có đánh giá</span>
              ) : (
                <>
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;

                    if (rating >= starValue) {
                      return (
                        <Star
                          key={i}
                          size={26}
                          fill="#E1A730"
                          color="#E1A730"
                        />
                      );
                    } else if (rating >= starValue - 0.5) {
                      return (
                        <StarHalf
                          key={i}
                          size={26}
                          fill="#E1A730"
                          color="#E1A730"
                        />
                      );
                    } else {
                      return (
                        <Star
                          key={i}
                          size={26}
                          fill="none"
                          color="#ccc"
                        />
                      );
                    }
                  })}

                  <span className="rating-number">
                    ({rating.toFixed(1)} ⭐ {reviewCount})
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="details-group">
            <div className="room-price">
              {price.toLocaleString()}đ/tháng
            </div>
            <span className="divider-dot">&bull;</span>
            <div className="room-area">
              {area}m<sup>2</sup>
            </div>
            <span className="divider-dot">&bull;</span>
            <div className="room-location">
              {displayLocation}
            </div>
          </div>

          <div className="room-description text-truncate">
            {description}
          </div>
        </div>

        {/* ================= LANDLORD ================= */}
        <div className="landlord-info">
          <div className="landlord-profile">
            <Avatar
              src={owner.avatar}
              alt={owner.username || owner.name}
              className="landlord-avatar"
            />
            <div className="landlord-name-group">
              <div className="landlord-name">
                {owner.username || owner.name || "Chủ phòng"}
              </div>
              <div className="post-day">{displayDate}</div>
            </div>
          </div>

          <div className="landlord-contact-group">
            <div className="landlord-contact">
              {owner.phone || "09xxxxxxx"}
            </div>

            <div className="heart-icon" onClick={handleHeartClick}>
              <Heart
                size={24}
                fill={isLiked ? "#FF4D4D" : "none"}
                color={isLiked ? "#FF4D4D" : "#666"}
                style={{ transition: "all 0.3s ease" }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RoomCard;