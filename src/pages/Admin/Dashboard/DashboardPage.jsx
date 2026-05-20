import React from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import UpcomingSchedulesSection from 'components/shared/Admin/Menu/UpcomingSchedulesSection/UpcomingSchedulesSection';
import './DashboardPage.scss';
import { useEffect, useState } from "react";
import { postAPI } from "lib/apiService";
import ava from "assets/images/avatar1.png";
const DashboardPage = () => {
 const [barData, setBarData] = useState([]);
const [recentPosts, setRecentPosts] = useState([]);
 useEffect(() => {
  const fetchStats = async () => {
    try {
      const response =
        await postAPI.getApprovedStats();

      setBarData(response.data);
    } catch (err) {
      console.error("Lỗi load stats", err);
    }
  };

    const fetchRecentPosts = async () => {
    try {
      const response =
        await postAPI.getRecentApprovedPosts();

      setRecentPosts(response.data);
    } catch (err) {
      console.error("Lỗi recent posts", err);
    }
  };

  fetchStats();

    fetchRecentPosts();
}, []);
  return (
    <div className="dashboard-page">

      {/* THỐNG KÊ TIN ĐĂNG */}
      <div className="chart-container card">
        <div className="card-header">
          <h3>Thống kê tin đăng</h3>
          <select className="period-select">
            <option>2026</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#586B54" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#586B54" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={false} />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="current"
              stroke="#586B54"
              strokeWidth={3}
              fill="url(#colorCurrent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* DUYỆT TIN GẦN ĐÂY */}
      <div className="table-container card">
        <div className="card-header">
          <h3>Duyệt tin gần đây</h3>
          <button className="view-all">Xem tất cả</button>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Người đăng</th>
              <th>Phòng</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>


<tbody>
  {recentPosts.map((post) => (
    <tr key={post.id}>
     <td>
    <div className="user1-info">
      <img
        className="ava"
        src={post.user?.avatar || ava}
        alt=""
      />

      {post.user?.fullName ||
        post.user?.username}
    </div>
  </td>

      <td>{post.title}</td>

      <td>
        {post.updatedAt?.slice(0, 10)}
      </td>

      <td>
        <span className="badge success">
          Đã duyệt
        </span>
      </td>

      <td>✔</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* LỊCH SỬ ĐĂNG BÀI HÔM NAY */}
      <div className="calendar-container card">
        <UpcomingSchedulesSection />
      </div>

    </div>
  );
};

export default DashboardPage;