// Mock data cho bài đăng phòng trọ
export const mockPosts = [
  {
        id: 1,
    title: "PHÒNG TRỌ CAO CẤP GẦN ĐH NHA TRANG",
    price: 2500000,
    area: 25,
    address: "123 Nguyễn Thị Minh Khai, Vĩnh Hải, Nha Trang, Khánh Hòa",
    location: "Bắc Nha Trang",
      type: {
      id: 1,
      name: "phong_tro",
    },
     features: {
      pet: true,
      nearBeach: true,
      airConditioner: true,
      pool: false,
    },

    latitude: 12.2706,
    longitude: 109.1994,
    description:
      "Phòng mới xây, đầy đủ nội thất cao cấp: giường, tủ, bàn học, wifi tốc độ cao. Gần chợ Vĩnh Hải, siêu thị, trường học. An ninh tốt, có camera 24/7, giờ giấc tự do.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Đoàn Thàm Vĩnh Huân",
      avatar:
        "https://ui-avatars.com/api/?name=Doan+Tham+Vinh+Huan&background=0063B8&color=fff",
      contact: "0974131489",
    },
    rating: 5,
    postDate: "Hôm nay",
    createdAt: "2026-03-10T08:00:00Z",
    status: "AVAILABLE",
  },
  {
      id: 2,
    title: "CHUNG CƯ GIÁ RẺ CAM RANH",
    price: 1800000,
    area: 20,
    address: "45 Nguyễn Đức Cảnh, Phước Long, Nha Trang, Khánh Hòa",
    location: "Nam Nha Trang",
      type: {
      id: 2,
      name: "chung_cu",
    },

    features: {
      pet: false,
      nearBeach: false,
      airConditioner: true,
      pool: true,
    },
      latitude: 12.2185,
  longitude: 109.1962,
    description:
      "Chung cư sạch sẽ, thoáng mát, đầy đủ tiện nghi cơ bản. Gần khu công nghiệp, thuận tiện đi làm. Giá điện nước rẻ, chủ nhà thân thiện.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Nguyễn Văn An",
      avatar:
        "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=E1A730&color=fff",
      contact: "0912345678",
    },
    rating: 4,
    postDate: "Hôm qua",
    createdAt: "2026-03-09T14:30:00Z",
    status: "AVAILABLE",
  },
  {
        id: 3,
    title: "NHÀ NGUYÊN CĂN MINI TRUNG TÂM",
    price: 5500000,
    area: 35,
    address: "78 Lê Thánh Tôn, Lộc Thọ, Nha Trang, Khánh Hòa",
    location: "Nha Trang Center",
        type: { id: 3, name: "nha_nguyen_can" },
        features: { pet: true, nearBeach: false, airConditioner: false, pool: false },
    latitude: 12.2389,
    longitude: 109.1968,
    description:
      "Nhà nguyên căn mini 1 phòng ngủ, 1 phòng khách, bếp riêng biệt. Full nội thất cao cấp: máy lạnh, tủ lạnh, máy giặt, bàn ăn. View biển đẹp, yên tĩnh.",
    images: [
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Trần Thị Hoa",
      avatar:
        "https://ui-avatars.com/api/?name=Tran+Thi+Hoa&background=FF6B9D&color=fff",
      contact: "0987654321",
    },
    rating: 5,
    postDate: "2 ngày trước",
    createdAt: "2026-03-08T10:15:00Z",
    status: "AVAILABLE",
  },
  {
   id: 4,
    title: "PHÒNG TRỌ SV GIÁ RẺ",
    price: 1500000,
    area: 18,
    address: "12 Yersin, Phương Sài, Nha Trang, Khánh Hòa",
    type: { id: 1, name: "phong_tro" },
        features: { pet: false, nearBeach: false, airConditioner: false, pool: false },
    location: "Nha Trang Center",
    latitude: 12.2513,
    longitude: 109.1895,
    description:
      "Phòng trọ dành cho sinh viên, giá rẻ, an ninh tốt. Gần trường học, siêu thị, quán ăn. Có chỗ để xe rộng rãi, wifi miễn phí.",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Lê Quang Tri",
      avatar:
        "https://ui-avatars.com/api/?name=Le+Quang+Tri&background=28A745&color=fff",
      contact: "0901234567",
    },
    rating: 4,
    postDate: "3 ngày trước",
    createdAt: "2026-03-07T16:45:00Z",
    status: "AVAILABLE",
  },
  {
       id: 5,
    title: "CHUNG CƯ RỘNG RÃI",
    price: 2000000,
    area: 28,
     address: "14 Phạm Văn Đồng, Vĩnh Hòa, Nha Trang, Khánh Hòa",
     location: "Bắc Nha Trang",
         type: { id: 2, name: "chung_cu" },
             features: { pet: true, nearBeach: true, airConditioner: true, pool: false },
    latitude: 12.2735,
  longitude: 109.2010,
    description:
      "Chung cư rộng rãi, thoáng mát, có ban công. Khu vực yên tĩnh, an ninh tốt. Gần chợ, bệnh viện, ngân hàng.",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Phạm Minh Đức",
      avatar:
        "https://ui-avatars.com/api/?name=Pham+Minh+Duc&background=6C757D&color=fff",
      contact: "0909876543",
    },
    rating: 4,
    postDate: "4 ngày trước",
    createdAt: "2026-03-06T09:20:00Z",
    status: "AVAILABLE",
  },
  {
    id: 6,
    title: "NHÀ NGUYÊN CĂN GẦN BIỂN",
    price: 3200000,
    area: 30,
    address: "89 Dương Hiến Quyền, Vĩnh Hòa, Nha Trang, Khánh Hòa",
        type: { id: 3, name: "nha_nguyen_can" },
            features: { pet: true, nearBeach: false, airConditioner: true, pool: true },
      location: "Bắc Nha Trang",
     latitude: 12.274156,
  longitude: 109.201646,
    description:
      "Nhà nguyên căn view biển đẹp, thoáng mát. Gần bãi tắm Tuy Hòa, phù hợp cho người thích biển. Có đầy đủ nội thất, wifi, điều hòa.",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1615874694520-474822394e73?w=800",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Võ Thị Mai",
      avatar:
        "https://ui-avatars.com/api/?name=Vo+Thi+Mai&background=DC3545&color=fff",
      contact: "0913456789",
    },
    rating: 5,
    postDate: "5 ngày trước",
    createdAt: "2026-03-05T11:00:00Z",
    status: "AVAILABLE",
  },
  {
       id: 7,
    title: "PHÒNG TRỌ HIỆN ĐẠI",
    price: 4500000,
    area: 32,
    address: "234 Thống Nhất, Phương Sài, Nha Trang, Khánh Hòa",
        type: { id: 1, name: "phong_tro" },
            features: { pet: false, nearBeach: true, airConditioner: true, pool: false },
    location: "Tây Nha Trang",
    latitude: 12.2452,
    longitude: 109.1917,
    description:
      "Phòng trọ hiện đại, không gian mở. Full nội thất: giường, bàn làm việc, tủ quần áo, bếp mini. Có thang máy, bảo vệ 24/7.",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Hoàng Văn Nam",
      avatar:
        "https://ui-avatars.com/api/?name=Hoang+Van+Nam&background=17A2B8&color=fff",
      contact: "0923456789",
    },
    rating: 5,
    postDate: "6 ngày trước",
    createdAt: "2026-03-04T13:30:00Z",
    status: "AVAILABLE",
  },
  {
      id: 8,
    title: "CHUNG CƯ GIÁ RẺ",
    price: 1200000,
    area: 16,
     address: "67 Võ Trứ, Phương Sài, Nha Trang, Khánh Hòa",
      type: { id: 2, name: "chung_cu" },
        features: { pet: false, nearBeach: false, airConditioner: true, pool: false },
    location: "Tây Nha Trang",
    latitude: 12.2481,
  longitude: 109.1853,
    description:
      "Chung cư giá rẻ, phù hợp cho công nhân, sinh viên. Gần khu công nghiệp, xe bus. Có chỗ nấu ăn chung, giặt giũ thoải mái.",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Đinh Thị Lan",
      avatar:
        "https://ui-avatars.com/api/?name=Dinh+Thi+Lan&background=FFC107&color=000",
      contact: "0934567890",
    },
    rating: 3,
    postDate: "1 tuần trước",
    createdAt: "2026-03-03T15:45:00Z",
    status: "AVAILABLE",
  },
  {
        id: 9,
    title: "NHÀ NGUYÊN CĂN CAO CẤP TRUNG TÂM",
    price: 6000000,
    area: 40,
    address: "111 Quang Trung, Lộc Thọ, Nha Trang, Khánh Hòa",
        type: { id: 3, name: "nha_nguyen_can" },
          features: { pet: true, nearBeach: true, airConditioner: true, pool: false },
    location: "Nha Trang Center",
    latitude: 12.2519,
    longitude: 109.1923,
    description:
      "Nhà nguyên căn cao cấp ngay trung tâm thành phố. Đầy đủ tiện nghi 5 sao: máy lạnh inverter, nước nóng, tủ lạnh, máy giặt. Gần Vincom, siêu thị, ngân hàng.",
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Bùi Văn Hùng",
      avatar:
        "https://ui-avatars.com/api/?name=Bui+Van+Hung&background=6610F2&color=fff",
      contact: "0945678901",
    },
    rating: 5,
    postDate: "1 tuần trước",
    createdAt: "2026-03-02T08:30:00Z",
    status: "AVAILABLE",
  },
  {
       id: 10,
    title: "PHÒNG TRỌ GÁC LỬNG",
    price: 2800000,
    area: 22,
    address: "345 Tháp Bà, Vĩnh Thọ, Nha Trang, Khánh Hòa",
      type: { id: 1, name: "phong_tro" },
        features: { pet: false, nearBeach: true, airConditioner: true, pool: true },
    location: "Bắc Nha Trang",
    latitude: 12.266506,
    longitude: 109.202582,
    description:
      "Phòng trọ có gác lửng tiện lợi, tận dụng không gian tối đa. Khu vực yên tĩnh, an ninh tốt. Gần chợ, bến xe, bệnh viện.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Ngô Thị Thu",
      avatar:
        "https://ui-avatars.com/api/?name=Ngo+Thi+Thu&background=20C997&color=fff",
      contact: "0956789012",
    },
    rating: 4,
    postDate: "2 tuần trước",
    createdAt: "2026-03-01T10:00:00Z",
    status: "AVAILABLE",
  },
  {
       id: 11,
    title: "CHUNG CƯ GẦN CHỢ",
    price: 1600000,
    area: 19,
      address: "23 Hoàng Diệu, Vĩnh Nguyên, Nha Trang, Khánh Hòa",
       type: { id: 2, name: "chung_cu" },
           features: { pet: true, nearBeach: true, airConditioner: true, pool: false },
    location: "Nam Nha Trang",
      latitude: 12.2067,
  longitude: 109.2103,
    description:
      "Chung cư gần chợ Đầm, thuận tiện mua sắm. Có wifi, nước nóng, giờ giấc tự do. Phù hợp cho người đi làm, sinh viên.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Đặng Văn Tài",
      avatar:
        "https://ui-avatars.com/api/?name=Dang+Van+Tai&background=FD7E14&color=fff",
      contact: "0967890123",
    },
    rating: 4,
    postDate: "2 tuần trước",
    createdAt: "2026-02-28T14:20:00Z",
    status: "AVAILABLE",
  },
  {
     id: 12,
    title: "NHÀ NGUYÊN CĂN CAO CẤP",
    price: 8000000,
    area: 50,
    address: "456 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
      type: { id: 3, name: "nha_nguyen_can" },
      features: { pet: true, nearBeach: false, airConditioner: false, pool: false },
    location: "Nha Trang Center",
    latitude: 12.2308,
    longitude: 109.1961,

    description:
      "Nhà nguyên căn cao cấp, đầy đủ tiện nghi như khách sạn. Có dịch vụ dọn phòng, giặt là, bảo vệ 24/7. View biển tuyệt đẹp, có hồ bơi chung.",
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
    ],
    imageCount: 4,
    landlord: {
      name: "Mai Văn Khoa",
      avatar:
        "https://ui-avatars.com/api/?name=Mai+Van+Khoa&background=E83E8C&color=fff",
      contact: "0978901234",
    },
    rating: 5,
    postDate: "3 tuần trước",
    createdAt: "2026-02-27T09:10:00Z",
    status: "AVAILABLE",
  },
];

