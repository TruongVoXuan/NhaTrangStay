import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Check,
  X,
  CalendarDays,
} from "lucide-react";

import { postAPI } from "lib/apiService";
import { toast } from "react-toastify";
import ava from "assets/images/avatar1.png";
import { Trash2 } from "lucide-react";
import "./PendingPostsPage.scss";

const PendingPostsPage = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const [showUnlockModal, setShowUnlockModal] = useState(false);
const [selectedPostId, setSelectedPostId] = useState(null);

const [currentPage, setCurrentPage] = useState(1);

const POSTS_PER_PAGE = 3;

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const response = await postAPI.getPendingPosts();

        const data =
          response.data?.content ||
          response.data?.data ||
          response.data ||
          [];

        setPosts(data);
      } catch (error) {
        console.error(" Lỗi load bài đăng chờ duyệt:", error);
      }
    };

    fetchPendingPosts();
  }, []);


 const handleApprove = async (id) => {
  try {
    await postAPI.approvePost(id);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status: "APPROVED" } : p));
    toast.success("Đã duyệt bài đăng!"); // ← thêm
  } catch (err) {
    console.error("Approve lỗi", err);
    toast.error("Duyệt thất bại!"); // ← thêm
  }
};

const handleReject = async (id) => {
  try {
    await postAPI.rejectPost(id);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "REJECTED" }
          : p
      )
    );
    toast.success("Đã từ chối bài đăng!"); // ← thêm
  } catch (err) {
    console.error("Reject lỗi", err);
    toast.error("Từ chối thất bại!"); // ← thêm
  }
};

const handleLock = async (id) => {
  try {
    await postAPI.lockPost(id);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status: "LOCKED" } : p));
    toast.success("Đã khóa bài đăng và thông báo tới chủ trọ!");
  } catch (err) {
    toast.error("Khóa thất bại!");
  }
};

const confirmUnlock = async () => {
  try {
    await postAPI.unlockPost(selectedPostId);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === selectedPostId
          ? { ...p, status: "APPROVED" }
          : p
      )
    );

    toast.success("Đã mở khóa bài đăng!");

    setShowUnlockModal(false);
    setSelectedPostId(null);

  } catch (err) {
    toast.error("Mở khóa thất bại!");
  }
};

  const filteredPosts = posts.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );


  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;

const currentPosts = filteredPosts.slice(
  indexOfFirstPost,
  indexOfLastPost
);

const totalPages = Math.ceil(
  filteredPosts.length / POSTS_PER_PAGE
);


//  PHÂN TRANG
const getPaginationPages = () => {
  let startPage = Math.max(currentPage - 2, 1);
  let endPage = startPage + 4;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - 4, 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
};

  return (
    <>
{showUnlockModal && (
  <div className="unlock-modal-overlay">
    <div className="unlock-modal">
      <h3>Xác nhận mở khóa bài đăng?</h3>

      <p>
        Bài đăng này trước đó đã bị từ chối vì có thể chứa:
      </p>

      <ul>
        <li>Nội dung phản cảm hoặc không phù hợp</li>
        <li>Ngôn từ bạo lực, xúc phạm</li>
        <li>Hình ảnh không chuẩn mực</li>
        <li>Thông tin gây hiểu nhầm</li>
      </ul>

      <p>
        Việc mở khóa sẽ cho phép bài đăng hiển thị công khai trở lại.
      </p>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => setShowUnlockModal(false)}
        >
          Hủy
        </button>

        <button
          className="confirm-btn"
          onClick={confirmUnlock}
        >
          Vẫn mở khóa
        </button>
      </div>
    </div>
  </div>
)}
    <div className="pending-posts-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Thống Kê</h2>
          <p>Thông tin sẽ được cập nhật hàng ngày</p>
        </div>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select>
          <option>Mọi Giá</option>
        </select>

        <button className="filter-btn">Tìm</button>
      </div>

      {/* LIST */}
      <div className="post-list">
        {filteredPosts.length === 0 ? (
          <p>Không có bài đăng chờ duyệt</p>
        ) : (
          currentPosts.map((p) => (
            <div className="post-card" key={p.id}>
                <button
  className="delete-card-btn"
  onClick={() =>
    setPosts((prev) =>
      prev.filter((item) => item.id !== p.id)
    )
  }
>
  <X size={18} />
</button>
              {/* IMAGE */}
              <div
                className="image-box"
                onClick={() => navigate(`/post/${p.id}`)}
              >
                <img
                  src={p.images?.[0]?.url || ava}
                  alt=""
                />
              </div>

              {/* INFO */}
              <div
                className="post-info"
                onClick={() => navigate(`/post/${p.id}`)}
              >
                <h3>{p.title}</h3>
                <p className="owner">
  Người đăng:{" "}
  <span>
    {p.user?.fullName ||
      p.user?.username ||
      "Ẩn danh"}
  </span>
</p>

                <p className="location">
                  📍 {p.location || p.address}
                </p>

                <h2 className="price">
                  {p.price?.toLocaleString()}
                </h2>

                <span>VND / tháng</span>

                <div className="bottom-info">
                  <div className="date">
                    <CalendarDays size={16} />
                    <span>
                      {p.createdAt?.slice(0, 10)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className="action-buttons">
  {p.status === "LOCKED" ? (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
<button className="locked-disabled" disabled>
      Đang bị khóa
</button>
<button
  className="unlock-btn"
  onClick={() => {
    setSelectedPostId(p.id);
    setShowUnlockModal(true);
  }}
>
  Mở khóa
</button>
</div>
  ) : p.status === "APPROVED" ? (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
<button className="approved-disabled" disabled>
        Đã Chấp Thuận
</button>
<button className="lock-btn" onClick={() => handleLock(p.id)}>
        Khóa bài
</button>
</div>
) : p.status === "REJECTED" ? (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
  <button className="rejected-disabled" disabled>
    Đã Từ Chối
  </button>

  <button
    className="unlock-btn"
    onClick={() => {
      setSelectedPostId(p.id);
      setShowUnlockModal(true);
    }}
  >
    Mở khóa
  </button>
</div>
) : (
<>
<button className="approve-btn" onClick={() => handleApprove(p.id)}>
<Check size={16} />
        Approve
</button>
<button className="reject-btn" onClick={() => handleReject(p.id)}>
<X size={16} />
        Reject
</button>
</>
  )}
 
  <button className="view-btn" onClick={() => navigate(`/post/${p.id}`)}>
<Eye size={16} />
    Xem
</button>
</div>
            </div>
          ))
        )}
      </div>
      <div className="pagination">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

 
{/* PHÂN TRANG */}
  {getPaginationPages().map((page) => (
  <button
    key={page}
    className={
      currentPage === page
        ? "active-page"
        : ""
    }
    onClick={() => setCurrentPage(page)}
  >
    {page}
  </button>
))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
</div>
    </div>

    </>
  );

  
};

export default PendingPostsPage;