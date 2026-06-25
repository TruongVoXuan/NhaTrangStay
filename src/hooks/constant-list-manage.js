// constants.js
import demo from "assets/images/demo.jpg";

export const MOCK_ROOMS = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  title: `Phòng trọ sinh viên giá rẻ số ${i + 1}`,
  address:
    i % 2 === 0
      ? "Phan Rang - Tháp Chàm, Ninh Thuận"
      : "Quận 9, TP. Hồ Chí Minh",
  price: (3000000 + i * 50000).toLocaleString("vi-VN"),
  views: Math.floor(Math.random() * 2000).toLocaleString(),
  date: "12/12/2026",
  image: demo,
}));
