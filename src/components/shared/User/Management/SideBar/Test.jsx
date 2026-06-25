import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // 1. Thêm cái này
import avt from "assets/images/avt.png";
import "./Test.scss";
import {
  Ban, ListTodo, List, FileClock, Rows4, User,
  CalendarDays, CircleCheck, ListX, ChevronRight, ChevronDown,
} from "lucide-react";

const Side = ({ userName }) => {
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) => 
    `option-left ${isActive ? "active" : ""}`;

  return (
    <div className="admin-left-container">
      {/* Khối Profile */}
      <div className="drop-main-container">
        <div className="avt-wrapper">
          <div className="avt-container">
            <img className="avt" src={avt} alt="" />
          </div>
        </div>
        <div className="admin-inf">
          <p><b>{userName}</b></p>
          <div className="role-container">
            <CircleCheck size={18} color="#21A3FF" />
            <p className="role">Chủ căn hộ</p>
          </div>
        </div>
      </div>

      {/* Khối Option Menu */}
      <div className="option-main-container">
        
        {/* Thông tin cá nhân - Dùng NavLink */}
        <NavLink to="/profile" className={({ isActive }) => 
          `option-left ${isActive ? "active-top" : ""}`
        }>
          <User />
          <p><b>Thông tin cá nhân</b></p>
        </NavLink>

        {/* Quản lý bài đăng - Khối này thường không dẫn link trực tiếp mà chỉ để mở Menu con */}
        <div
          onClick={() => setOpen(!open)}
          className={`option-left drop ${open ? "active" : ""}`}
        >
          <div className="left-drop-item">
            <CalendarDays />
            <p className="item-options"><b>Quản lý bài đăng</b></p>
          </div>
          <div className="arrow-box">
            {!open ? <ChevronRight /> : <ChevronDown />}
          </div>
        </div>

        {/* Danh sách con */}
        {open && (
          <div className="option-left-list-container">
            <NavLink to="/manage/list" className={navLinkClass}>
              <List />
              <p><b>Danh Sách Bài Đăng</b></p>
            </NavLink>
            
            <NavLink to="/manage/approve" className={navLinkClass}>
              <ListTodo />
              <p><b>Bài Đăng Chờ Duyệt</b></p>
            </NavLink>

            <NavLink to="/manage/refuse" className={navLinkClass}>
              <ListX />
              <p><b>Bài Đăng Bị Từ Chối</b></p>
            </NavLink>
          </div>
        )}

        {/* Quản lý đặt trước */}
        <NavLink to="/order-manage" className={navLinkClass}>
          <Rows4 />
          <p><b>Quản lý đặt trước</b></p>
        </NavLink>

        {/* Lịch sử giao dịch */}
        <NavLink to="/history" className={({ isActive }) => 
          `option-left ${isActive ? "active-bottom" : ""}`
        }>
          <FileClock />
          <p><b>Lịch sử giao dịch</b></p>
        </NavLink>
      </div>
    </div>
  );
};

export default Side;