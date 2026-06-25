import React from "react";
import "./Footer.scss";
import logo from "assets/images/logo.png";
import { MapPin } from "lucide-react";
import { PhoneCall } from "lucide-react";
import { Mail } from "lucide-react";
import googleplay from "assets/images/googleplay.png";
import appstore from "assets/images/appstore.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footer-container">
      <div className="top-container">
        <div className="left-container">
          <img
  className="logo-footer"
  src={logo}
  alt="logo"
  onClick={() => navigate("/")}
/>
          <div>
            <div className="address-container">
              <MapPin color="#E1A730" />
              <p className="address">
                Số ABC, Đường DEF, Phường GHI, Thành Phố JKL, Việt Nam
              </p>
            </div>
            <div className="hotline-container">
              <PhoneCall color="#E1A730" />
              <p className="hotline">(024) 1234 5678 - (024) 2345 8271</p>
            </div>
          </div>
        </div>

        <div className="middle-main-container">
          <div className="middle-container-top">
            <div className="middle-logo">
              <PhoneCall size={36} color="#E1A730" />
            </div>
            <div className="middle-container">
              <p>
                <b>Hotline</b>
              </p>
              <p>
                <b>1900 1000</b>{" "}
              </p>
            </div>
          </div>
          <div className="middle-container-bottom">
            <p>
              <b>HƯỚNG DẪN</b>
            </p>
            <div className="content-container">
              <p className="p">Về chúng tôi</p>
              <p className="p">Báo giá và hỗ trợ</p>
              <p className="p">Câu hỏi thường gặp</p>
              <p className="p">Góp ý báo lỗi</p>
              <p className="p">&nbsp;</p>
            </div>
          </div>
        </div>

        <div className="middle-main-container">
          <div className="middle-container-top">
            <div className="middle-logo">
              <Mail color="#E1A730" size={36} />
            </div>
            <div className="middle-container">
              <p>
                <b>CHĂM SÓC KHÁCH HÀNG</b>{" "}
              </p>
              <p>
                <b>hotro@NhaTrangStay.com.vn</b>{" "}
              </p>
            </div>
          </div>
          <div className="middle-container-bottom">
            <p>
              <b>QUY ĐỊNH</b>
            </p>
            <div className="content-container">
              <p className="p">Quy định đăng tin</p>
              <p className="p">Quy chế hoạt động</p>
              <p className="p">Điều kiện thỏa thuận</p>
              <p className="p">Chính sách bảo mật</p>
              <p className="p">Giải quyết khiếu nại</p>
            </div>
          </div>
        </div>

        <div className="download-container">
          <a href="https://www.google.com/">
            <img className="logo" src={googleplay} alt="ch play" />
          </a>
          <a href="https://www.google.com/">
            <img className="logo" src={appstore} alt="" />
          </a>
        </div>
      </div>

      <hr />

      <div className="bottom-footer-container">
        <p className="bottom-footer">Copyright © 2026 NhaTrangStay. Mọi quyền được bảo lưu.</p>
        <p className="bottom-footer">
          Giấy Chứng Nhận Đăng Ký Kinh Doanh Số 0123456789 Do Sở KH&ĐT Tỉnh
          Khánh Hòa Cấp Ngày 01/01/2023.
        </p>
        <p className="bottom-footer">
          Giấy Phép Thiết Lập Trang Thông Tin Điện Tử Tổng Hợp Trên Mạng Số
          123/GP-TTĐT Do Cục PTTH & TTĐT Cấp Ngày 01/01/2023.
        </p>
        <p className="bottom-footer">
          NhaTrangStay Hiện Đang Trong Quá Trình Xây Dựng Và Hoàn Thiện Hệ Thống
          Phục Vụ Người Dùng Tốt Nhất.
        </p>
      </div>
    </div>
  );
};

export default Footer;