// Mock response theo format API backend
export const mockSearchResponse = {
  content: mockPosts,
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: {
      sorted: true,
      unsorted: false,
      empty: false,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  totalPages: 2,
  totalElements: 12,
  last: false,
  size: 10,
  number: 0,
  sort: {
    sorted: true,
    unsorted: false,
    empty: false,
  },
  numberOfElements: 10,
  first: true,
  empty: false,
};

// Helper function để filter mock data
export const filterMockPosts = (filters = {}) => {
  let filtered = [...mockPosts];

  // Filter by keyword (tìm trong title, address, location, description)
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword) ||
        post.address.toLowerCase().includes(keyword) ||
        post.location.toLowerCase().includes(keyword) ||
        post.description.toLowerCase().includes(keyword),
    );
  }

  // Filter by province
  if (filters.province) {
    const province = filters.province.toLowerCase();
    filtered = filtered.filter((post) =>
      post.location.toLowerCase().includes(province),
    );
  }

  // Filter by commune
  if (filters.commune) {
    const commune = filters.commune.toLowerCase();
    filtered = filtered.filter((post) =>
      post.location.toLowerCase().includes(commune),
    );
  }

  // Filter by price range
  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    filtered = filtered.filter((post) => post.price >= filters.minPrice);
  }
  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    filtered = filtered.filter((post) => post.price <= filters.maxPrice);
  }

  // Filter by area range
  if (filters.minArea !== null && filters.minArea !== undefined) {
    filtered = filtered.filter((post) => post.area >= filters.minArea);
  }
  if (filters.maxArea !== null && filters.maxArea !== undefined) {
    filtered = filtered.filter((post) => post.area <= filters.maxArea);
  }

  // Filter by typeId (nếu có trong data)
  if (filters.typeId !== null && filters.typeId !== undefined) {
    filtered = filtered.filter((post) => post.typeId === filters.typeId);
  }

  return filtered;
};

// Mock API search function
export const mockPostAPI = {
  search: (filters = {}, page = 0, size = 10, sort = "id,desc") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = filterMockPosts(filters);
        // Apply sorting
        if (sort === "id,desc") {
          filtered.sort((a, b) => b.id - a.id);
        } else if (sort === "id,asc") {
          filtered.sort((a, b) => a.id - b.id);
        }

        // Apply pagination
        const start = page * size;
        const end = start + size;
        const paginatedPosts = filtered.slice(start, end);

        const response = {
          content: paginatedPosts,
          pageable: {
            pageNumber: page,
            pageSize: size,
            sort: { sorted: true, unsorted: false, empty: false },
            offset: start,
            paged: true,
            unpaged: false,
          },
          totalPages: Math.ceil(filtered.length / size),
          totalElements: filtered.length,
          last: end >= filtered.length,
          size: size,
          number: page,
          sort: { sorted: true, unsorted: false, empty: false },
          numberOfElements: paginatedPosts.length,
          first: page === 0,
          empty: paginatedPosts.length === 0,
        };

        resolve({ data: response });
      }, 500); // Simulate network delay
    });
  },

  getById: (id) => {
    const numericId = Number(id);
    const post = mockPosts.find((p) => p.id === numericId);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!post) {
          reject({
            response: {
              status: 404,
              data: { message: "Không tìm thấy bài đăng" },
            },
          });
          return;
        }

        resolve({ data: post });
      }, 300);
    });
  },
};
