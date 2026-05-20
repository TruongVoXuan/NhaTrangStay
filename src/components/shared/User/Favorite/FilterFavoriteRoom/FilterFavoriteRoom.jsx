import React, { useState } from "react";
import { Filter, BellRing } from "lucide-react";
import "./FilterFavoriteRoom.scss";

const FilterFavoriteRoom = ({ onApplyFilters }) => {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");

  // ===== PRICE OPTIONS =====
  const priceOptions = [
    { label: "Dưới 3 triệu", min: 0, max: 3000000 },
    { label: "3 - 5 triệu", min: 3000000, max: 5000000 },
    { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
    { label: "Trên 10 triệu", min: 10000000, max: Infinity },
  ];

  // ===== AREA OPTIONS =====
  const areaOptions = [
    "Trung tâm Nha Trang",
    "Bắc Nha Trang",
    "Tây Nha Trang",
    "Nam Nha Trang"
  ];

  // ===== APPLY FILTER =====
  const handleApply = () => {
    onApplyFilters({
      price: selectedPrice,
      area: selectedArea
    });
  };

  // ===== CLEAR FILTER =====
  const handleClear = () => {
    setSelectedPrice(null);
    setSelectedArea("");
    onApplyFilters({});
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-box">
        
        {/* HEADER */}
        <div className="filter-header">
          <h2>Bộ lọc</h2>
          <button className="btn-clear" onClick={handleClear}>
            Xóa lọc
          </button>
        </div>

        {/* ===== PRICE FILTER ===== */}
        <div className="filter-group">
          <h3>Khoảng giá</h3>
          <div className="options">
            {priceOptions.map((p) => (
              <label key={p.label} className="radio-label group">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice?.label === p.label}
                  onChange={() => setSelectedPrice(p)}
                />
                <span className={selectedPrice?.label === p.label ? "selected" : ""}>
                  {p.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ===== AREA FILTER ===== */}
        <div className="filter-group">
          <h3>Khu vực</h3>
          <div className="options">
            {areaOptions.map((area) => (
              <label key={area} className="radio-label group">
                <input
                  type="radio"
                  name="area"
                  checked={selectedArea === area}
                  onChange={() => setSelectedArea(area)}
                />
                <span className={selectedArea === area ? "selected" : ""}>
                  {area}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* APPLY BUTTON */}
        <button className="btn-apply" onClick={handleApply}>
          <Filter size={18} /> Áp dụng bộ lọc
        </button>
      </div>

      {/* PROMO */}
      <div className="promo-banner group">
        <div className="promo-content">
          <h4>Tìm nhà nhanh hơn?</h4>
          <p>Đăng ký nhận thông báo khi có căn hộ mới phù hợp với bạn.</p>
          <button>Đăng ký ngay</button>
        </div>
        <BellRing className="promo-icon" size={120} />
      </div>
    </aside>
  );
};

export default FilterFavoriteRoom;