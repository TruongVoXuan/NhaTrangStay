import React from "react";
import defaultRoomImg from "assets/images/defaultRoomImg.png";

const RoomImage = ({src, className, alt = "room image"}) => {
    return (
        <img 
            className={className}
            src={src || defaultRoomImg}
            alt={alt} 
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultRoomImg;
            }}
        />
    )
}

export default RoomImage;