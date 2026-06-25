import React, { useEffect, useState } from "react";
import "./ManagePost.scss";
import demo from "assets/images/demo.jpg";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Ellipsis } from "lucide-react";
import { postAPI } from "lib/apiService";
import { useNavigate } from "react-router-dom";
import PopUpDetail from "../PopUpDetail/PopUpDetail";
import { toast } from "react-toastify";

const ManagePost = () => {
  const [selectedPost, setSelectedPost] = useState(null); // Save all the data of the article
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [openStatus, setOpenStatus] = useState(false);
  const [range, setRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate();
  const PAGE_SIZE = 5;

  const openEditPopup = (post) => {
  if (post.status !== "APPROVED") {
    toast.warning("Chỉ có thể chỉnh sửa bài đăng đã được duyệt!");
    return;
  }
  setSelectedPost(post);
  setShowEditPopup(true);
};
  const closePopup = () => {
    setShowEditPopup(false);
    setSelectedPost(null);
    getPostList(currentPage);
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const getPostList = async (page) => {
    try {
      const postsInf = await postAPI.getMyPosts(page);
      setPosts(postsInf.data.content);
    } catch (error) {
      console.log("Lỗi tải danh sách bài đăng:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách bài đăng. Vui lòng thử lại!"
      );
    }
  };

  useEffect(() => {
    getPostList(currentPage);
  }, [currentPage]);

  return (
    <div className="main-manage-post">
      {/* --- Header --- */}
      <div className="order-header">
        <div className="header-left">
          <b className="title">Quản Lý Bài Đăng</b>
        </div>
        <div className="header-right">
          <div className="search-box">
            <div style={{ width: 300, padding: 0 }}>
              <p style={{ textAlign: "center" }}>
                Khoảng giá: {range[0]}tr - {range[1]}tr
              </p>
              <Slider
                range
                min={0}
                max={100}
                defaultValue={[0, 100]}
                onChange={(value) => setRange(value)}
                trackStyle={{ backgroundColor: "#E1A730" }}
                handleStyle={{ borderColor: "#E1A73080", opacity: 1 }} //
              />
            </div>
          </div>

          <div className="date-box">
            <input 
              className="date" 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div
            onClick={() => setOpenStatus(!openStatus)}
            className="status-box"
          >
            <div className="status-container">
              {status === "APPROVED" && <span>ĐÃ DUYỆT</span>}
              {status === "CANCELED" && <span>ĐÃ TỪ CHỐI</span>}
              {status === "REJECTED" && <span>ĐÃ TỪ CHỐI</span>}
              {status === "PENDING" && <span>CHỜ DUYỆT</span>}
              {status === "EXPIRED" && <span>HẾT HẠN</span>}
              {status === "DELETED" && <span>ĐÃ XÓA</span>}
              {status === "LOCKED" && <span>TẠM KHÓA</span>}
              {status === "ALL" && <span>TẤT CẢ</span>}
            </div>
            {openStatus && (
              <div className="drop-status">
                <div onClick={() => { setStatus("ALL"); setOpenStatus(false); }} className="status-top">TẤT CẢ</div>
                <div onClick={() => { setStatus("PENDING"); setOpenStatus(false); }} className="status-top">CHỜ DUYỆT</div>
                <div onClick={() => { setStatus("APPROVED"); setOpenStatus(false); }} className="status">ĐÃ DUYỆT</div>
                {/* <div onClick={() => { setStatus("CANCELED"); setOpenStatus(false); }} className="status">ĐÃ TỪ CHỐI</div> */}
                <div onClick={() => { setStatus("REJECTED"); setOpenStatus(false); }} className="status">ĐÃ TỪ CHỐI</div>
                {/* <div onClick={() => { setStatus("EXPIRED"); setOpenStatus(false); }} className="status">HẾT HẠN</div>
                <div onClick={() => { setStatus("DELETED"); setOpenStatus(false); }} className="status-bottom">ĐÃ XÓA</div> */}
                <div onClick={() => { setStatus("LOCKED"); setOpenStatus(false); }} className="status-bottom">TẠM KHÓA</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* --- Post Content --- */}
      <div className="order-list">
        <div className="main-post-manage-inf">
          <div className="topic-right-manage">
            <div className="img-room-text">ẢNH</div>
            <div>TIÊU ĐỀ BÀI ĐĂNG</div>
            <div>GIÁ THUÊ</div>
            <div>NGÀY GỬI</div>
            <div>TRẠNG THÁI</div>
            <div>CHI TIẾT</div>
          </div>

          {posts.map((post, index) => {
            // 1. Lọc theo Trạng Thái
            const isStatusMatch = post.status === status || status === "ALL";
            
            // 2. Lọc theo Giá Tiền
            const minPrice = range[0] * 1000000;
            const maxPrice = range[1] * 1000000;
            const isPriceMatch = post.price >= minPrice && post.price <= maxPrice;

            // 3.  Lọc theo Ngày Gửi (Date Box)
            let isDateMatch = true; 
            if (selectedDate) {
              // Convert ngày tạo của bài viết (post.createdAt) ra chuẩn YYYY-MM-DD để so sánh
              const postDateObj = new Date(post.createdAt);
              const year = postDateObj.getFullYear();
              const month = String(postDateObj.getMonth() + 1).padStart(2, '0');
              const day = String(postDateObj.getDate()).padStart(2, '0');
              const formattedPostDate = `${year}-${month}-${day}`;

              // Kiểm tra xem ngày của bài viết có khớp với ngày chọn trên thanh filter không
              isDateMatch = formattedPostDate === selectedDate;
            }

            // 4. Tổng hợp: Khớp CẢ 3 điều kiện (Trạng thái + Giá + Ngày) thì mới cho lên hình
            if (isStatusMatch && isPriceMatch && isDateMatch) {
              return (
                <div key={index} className="render-inf-post"  onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="img-post-container">
                    <img 
                      className="img-room" 
                      src={post.images && post.images.length > 0 ? post.images[0].url : demo} 
                      alt={post.title} 
                    />
                  </div>
                  <div className="inf-room">{post.title}</div>
                  <div className="price">{post.price} vnd</div>
                  <div className="post-date">
                    {new Date(post.createdAt).toLocaleDateString("vn-VN")}
                  </div>
                  <div className="status-post">
                    {post.status === "APPROVED" && (
                      <div className="approve-status-background">ĐÃ DUYỆT</div>
                    )}
                    {post.status === "CANCELED" && (
                      <div className="cancel-status-background">ĐÃ TỪ CHỐI</div>
                    )}
                      {post.status === "REJECTED" && (
                      <div className="cancel-status-background">ĐÃ TỪ CHỐI</div>
                    )}
                    {post.status === "PENDING" && (
                      <div className="wait-status-background">CHỜ DUYỆT</div>
                    )}
                    {post.status === "EXPIRED" && (
                      <div className="expired-status-background">HẾT HẠN</div>
                    )}
                    {post.status === "DELETED" && (
                      <div className="deleted-status-background">ĐÃ XÓA</div>
                    )}
                    {post.status === "LOCKED" && (
<div className="locked-status-background">TẠM KHÓA</div>
)}
                  </div>
                  <div className="ellipsis-container">
                   <div
  className="ellipsis"
  onClick={(e) => {
    e.stopPropagation();
    openEditPopup(post);
  }}
>
  <Ellipsis />
</div>
                  </div>
                </div>
              );
            }
          })}
        </div>{" "}
        {/* POPUP EDIT */}
        {showEditPopup && (
          <PopUpDetail
            closePopup={closePopup}
            autoResize={autoResize}
            postData={selectedPost}
          />
        )}
      </div>
    </div>
  );
};

export default ManagePost;