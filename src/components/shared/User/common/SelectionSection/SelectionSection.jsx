import "./SelectionSection.scss"
import {
    ChevronRight
} from "lucide-react"

function SelectionSection() {
    const ARTICLES = [
        { id: 1, title: "Gợi ý trang trí và tối ưu phòng trọ nhỏ xinh tại Khánh Hòa" },
        { id: 2, title: "Ở trọ Khánh Hòa mùa nắng nóng: Tiền điện còn cao hơn cả tiền phòng" },
        { id: 3, title: "Phòng trọ giá rẻ đang dần biến mất tại các khu trung tâm?" },
        { id: 4, title: "Năm 2025: Người đi làm sẽ ưa chuộng loại phòng trọ nào?" },
        { id: 5, title: "Giá phòng trọ Khánh Hòa tháng 1/2026: Tăng hay giảm? Người thuê nên lưu ý gì?" },
        { id: 6, title: "Sáp nhập tỉnh thành có ảnh hưởng gì đến thị trường cho thuê phòng trọ?" },
    ];
    return(
        <div className="new-article">
            <h3 className="section-title">Bài viết mới</h3>
            <div className="article-list">
                {ARTICLES.map((article) => (
                    <div className="article-item" key={article.id}>
                        <span className="article-icon">
                            <ChevronRight size={16} />
                        </span>
                        <div className="article-title">{article.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default SelectionSection;