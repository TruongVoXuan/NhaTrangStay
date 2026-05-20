import "./OptionSection.scss"
import {
    ChevronRight
} from "lucide-react";

function OptionSection({ onPriceChange, activePriceRange, onAreaChange, activeAreaRange }) {
    const PRICE_OPTIONS = [
        { label: "Dưới 1 triệu", min: 0, max: 1000000 },
        { label: "Từ 1 - 2 triệu", min: 1000000, max: 2000000 },
        { label: "Từ 2 - 3 triệu", min: 2000000, max: 3000000 },
        { label: "Từ 3 - 5 triệu", min: 3000000, max: 5000000 },
        { label: "Từ 5 - 7 triệu", min: 5000000, max: 7000000 },
        { label: "Từ 7 - 10 triệu", min: 7000000, max: 10000000 },
        { label: "Từ 10 - 15 triệu", min: 10000000, max: 15000000 },
        { label: "Trên 15 triệu", min: 15000000, max: null }
    ];

    const AREA_OPTIONS = [
        { label: "Dưới 20m", unit: "2", min: 0, max: 20 },
        { label: "Từ 20 - 30m", unit: "2", min: 20, max: 30 },
        { label: "Từ 30 - 50m", unit: "2", min: 30, max: 50 },
        { label: "Từ 50 - 70m", unit: "2", min: 50, max: 70 },
        { label: "Từ 70 - 90m", unit: "2", min: 70, max: 90 },
        { label: "Trên 90m", unit: "2", min: 90, max: null }
    ];

    const isPriceActive = (priceOption) => {
        return activePriceRange?.min === priceOption.min && 
               activePriceRange?.max === priceOption.max;
    };

    const isAreaActive = (areaOption) => {
        return activeAreaRange?.min === areaOption.min && 
               activeAreaRange?.max === areaOption.max;
    };

    const handlePriceClick = (priceOption) => {
        if (onPriceChange) {
            onPriceChange({ min: priceOption.min, max: priceOption.max });
        }
    };

    const handleAreaClick = (areaOption) => {
        if (onAreaChange) {
            onAreaChange({ min: areaOption.min, max: areaOption.max });
        }
    };

    return (
        <div className="option-card">
            <div className="filter-section">
                <h3 className="filter-title">Xem theo khoảng giá</h3>
                <div className="filter-grid">
                {PRICE_OPTIONS.map((item, index) => (
                    <div 
                        className={`filter-item ${isPriceActive(item) ? "active" : ""}`}
                        key={index}
                        onClick={() => handlePriceClick(item)}
                    >
                        <ChevronRight size={14} className="filter-icon" />
                        <span className="filter-label">{item.label}</span>
                    </div>
                ))}
                </div>
            </div>

            <div className="filter-section">
                <h3 className="filter-title">Xem theo diện tích</h3>
                <div className="filter-grid">
                {AREA_OPTIONS.map((item, index) => (
                    <div 
                        className={`filter-item ${isAreaActive(item) ? "active" : ""}`}
                        key={index}
                        onClick={() => handleAreaClick(item)}
                    >
                        <ChevronRight size={14} className="filter-icon" />
                        <span className="filter-label">
                            {item.label}<sup>{item.unit}</sup>
                        </span>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}
export default OptionSection;