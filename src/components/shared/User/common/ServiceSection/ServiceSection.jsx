import "./ServiceSection.scss";
import { useNavigate } from "react-router-dom";
import { Star, SquarePen } from "lucide-react";

function ServiceSection() {
    const navigate = useNavigate();
    const SERVICE = [
        {label: "Chủ nhà & Môi giới", value: "130.000+"},
        {label: "Tin đăng", value: "200.000+"},
        {label: "Tin đăng/ngày", value: "1.000+"},
        {label: "Lượt xem/tháng", value: "3.000.000+"}
    ]
    return (
        <div className="bottom-content">
            <div className="why-title">Tại sao lại chọn NhaTrangStay.com</div>
            <div className="why-content">
                Chúng tôi biết bạn có rất nhiều lựa chọn, nhưng NhaTrangStay.com tự hào là
                trang web đứng top google về các từ khóa: cho thuê phòng trọ, nhà trọ,
                trọ giá rẻ, phòng trọ sinh viên...Vì vậy tin của bạn đăng trên website
                sẽ tiếp cận được với nhiều khách hàng hơn, do đó giao dịch nhanh hơn,
                tiết kiệm chi phí hơn
            </div>
            <div className="info-card">
                {SERVICE.map((item, index) => (
                    <div className="info-card-item" key={index}>
                        <div className="num-title">{item.value}</div>
                        <div className="info-title">{item.label}</div>
                    </div>
                ))}
            </div>
            <div className="cost">Chi phí thấp, hiệu quả tối đa</div>
            <div className="rating">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
            </div>
            <div className="sub-content">
                Trước khi biết website NhaTrangStay, mình phải tốn nhiều công sức và chi phí
                cho việc đăng tin cho thuê: tù việc phát tờ rơi, dán giấy và đăng lên
                các website khác nhưng hiệu quả không cao. Từ kh biết NhaTrangStay.com,
                mình đã thử đăng tin lên và đánh giá hiệu quả khá cao trong khi chi phí
                khá thấp, không còn tình trạng phòng trống kéo dài
            </div>
            <div className="contact">
                - Anh Thành (chủ hệ thống phòng trọ tại Khánh Hòa)
            </div>
            <div className="ask">Bạn đang có phòng trọ cho thuê?</div>
            <div className="find">
                Không phải lo tìm người cho thuê, phòng trống kéo dài
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                    className="post-now-btn"
                    type="button"
                    onClick={() => navigate("/user/post-news")}
                >
                    <span className="post-now-icon">
                        <SquarePen />
                    </span>
                    <span className="post-now">Đăng tin ngay</span>
                </button>
            </div>
        </div>
    );
}
export default ServiceSection;
