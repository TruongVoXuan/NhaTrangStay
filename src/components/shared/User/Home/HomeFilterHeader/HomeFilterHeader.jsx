import React, { useState, useEffect } from "react";
import "./HomeFilterHeader.scss";

function HomeFilterHeader({
  count = 0,
  onProvinceChange,
  activeProvince,
  onSortChange,
}) {
  const LOCATIONS = [
    "Trung tâm Nha Trang",
    "Tây Nha Trang",
    "Bắc Nha Trang",
    "Nam Nha Trang",
  ];

  const [activeType, setActiveType] = useState("Mới đăng");

  // Debug props
  useEffect(() => {
    console.log("📥 Props nhận vào:");
    console.log("count:", count);
    console.log("activeProvince:", activeProvince);
  }, [count, activeProvince]);

  // ================= LOCATION =================
  const handleProvinceClick = (location) => {
    if (!onProvinceChange) return;

    if (activeProvince === location) {
      onProvinceChange(""); // clear
    } else {
      onProvinceChange(location);
    }
  };

  // ================= SORT =================
  const handleSortClick = (type) => {
  if (!onSortChange) return;

  //  chỉ toggle với "Được đánh giá cao nhất"
  if (
    type === "Được đánh giá cao nhất" &&
    activeType === "Được đánh giá cao nhất"
  ) {
    setActiveType("Mới đăng");
    onSortChange("id,desc");
    return;
  }

  setActiveType(type);

  if (type === "Được đánh giá cao nhất") {
    onSortChange("rating,desc");
  } else {
    onSortChange("id,desc");
  }
};

  return (
    <div className="home-filter-header">
      <h1 className="main-title">Bất Động Sản Uy Tín Số 1 Tại Nha Trang</h1>

      <h4 className="sub-title">
        Có{" "}
        <span className="highlight-number">
          {count.toLocaleString()}
        </span>{" "}
        Tin Đăng Cho Thuê
      </h4>

      <h3 className="section-label">KHU VỰC</h3>

      <div className="area-container">
        {LOCATIONS.map((loc, index) => {
          const isActive = activeProvince === loc;

          return (
            <div
              className={`area-item ${isActive ? "active" : ""}`}
              key={index}
              onClick={() => handleProvinceClick(loc)}
            >
              {/* <span>BĐS</span> */}
              <b>{loc}</b>
            </div>
          );
        })}
      </div>

      <div className="type-selector">
        {["Mới đăng", "Được đánh giá cao nhất"].map((type) => {
          const isActive = activeType === type;

          return (
            <div
              key={type}
              className={`type-item ${isActive ? "active" : ""}`}
              onClick={() => handleSortClick(type)}
            >
              {type}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomeFilterHeader;