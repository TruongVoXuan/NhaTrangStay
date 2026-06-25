import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import "./UpcomingSchedulesSection.scss";
import { postAPI } from "lib/apiService";

const UpcomingSchedulesSection = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const now = new Date();

  //  FIX: dùng 1–12 (khớp backend MONTH())
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const totalPages = Math.ceil(schedules.length / ITEMS_PER_PAGE);

  const currentSchedules = schedules.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);

        const response = await postAPI.getPostsByMonth(month, year);

        setSchedules(response.data || []);
        setCurrentPage(1);
      } catch (err) {
        console.error("Lỗi load posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [month, year]);

  return (
    <div className="calendar-container card">
      <div className="calendar-header-v2">
        <div className="selectors">
          <CalendarIcon size={18} className="icon-cal" />

          {/*  FIX DROPDOWN MONTH (1–12) */}
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="select-custom"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="select-custom"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/*  FIX TODAY BUTTON */}
        <button
          className="btn-today"
          onClick={() => {
            setMonth(now.getMonth() + 1);
            setYear(now.getFullYear());
          }}
        >
          Hôm nay
        </button>
      </div>

      <div className="schedule-list">
        {loading ? (
          <div className="loading-state">Đang tải...</div>
        ) : schedules.length > 0 ? (
          currentSchedules.map((item) => (
            <div key={item.id} className="schedule-item">
              <div
                className={`status-bar ${item.status?.toLowerCase()}`}
              ></div>

              <div className="info-col">
                <p className="room-name">{item.title}</p>

                <div className="meta">
                  <span className="time-badge">
                    {item.createdAt?.slice(0, 10)}
                  </span>

                  <span className="guest">
                    Người đăng:{" "}
                    {item.user?.fullName || item.user?.username}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-v2">Trống lịch</p>
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingSchedulesSection;