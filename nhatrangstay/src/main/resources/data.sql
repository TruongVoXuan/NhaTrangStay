
-- ========================
-- ROOM TYPE
-- ========================
INSERT INTO room_type
    (type_name)
VALUES
    ('Phòng Trọ');
INSERT INTO room_type
    (type_name)
VALUES
    ('Chung cư');
INSERT INTO room_type
    (type_name)
VALUES
    ('Nhà Nguyên Căn');

-- ========================
-- USERS
-- ========================
INSERT INTO users
    (username, email, password, phone, provider, provider_id, status, role)
VALUES
    ('hh', 'hh@gmail.com', '$2a$10$h7I9JzDD12gQoANhR3CV8eJUo01c9Pa3vl2ic/.J1pGXYhOK1R02y', '0900000001', 'LOCAL', NULL, 'ACTIVE', 'USER'),
    ('huy', 'huy@gmail.com', '$2a$10$h7I9JzDD12gQoANhR3CV8eJUo01c9Pa3vl2ic/.J1pGXYhOK1R02y', '0900000002', 'LOCAL', NULL, 'ACTIVE', 'USER'),
    ('admin', 'admin@gmail.com', '$2a$10$h7I9JzDD12gQoANhR3CV8eJUo01c9Pa3vl2ic/.J1pGXYhOK1R02y', '0900000003', 'LOCAL', NULL, 'ACTIVE', 'ADMIN'),
    ('linh', 'linh@gmail.com', '$2a$10$h7I9JzDD12gQoANhR3CV8eJUo01c9Pa3vl2ic/.J1pGXYhOK1R02y', '0900000004', 'LOCAL', NULL, 'ACTIVE', 'USER'),
    ('truong', 'truong@gmail.com', '$2a$10$h7I9JzDD12gQoANhR3CV8eJUo01c9Pa3vl2ic/.J1pGXYhOK1R02y', '0900000005', 'LOCAL', NULL, 'ACTIVE', 'USER'),
    ('huan', 'huan@gmail.com', '$2a$10$h7I9JzDD12gQoANhR3CV8eJUo01c9Pa3vl2ic/.J1pGXYhOK1R02y', '0900000006', 'LOCAL', NULL, 'ACTIVE', 'USER');



-- ========================
-- POSTS (13 ROOM)
-- ========================
INSERT INTO post
    (title, price, status, area, room_quantity, address, description, user_id, type_id, location, latitude, longitude, created_at, updated_at)
