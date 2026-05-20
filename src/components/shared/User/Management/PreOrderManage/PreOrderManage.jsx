import React, { useEffect, useState } from "react";
import "./PreOrderManage.scss";
import demo from "assets/images/demo.jpg";
import { toast } from "react-toastify";
import { rentalAPI } from "lib/apiService";
import {
  MapPin,
  CalendarDays,
  User,
  CircleX,
  CircleCheck,
  Phone,
  Search,
} from "lucide-react";

const PreOrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleApprove = async (id) => {
  try {
    await rentalAPI.approvePreOrder(id);

    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status: "APPROVED" } : o
      )
    );

    toast.success("Đã xác nhận!")
  } catch (err) {
    console.log(err);
  }
};

const handleCancel = async (id) => {
  toast(
    ({ closeToast }) => (
<div>
<p>Bạn có chắc muốn hủy hợp đồng này không?</p>
<div style={{ display: "flex", gap: 8, marginTop: 8 }}>
<button onClick={async () => {
            closeToast();
            try {
              await rentalAPI.cancelContract(id);
              setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "CANCELLED" } : o));
              toast.success("Đã hủy hợp đồng!");
            } catch (err) { console.log(err); }
          }} style={{ background: "#ff4d4f", color: "#fff", border: "none", padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}>Xác nhận</button>
<button onClick={closeToast} style={{ background: "#eee", border: "none", padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}>Hủy</button>
</div>
</div>
    ),
    { autoClose: false, closeOnClick: false }
  );
};

const handleReject = async (id) => {
  try {
    await rentalAPI.rejectPreOrder(id);

     setOrders(prev => prev.filter(o => o.id !== id));

    toast.success("Đã từ chối!")
  } catch (err) {
    console.log(err);
  }
};
  //  LOAD PRE-ORDERS
  useEffect(() => {
  console.log(" PREORDER PAGE MOUNTED");
  setLoading(true);

  rentalAPI.getOwnerPreOrders()
    .then((res) => {
      console.log("PREORDER API RESPONSE:", res);

      const data = res?.data?.data || res?.data || [];

      //  THÊM FILTER Ở ĐÂY
      const filtered = Array.isArray(data)
  ? data.filter(
      (item) =>
        item.status !== "REJECTED" &&
        item.status !== "CANCELLED"
    )
  : [];

      setOrders(filtered);
    })
    .catch((err) => {
      console.log("Lỗi load preorder:", err);
      setOrders([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  //  LOADING UI
  if (loading) {
    return <div style={{ padding: 20 }}>Đang tải...</div>;
  }

  return (
    <div className="main-container-order-manage">
      {/* HEADER */}
      <div className="order-header">
        <div className="header-left">
          <b className="title">Quản Lý Đặt Trước</b>
        </div>

        <div className="header-right">
          <p className="summary-text">
            Bạn có <span>{orders.length}</span> lượt đặt lịch
          </p>

          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm..." />
            <Search className="search-icon" size={16} />
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* LIST */}
      <div className="order-list">
        {orders.length === 0 && (
          <div style={{ padding: 20 }}>Chưa có ai đặt lịch</div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="item-order">
            {/* IMAGE */}
            <div className="img-box">
              <img
                src={order?.post?.images?.[0]?.url || demo}
                alt="post"
              />
            </div>

            {/* INFO */}
            <div className="info-box">
              <div className="room-title">
                <b>{order?.post?.title || "Không có tiêu đề"}</b>
              </div>

              <div className="address-box">
                <MapPin size={20} color="#e1a730" />
                <span>{order?.post?.address || "Không có địa chỉ"}</span>
              </div>

              {/* CUSTOMER */}
              <div className="customer-label">
                <b>Người đặt:</b>
              </div>

              <div className="customer-info">
                <div className="customer-name">
                  <User size={20} color="#E6AC28" />
                  <span>{order?.user?.username || "N/A"}</span>
                </div>

                <div className="customer-contact">
                  <div className="contact-item">
                    <Phone color="#E6AC28" size={19} />
                    <span>{order?.user?.phone || "N/A"}</span>
                  </div>

                  <div className="contact-item">
                    <CalendarDays color="#E6AC28" size={20} />
                    <span>
                      {order?.time
                        ? new Date(order.time).toLocaleString("vi-VN")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <div className="action-box">
              <div className="price-display">
                <p className="price-numb">
                  {order?.post?.price
                    ? order.post.price.toLocaleString()
                    : "0"}
                </p>
                <p className="price-unit">VND/tháng</p>
              </div>

              <div className="btn-group-column">

 {order.status === "CANCELLED" ? (
  <div style={{ color: "gray", fontWeight: "600" }}>
     Đã hủy hợp đồng
  </div>
) : order.status === "APPROVED" ? (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    <div className="approved-label">
       Đã xác nhận
    </div>

    <button
      className="btn-action btn-reject"
      onClick={() => handleCancel(order.id)}
    >
       Hủy hợp đồng
    </button>
  </div>
) : (
  <>
    <button
      className="btn-action btn-confirm"
      onClick={() => handleApprove(order.id)}
    >
      <CircleCheck size={18} />
      <span>Xác nhận</span>
    </button>

    <button
      className="btn-action btn-reject"
      onClick={() => handleReject(order.id)}
    >
      <CircleX size={18} />
      <span>Từ chối</span>
    </button>
  </>
)}

</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreOrderManage;