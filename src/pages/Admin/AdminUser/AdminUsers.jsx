import React, { useEffect, useState } from "react";
import { userAPI } from "lib/apiService";
import { Eye, Lock, Trash2 } from "lucide-react";

import "./AdminUsers.scss";
import ava from "assets/images/avatar1.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);
const [userPosts, setUserPosts] = useState([]);

const handleViewPosts = async (user) => {
  try {
    console.log("CLICK USER:", user.id);

    const res = await userAPI.getPostsByUser(user.id);

    //  vì backend trả Page<Post>
    const data = res.data?.content || res.data || [];

    setSelectedUser(user);
    setUserPosts(data);
  } catch (err) {
    console.error(" Lỗi load posts:", err);
  }
};

  //  load users
  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();

      //  handle mọi kiểu response
      const data = res.data?.data || res.data || [];
      setUsers(data);
    } catch (err) {
      console.error(" Lỗi load users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //  filter local
  const filteredUsers = users.filter((u) => {
    const kw = keyword.toLowerCase();
    return (
        u.fullName?.toLowerCase().includes(kw) ||   // ưu tiên
    u.username?.toLowerCase().includes(kw) ||
    u.email?.toLowerCase().includes(kw) ||
    u.phone?.includes(kw)
    );
  });

  //  lock/unlock
  const handleLock = async (user) => {
  try {
    if (user.status === "ACTIVE") {
      await userAPI.lockUser(user.id);
      user.status = "BANNED";
    } else {
      await userAPI.unlockUser(user.id);
      user.status = "ACTIVE";
    }

    setUsers([...users]); //  update UI ngay
  } catch (err) {
    console.error("Lỗi lock/unlock:", err);
  }
};

  //  delete
  const handleDelete = async (id) => {
  toast(
    ({ closeToast }) => (
<div>
<p>Bạn có chắc muốn xóa user này?</p>
<div style={{ display: "flex", gap: 8, marginTop: 8 }}>
<button onClick={async () => {
            closeToast();
            try {
              await userAPI.deleteUser(id);
              fetchUsers();
              toast.success("Xóa user thành công!");
            } catch (err) { console.error("Lỗi delete:", err); }
          }} style={{ background: "#ff4d4f", color: "#fff", border: "none", padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}>Xóa</button>
<button onClick={closeToast} style={{ background: "#eee", border: "none", padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}>Hủy</button>
</div>
</div>
    ),
    { autoClose: false, closeOnClick: false }
  );
};

  return (
    <div className="admin-users">
      {/* Header */}
      <h2 className="page-title">Thống Kê</h2>
      <p className="page-sub">Thông tin sẽ được cập nhật hàng ngày</p>

      {/* Filter */}
      <div className="filter-bar">
        <input
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button>Tìm</button>
      </div>

      {/* Table */}
      <div className="user-table">
        <div className="table-header">
          <div>Người dùng</div>
          <div>Thông tin</div>
          <div>Bài viết</div>
          <div>Trạng thái</div>
          <div>Hành động</div>
        </div>

        {filteredUsers.map((u) => (
          <div className="table-row" key={u.id}>
            {/*  user */}
            <div className="user-info">
              <img src={u.avatar || ava} alt="" />
              <span className="name">{u.fullName || u.username}</span>
            </div>

            {/*  info */}
            <div className="contact">
              <span className="email">{u.email}</span>
              <span className="phone">{u.phone}</span>
            </div>

            {/*  posts */}
<div className="posts">
  Đã đăng {u.postCount || 0} bài
</div>

            {/*  status */}
            <div
  className={`status ${
    u.status === "ACTIVE" ? "active" : "blocked"
  }`}
>
  {u.status === "ACTIVE" ? "Available" : "Unavailable"}
</div>

            {/*  actions */}
            <div className="actions">
          <button
  title="Xem"
  onClick={() =>
    navigate(`/admin/users/${u.id}/posts`, {
      state: { user: u } //  truyền luôn user
    })
  }
>
  <Eye size={16} />
</button>

              <button
  title="Khóa / Mở khóa"
  onClick={() => handleLock(u)}
>
  <Lock size={16} color={u.status === "ACTIVE" ? "red" : "green"} />
</button>

              <button title="Xóa" onClick={() => handleDelete(u.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination demo */}
      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
      </div>
    </div>
  );
};

export default AdminUsers;