VALUES

    ('Phòng trọ mới xây gần ĐH Nha Trang', 1500000, 'APPROVED', 20, 1,
        'Tôn Thất Tùng, Phường Vĩnh Thọ, Trung tâm Nha Trang, Khánh Hòa',
        'Cho thuê phòng trọ cao cấp 20m2, có gác lửng đúc 1m6. Phòng mới 100%, sơn chống thấm, lót gạch giả gỗ.
 Nội thất: Quạt hút trần, kệ bếp đá hoa cương, bồn rửa inox. Vệ sinh Inax, vòi sen áp lực cao.
 An ninh: Khóa vân tay 2 lớp, camera 24/7. Không chung chủ, giờ tự do.
 Chi phí: Điện 3.5k/kwh, nước 15k/khối, rác & wifi 100k/tháng. Miễn phí để 2 xe máy.
 Vị trí: Hẻm 4m ô tô vào được, cách ĐH Nha Trang 3 phút, gần chợ và cửa hàng tiện lợi.', 1, 1,
        'Trung tâm Nha Trang', 12.2388, 109.1967, NOW(), NOW()),

    ('Căn hộ Studio view biển Trần Phú', 3500000, 'APPROVED', 35, 2,
        'Trần Phú, Phường Lộc Thọ, Trung tâm Nha Trang, Khánh Hòa',
        'Cho thuê căn hộ Studio 35m2, tầng 15 Mường Thanh Viễn Triều view biển tuyệt đẹp.
 Dọn vào ở ngay, full nội thất cao cấp: Smart TV 50", tủ lạnh Inverter, điều hòa Daikin, máy giặt Electrolux, giường King size.
 Bếp từ đôi, lò vi sóng, bình siêu tốc. An ninh 24/24, thẻ từ thang máy riêng biệt.
 Tiện ích: Siêu thị, gym, hồ bơi, nhà hàng ngay tầng trệt.
 Điện nước giá nhà nước. Phù hợp chuyên gia, người đi làm yêu thích sự tiện nghi.', 5, 2,
        'Trung tâm Nha Trang', 12.2308, 109.1961, NOW(), NOW()),

    ('Phòng trọ sinh viên giá rẻ', 1000000, 'APPROVED', 18, 1,
        'Nguyễn Thị Minh Khai, Phường Tân Lập, Trung tâm Nha Trang, Khánh Hòa',
        'Phòng trọ bình dân 12m2 + gác xép 6m2 ngay trung tâm TP Tuy Hòa.
 Phòng mới sơn, mái tôn lạnh cách nhiệt mát mẻ. Cửa sổ lùa thông giếng trời thoáng đãng.
 Toilet khép kín sạch sẽ. Sân phơi đồ chung có mái che trên sân thượng.
 Khu phố an ninh, yên tĩnh. Giờ giấc: Đóng cổng 23h30 (có khóa phụ nếu làm ca đêm).
 Chi phí siêu rẻ: Điện 3k/ký, nước 12k/khối, wifi miễn phí.
 Cách siêu thị Co.opmart 5 phút, gần bến xe buýt và chợ.', 4, 1,
        'Trung tâm Nha Trang', 12.2450, 109.1910, NOW(), NOW()),

    ('Phòng trọ gần cảng Nha Trang', 2000000, 'APPROVED', 25, 1,
        'Nguyễn Tất Thành, Phường Phước Đồng, Nam Nha Trang, Khánh Hòa',
        'Phòng trọ rộng 25m2 kiểu nhà cấp 4 liền kề, tường đôi cách âm cực tốt.
 Vị trí đắc địa: Sát đại lộ Nguyễn Tất Thành, cách sân bay Cam Ranh 10 phút.
 Thiết thiết kế thông minh: Phòng khách trước, chỗ ngủ sau, trần thạch cao, đèn LED. Bếp tách biệt.
 Sân trước rộng rãi, có mái che lấy sáng, để xe máy an toàn, camera 24/7.
 Gần chợ, phòng khám, tạp hóa. Điện 3.5k/kwh, nước giếng lọc RO 10k/khối, miễn phí wifi và rác.', 2, 1,
        'Nam Nha Trang', 12.1890, 109.2150, NOW(), NOW()),

    ('Căn hộ mini hiện đại', 5000000, 'APPROVED', 50, 2,
        'Vĩnh Ngọc, Tây Nha Trang, Khánh Hòa',
        'Căn hộ mini 50m2 cực đẹp ngay trung tâm TP Phan Rang - Tháp Chàm.
 Thiết kế Châu Âu: 1 PK, 1 PN, ban công rộng trồng cây xanh mát mẻ.
 Full nội thất: Điều hòa Inverter, TV 55", tủ lạnh Side by Side, máy giặt sấy, giường nệm êm ái.
 Bếp hiện đại tủ Acrylic, bếp từ đôi. Miễn phí dọn vệ sinh 2 lần/tuần.
 Tòa nhà có thang máy, PCCC chuẩn, hầm để xe, bảo vệ 24/7.
 Gần Quảng trường 16/4, cách biển Bình Sơn 5 phút.', 3, 2,
        'Tây Nha Trang', 12.2600, 109.1650, NOW(), NOW()),

    ('Phòng trọ gần chợ Đầm', 1800000, 'APPROVED', 22, 1,
        'Lê Lợi, Phường Xương Huân, Trung tâm Nha Trang, Khánh Hòa',
        'Phòng trọ 22m2 tầng trệt tiện lợi, nằm trong hẻm Lê Lợi an ninh.
 Vị trí vàng: Đi bộ 3 phút ra Chợ Đầm, 10 phút ra biển Trần Phú.
 Trang bị: Quạt trần, giường gỗ 1m4, kệ bếp ốp gạch. Toilet khép kín sạch sẽ, thoát nước tốt.
 An ninh cao: Yêu cầu CCCD gắn chip, cổng vân tay, camera soi tận ngõ. Giờ mở cửa 5h00 - 23h30.
 Chi phí minh bạch: Điện 3.5k/kwh, nước máy 15k/khối. Khu vực cực kỳ yên tĩnh, phù hợp người đi làm.', 1, 1,
        'Trung tâm Nha Trang', 12.2510, 109.1905, NOW(), NOW()),

    ('Căn hộ view biển Phạm Văn Đồng', 4000000, 'APPROVED', 30, 1,
        'Phạm Văn Đồng, Phường Vĩnh Hải, Bắc Nha Trang, Khánh Hòa',
        'Căn hộ Studio 30m2 view trực diện biển Phạm Văn Đồng siêu đẹp.
 Thiết kế Minimalism tối giản. Cửa sổ kính chạm sàn ngắm bình minh tuyệt đỉnh.
 Nội thất: Giường Queen, Smart TV, tủ lạnh, điều hòa. Góc bếp nhỏ nhắn đầy đủ tiện nghi.
 Phòng tắm vách kính sang trọng có bồn tắm nằm thư giãn.
 Giá thuê bao gồm: Rác, wifi, phí quản lý, chỗ để xe, dọn phòng 1 lần/tuần. Có máy giặt chung.
 Không gian yên tĩnh, lý tưởng cho Freelancer.', 2, 2,
        'Bắc Nha Trang', 12.2705, 109.2010, NOW(), NOW()),

    ('Phòng trọ yên tĩnh Vĩnh Trường', 900000, 'APPROVED', 15, 1,
        'Vĩnh Trường, Phường Vĩnh Trường, Nam Nha Trang, Khánh Hòa',
        'Phòng trọ cấp 4 diện tích 15m2 trong khu xóm đạo Vĩnh Trường.
 Hẻm xe máy cực kỳ yên tĩnh, an ninh hiền hòa, tách biệt ồn ào phố thị.
 Phòng sạch sẽ, mái fibrô xi măng, toilet khép kín cơ bản. Có góc ốp gạch để tự nấu ăn.
 Sân trước 2m phơi đồ và đậu 1 xe máy thoải mái.
 Chi phí siêu tiết kiệm: Điện 3k/kwh, nước 10k/khối, rác 20k/tháng.
 Yêu cầu: Giữ vệ sinh chung, không hát karaoke ồn ào. Thích hợp tìm chỗ nghỉ ngơi giá rẻ.', 3, 1,
        'Nam Nha Trang', 12.2005, 109.2102, NOW(), NOW()),

    ('Nhà cao cấp phố Tây', 2200000, 'APPROVED', 28, 1,
        'Nguyễn Thiện Thuật, Phường Lộc Thọ, Trung tâm Nha Trang, Khánh Hòa',
        'Nhà Sleepbox cao cấp 28m2 ngay ngã tư phố Tây Nguyễn Thiện Thuật.
 Xung quanh đầy đủ nhà hàng, siêu thị tiện lợi 24/7.
 Thiết kế 6 khoang riêng biệt bằng gỗ MDF, rèm che kín đáo. Mỗi box có nệm, đèn, quạt mini.
 Tủ đồ cá nhân khóa mã số thông minh. 2 máy lạnh Inverter bật 24/24.
 Khu vệ sinh rộng rãi, bếp chung full đồ (lò vi sóng, nồi chiên).
 Giá 2.2tr/tháng trọn gói 100% chi phí (điện, nước, wifi, dọn dẹp).', 4, 1,
        'Trung tâm Nha Trang', 12.2325, 109.1955, NOW(), NOW()),

    ('Căn hộ 1PN ban công đẹp', 4500000, 'APPROVED', 40, 1,
        'Hùng Vương, Phường Lộc Thọ, Trung tâm Nha Trang, Khánh Hòa',
        'Căn hộ 1 phòng ngủ 40m2 đường Hùng Vương, TP Tuy Hòa.
 Sở hữu ban công siêu rộng trồng hoa giấy, cửa kính lùa ngập tràn ánh sáng.
 Phòng khách liền bếp 20m2: Sofa nỉ, TV 43", kệ bếp gỗ sồi, bếp từ âm, máy hút mùi.
 Phòng ngủ 20m2: Giường Queen, tủ âm tường, máy giặt riêng ngoài ban công.
 Trang bị 2 máy lạnh Casper. Hầm để xe rộng, camera AI, khóa cổng vân tay.
 Khu vực văn minh, cách quảng trường và bãi biển chỉ 5 phút.', 5, 2,
        'Trung tâm Nha Trang', 12.2340, 109.1950, NOW(), NOW()),

    ('Phòng trọ trung tâm đầy đủ tiện nghi', 2500000, 'APPROVED', 20, 1,
        'Ngô Gia Tự, Phường Phước Tiến, Trung tâm Nha Trang, Khánh Hòa',
        'Phòng trọ 20m2 mới ốp lát sạch sẽ ngay trung tâm đường Ngô Gia Tự.
 Sẵn đồ cơ bản: Máy lạnh Aqua 1HP, quạt treo tường Senko, bình nóng lạnh Ferroli an toàn.
 Khu nấu ăn riêng biệt không chiếm diện tích sinh hoạt.
 Chung khuôn viên chủ nhưng lối đi riêng. An ninh tuyệt đối, ưu tiên nữ hoặc vợ chồng trẻ.
 Giờ giới nghiêm: 23h đêm. Miễn phí gửi tối đa 2 xe máy.
 Chi phí: Điện 4k/số, nước 15k/số, wifi cáp quang 50k/tháng.', 1, 1,
        'Trung tâm Nha Trang', 12.2490, 109.1900, NOW(), NOW()),

    ('Phòng trọ gần bến xe phía Bắc', 1600000, 'APPROVED', 18, 1,
        'Đường 2/4, Phường Vĩnh Hải, Bắc Nha Trang, Khánh Hòa',
        'Phòng trọ trệt 18m2 thiết kế thông minh, tối ưu không gian.
 Vị trí mặt đường 2/4, cách bến xe phía Bắc 3 phút, thuận tiện di chuyển liên tỉnh.
 Khu vực cao ráo, cam kết không ngập nước. Có ván ép ngăn cách khu vực bếp và chỗ ngủ.
 Cửa sổ hành lang thoáng mát, toilet khép kín sạch sẽ.
 Giờ giấc tự do 24/24, khóa cổng chìa cơ và thẻ từ. Có người dọn dẹp hành lang thường xuyên.
 Gần trạm y tế, chợ Vĩnh Hải, tiện ích đầy đủ.', 2, 1,
        'Bắc Nha Trang', 12.2640, 109.1975, NOW(), NOW()),

    ('Căn hộ chung cư Vĩnh Điềm Trung', 4800000, 'APPROVED', 45, 2,
        'Đường 19/5, Phường Vĩnh Điềm Trung, Tây Nha Trang, Khánh Hòa',
        'Căn hộ 45m2 tầng 8 chung cư KĐT Vĩnh Điềm Trung (VDT), dọn vào ở ngay.
 View công viên mát mẻ. Gồm 1 PN master, 1 PK liền bếp, 1 WC, 1 logia phơi đồ.
 Nội thất mới 100%: Tủ lạnh LG mặt gương, Smart TV Sony 55", sofa da, giường nệm, 2 máy lạnh.
 Ngay dưới sảnh là siêu thị Go!, bệnh viện Sài Gòn, rạp chiếu phim Lotte.
 An ninh thẻ từ định danh, bảo vệ 24/24.
 Giá thuê đã bao gồm 100% phí quản lý tòa nhà, điện nước giá nhà nước.', 3, 2,
        'Tây Nha Trang', 12.2475, 109.1700, NOW(), NOW());

INSERT INTO image
    (post_id, url, order_index)
VALUES
    -- Ảnh cho Post 1
    (1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 0),
    (1, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 1),
    (1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 2),
    (1, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 3),
    (1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 4),
    (1, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 5),
    (1, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 6),
    (1, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 7),
    (1, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 8),
    (1, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 9),

    -- Ảnh cho Post 2
    (2, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 0),
    (2, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 1),
    (2, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 2),
    (2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 3),
    (2, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 4),
    (2, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 5),
    (2, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 6),
    (2, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 7),
    (2, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 8),
    (2, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 9),

    -- Ảnh cho Post 3
    (3, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 0),
    (3, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 1),
    (3, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 2),
    (3, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 3),
    (3, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 4),
    (3, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 5),
    (3, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 6),
    (3, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 7),
    (3, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 8),
    (3, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 9),

    -- Ảnh cho Post 4
    (4, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 0),
    (4, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 1),
    (4, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 2),
    (4, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 3),
    (4, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 4),
    (4, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 5),
    (4, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 6),
    (4, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 7),
    (4, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 8),
    (4, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 9),

    -- Ảnh cho Post 5
    (5, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 0),
    (5, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 1),
    (5, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 2),
    (5, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 3),
    (5, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 4),
    (5, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 5),
    (5, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 6),
    (5, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 7),
    (5, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 8),
    (5, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 9),

    -- Ảnh cho Post 6
    (6, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 0),
    (6, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 1),
    (6, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 2),
    (6, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 3),
    (6, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 4),
    (6, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 5),
    (6, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 6),
    (6, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 7),
    (6, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 8),
    (6, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 9),

    -- Ảnh cho Post 7
    (7, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 0),
    (7, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 1),
    (7, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 2),
    (7, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 3),
    (7, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 4),
    (7, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 5),
    (7, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 6),
    (7, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 7),
    (7, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 8),
    (7, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 9),

    -- Ảnh cho Post 8
    (8, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 0),
    (8, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 1),
    (8, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 2),
    (8, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 3),
    (8, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 4),
    (8, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 5),
    (8, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 6),
    (8, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 7),
    (8, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 8),
    (8, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 9),

    -- Ảnh cho Post 9
    (9, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 0),
    (9, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 1),
    (9, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 2),
    (9, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 3),
    (9, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 4),
    (9, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 5),
    (9, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 6),
    (9, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 7),
    (9, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 8),
    (9, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 9),

    -- Ảnh cho Post 10
    (10, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 0),
    (10, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 1),
    (10, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 2),
    (10, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 3),
    (10, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 4),
    (10, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 5),
    (10, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 6),
    (10, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 7),
    (10, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 8),
    (10, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 9),

    -- Ảnh cho Post 11
    (11, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 0),
    (11, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 1),
    (11, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 2),
    (11, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 3),
    (11, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 4),
    (11, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 5),
    (11, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 6),
    (11, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 7),
    (11, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 8),
    (11, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 9),

    -- Ảnh cho Post 12
    (12, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 0),
    (12, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 1),
    (12, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 2),
    (12, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 3),
    (12, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 4),
    (12, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 5),
    (12, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 6),
    (12, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 7),
    (12, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 8),
    (12, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 9),

    -- Ảnh cho Post 13
    (13, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 0),
    (13, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 1),
    (13, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', 2),
    (13, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 3),
    (13, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 4),
    (13, 'https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80', 5),
    (13, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 6),
    (13, 'https://images.unsplash.com/photo-1598928506311-c55dd580e5cb?w=800&q=80', 7),
    (13, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', 8),
    (13, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 9);