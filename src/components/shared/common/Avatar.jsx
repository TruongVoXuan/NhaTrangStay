import React from "react";
import defaultAvt from "assets/images/defaultAva.png";

const Avatar = ({src, className, alt = "avatar"}) => {
    return (
        <img 
            className={className}
            src={src || defaultAvt}
            alt={alt} 
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvt;
            }}
        />
    )
}

export default Avatar;