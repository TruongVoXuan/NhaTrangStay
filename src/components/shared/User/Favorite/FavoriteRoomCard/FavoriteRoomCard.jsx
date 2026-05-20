import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, SquareSquare } from "lucide-react";
import { useFavorite } from "../../../../contexts/FavoriteContext";
import { toast } from "react-toastify";
import RoomImage from "components/shared/common/RoomImg";
import "./FavoriteRoomCard.scss";

// === SKELETION LOADER === //
export const FavoriteCardSkeleton = () => (
    <div className="favorite-card skeleton">
        <div className="skeleton-img pulse"></div>
        <div className="card-body">
            <div className="skeleton-price pulse"></div>
            <div className="skeleton-title pulse"></div>
            <div className="skeleton-location pulse"></div>
            <div className="skeleton-features">
                <div className="pulse"></div>
                <div className="pulse"></div>
                <div className="pulse"></div>
            </div>
            <div className="skeleton-btn pulse"></div>
        </div>
    </div>
);

// === MAIN === //
const FavoriteRoomCard = ({ post, onRemoveSuccess }) => {
    const navigate = useNavigate();
    const { toggleFavorite } = useFavorite();

    const { 
        id, 
        title, 
        price, 
        area, 
        address, 
        roomQuantity,
        images = [],
        type
    } = post || {};

    const displayLocation = address || "Chưa cập nhật";

    const getImg = (index) => images[index]?.url || images[index]  || null;

    const handleUnlike = async (e) => {
        e.stopPropagation();
        try {
            const success = await toggleFavorite(id);
            if (success) {
                onRemoveSuccess(id);
            }
        } catch (error) {
            toast.error("Không thể gỡ phòng khỏi danh sách. Vui lòng thử lại!",{
                containerId: "error"
            });
        }
    }

    return (
        <div className="favorite-card group" onClick={() => navigate(`/posts/${id}`)}>
            <div className="card-img-wrapper">
                <RoomImage src={getImg(0)} alt={title} className="card-img" />
            
                <button className="heart-btn" onClick={handleUnlike} title="Bỏ lưu phòng này">
                    <Heart size={20} fill="#8C161F" stroke="#8C161F" />
                </button>

                {type && <span className="badge-type">{type.type_name || "Phòng"}</span>}
            </div>

            <div className="card-body">
                <div className="price">{price?.toLocaleString()}đ/tháng</div>
                <h3 className="title text-truncate-2">{title}</h3>

                <div className="location">
                    <MapPin size={14} /> {displayLocation}
                </div>

                <div className="features">

                </div>

                <button className="btn-detail" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/posts/${id}`);
                }}>
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
;}

export default FavoriteRoomCard;