import React from "react";
import "./Skeleton.scss";

const Skeleton = ({ width, height, className = "" }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || "100%",
        height: height || "20px",
      }}
    />
  );
};

export default Skeleton;
