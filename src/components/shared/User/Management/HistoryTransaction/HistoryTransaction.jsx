import React, { useEffect, useState, useMemo } from "react";
import "./HistoryTransaction.scss";
import { MapPin, Clock } from "lucide-react";
import { rentalAPI } from "lib/apiService";

const PAGE_SIZE = 5;

const HistoryTransaction = () => {
  const [preOrders, setPreOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await rentalAPI.getMyPreOrders();
      setPreOrders(res.data || []);
    } catch (err) {
      console.error("Lỗi load preorders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return { color: "#16A34A", bg: "#DCFCE7", text: "Đã duyệt" };
      case "REJECTED":
        return { color: "#DC2626", bg: "#FEE2E2", text: "Từ chối" };
      case "CANCELLED":
        return { color: "#6B7280", bg: "#E5E7EB", text: "Đã hủy hợp đồng" };
      default:
        return { color: "#2563EB", bg: "#EFF6FF", text: "Chờ duyệt" };
    }
  };

  const totalPages = Math.ceil(preOrders.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return preOrders.slice(start, start + PAGE_SIZE);
  }, [preOrders, currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="main-container-history-manage">

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ paddingTop: "20px" }}>
          <b style={{ fontSize: "22px" }}>
            Các bài bạn đã đặt lịch
          </b>
        </div>
      </div>

      <hr style={{ border: "1px solid #ddd" }} />

      {/* LIST */}
      <div className="history-content-container">

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : paginatedData.length === 0 ? (
          <p>Bạn chưa đặt lịch nào</p>
        ) : (
          paginatedData.map((item) => {
            const statusUI = getStatusStyle(item.status);

            const image =
              item.post?.images?.[0]?.url || "/default-image.jpg";

            const address =
              item.post?.address ||
              item.post?.location ||
              "Không rõ";

            return (
              <div
                key={item.id}
                className="item-history"
                style={{
                  border: "2px solid #F8F8F8",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px 22px",
                  alignItems: "center",
                  gap: "20px",
                }}
              >

                {/* LEFT */}
                <div style={{ display: "flex", gap: "20px" }}>

                  <img
                    src={image}
                    alt="post"
                    style={{
                      width: "80px",
                      height: "70px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>

                    <div style={{ fontWeight: "700", fontSize: "16px" }}>
                      {item.post?.title || "Bài đăng"}
                    </div>

                    {/* ADDRESS FIX WRAP */}
                    <div style={{ display: "flex", gap: "15px", color: "#888", flexWrap: "wrap" }}>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        maxWidth: "300px",
                        minWidth: 0
                      }}>
                        <MapPin size={15} />
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {address}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={15} />
                        {item.time
                          ? new Date(item.time).toLocaleString()
                          : "Không có lịch"}
                      </div>

                    </div>

                    <div style={{ fontSize: "13px", color: "#999" }}>
                      Chủ nhà: {item.post?.user?.username || "N/A"}
                    </div>

                  </div>
                </div>

                {/* RIGHT */}
                <div style={{ textAlign: "right" }}>

                  <div
                    style={{
                      color: statusUI.color,
                      backgroundColor: statusUI.bg,
                      padding: "5px 12px",
                      borderRadius: "12px",
                      fontWeight: "600",
                      display: "inline-block",
                    }}
                  >
                    {statusUI.text}
                  </div>

                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}>
                    ID: #{item.id}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION (FIXED SCSS HOOK) */}
      {!loading && totalPages > 1 && (
        <div className="pagination">

          <button onClick={handlePrev} disabled={currentPage === 1}>
            Prev
          </button>

          <span>
            Page {currentPage} / {totalPages}
          </span>

          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>

        </div>
      )}

    </div>
  );
};

export default HistoryTransaction;