import { api } from "./api";
import { mockPostAPI } from "mocks/mockPosts";
import axios from "axios";
// Toggle này để bật/tắt mock mode
const USE_MOCK_DATA = false; // Đổi thành false để dùng API thật

// ==================== AUTHENTICATION APIs ====================

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken"); //  sửa lại
  return token ? { Authorization: `Bearer ${token}` } : {};
};
export const authAPI = {
  // Đăng ký tài khoản - POST /api/auth/signup
  signup: (userData) => api.post("/api/auth/signup", userData),

  // Đăng nhập - POST /api/auth/login
  login: (credentials) => api.post("/api/auth/login", credentials),

  // Refresh token - POST /api/auth/refresh
  refreshToken: (refreshToken) =>
    api.post("/api/auth/refresh", { refreshToken }),

  // Đăng xuất - POST /api/auth/logout
  logout: () => api.post("/api/auth/logout"),


  // Lấy thông tin profile - GET /api/auth/profile
    getProfile: () =>
    api.get("/api/auth/profile", {
      headers: getAuthHeader(),
    }),
  // Gửi mã Otp - POST /api/user/sendOtp
  sendOtp: (userData) => api.post("/api/user/sendOtp", userData),

  //  đúng theo backend của bạn
updateProfile: (data) =>
  api.put("/api/auth/profile", data, {
    headers: getAuthHeader(),
  }),

  // Xác thực mã Otp - GET /api/user/verify-otp
  verifyOtp: (email, otp) => api.get("/api/user/verify-otp", { params: { email, otp } }),

  // Quên mật khẩu - POST /api/auth/forgot-password
  forgotPassword: (email) =>
    api.post("/api/auth/forgot-password", { email }),
  
  // Xác minh reset token trong email - GET /api/auth/verify-resettoken-mail?resetToken=...
  verifyResetToken: (resetToken) =>
    api.get("/api/auth/verify-resettoken-mail", { params: { resetToken } }),
  
  // Đổi mật khẩu bằng resetToken - POST /api/auth/change-password
  changePassword: (data) => api.post("/api/auth/change-password", data),
  // Đổi mật khẩu admin khi đã login
changeAdminPassword: (data) =>
  api.put("/api/users/change-password", {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword,
  }),

};

// ==================== POST APIs ====================
export const postAPI = {
  /**
   * Tìm kiếm bài đăng với bộ lọc
   * Backend spec: GET /api/posts/search
   * Thực tế BE thường expect filter được "flatten" thành query params
   * (keyword, minPrice, maxPrice, ...) thay vì searchRequest=<json>
   */
  search: (searchRequest = {}, page = 0, size = 100, sort = "id,desc") =>
    api.get("/api/posts/search", {
      params: {
        ...searchRequest,
        page,
        size,
        sort,
      }
    }),

    // Lấy danh sách bài theo khu vực
getByLocation: (location, page = 0, size = 20) =>
  api.get("/api/posts/search", {
    params: {
      location,
      page,
      size,
    },
  }),

    getPendingPosts: () =>
  api.get("/api/users/posts", {
    headers: getAuthHeader(),
  }),

  //Chuyển đổi trạng thái bài đăng (chờ duyệt, duyệt, từ chối)
  approvePost: (id) =>
  api.put(`/api/users/posts/${id}/approve`, {}, {
    headers: getAuthHeader(),
  }),

  //Chart thống kê tin đăng theo tháng trong năm
  getApprovedStats: () =>
  api.get("/api/users/posts/stats", {
    headers: getAuthHeader(),
  }),

  //hiển thị bài đăng gần nhất được duyệt trên dashboard
  getRecentApprovedPosts: () =>
  api.get("/api/users/posts/recent-approved", {
    headers: getAuthHeader(),
  }),

  //Hiển thị lịch sử bài đăng của user theo tháng
  getPostsByMonth: (month, year) =>
  api.get("/api/users/posts/by-month", {
    params: { month, year },
    headers: getAuthHeader(),
  }),

  // reject bài đăng
rejectPost: (id) =>
  api.put(`/api/users/posts/${id}/reject`, {}, {
    headers: getAuthHeader(),
  }),

  // Get details from one post
  getById: (id) => api.get(`/api/posts/${id}`),

  // Create a new post (For sending files, use multipart/form-data)
  createPost: (formData) => api.post("/api/posts/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  // Get my posts (with pagination)
  getMyPosts: (page = 0, size = 10) => api.get("/api/profile/my-posts", {
    params: {
      page,
      size,
    },
  }),

  // Update my post (id + formData)
  editPost: (id, formData) => api.post(`/api/posts/edit/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  // Delete my post
  deletePost: (id) => api.delete(`/api/posts/delete/${id}`),


  // Lock post (admin)
lockPost: (id) =>
  api.put(`/api/posts/${id}/lock`, {}, {
    headers: getAuthHeader(),
  }),


  unlockPost: (id) =>
  api.put(`/api/posts/${id}/unlock`, {}, {
    headers: getAuthHeader(),
  }),

};

// ==================== HOME APIs ====================
export const homeAPI = {
  getHomeRooms: (page = 0, size = 10) => {
    return api.get("/api/home", {
      params: {
        page,
        size,
      },
    });
  }
}

// ==================== RENTAL PROCEDURES APIs ====================
export const rentalAPI = {
  //  Đặt lịch xem phòng
  registerView: (postId, data) =>
    api.post(`/api/rental-procedures/register-view/${postId}`, data, {
      headers: getAuthHeader(), //  FIX 403
    }),

  //  Lấy danh sách lịch đã đặt (của user hoặc chủ trọ)
  getMyPreOrders: () =>
    api.get("/api/rental-procedures/my-requests", {
      headers: getAuthHeader(), //  cần login
    }),


 getOwnerPreOrders: () =>
  api.get("/api/rental-procedures/owner-requests", {
    headers: getAuthHeader(),
  }),

  //api đặt lịch xem phòng của chủ trọ (chủ trọ xem ai đã đặt lịch xem phòng của mình)
  approvePreOrder: (id) =>
  api.put(`/api/rental-procedures/approve/${id}`, {}, {
    headers: getAuthHeader(),
  }),

// rejectPreOrder: (id) =>
//   api.delete(`/api/rental-procedures/reject/${id}`, {
//     headers: getAuthHeader(),
//   }),

  rejectPreOrder: (id) =>
  api.put(`/api/rental-procedures/reject/${id}`, {}, {
    headers: getAuthHeader(),
  }),
cancelContract: (id) =>
  api.put(`/api/rental-procedures/cancel/${id}`, {}, {
    headers: getAuthHeader(),
  }),

  deletePreOrder: (id) =>
  api.delete(`/api/rental-procedures/delete/${id}`, {
    headers: getAuthHeader(),
  }),
};

// ==================== USER APIs (ADMIN) ====================
export const userAPI = {
  // GET ALL USERS (admin)
  getAll: () =>
    api.get("/api/users", {
      headers: getAuthHeader(),
    }),
getPostsByUser: (id) =>
  api.get(`/api/users/${id}/posts`, {
    headers: getAuthHeader(),
  }),
 
  lockUser: (id) =>
    api.put(`/api/users/lock/${id}`, {}, {
      headers: getAuthHeader(),
    }),

  unlockUser: (id) =>
    api.put(`/api/users/unlock/${id}`, {}, {
      headers: getAuthHeader(),
    }),

  deleteUser: (id) =>
    api.delete(`/api/users/${id}`, {
      headers: getAuthHeader(),
    }),

  

    
};




// ==================== REVIEW APIs ====================
export const reviewAPI = {
  // Get a list of reviews for a post
  getReviewsByPost: (postId) => api.get(`/api/reviews/post/${postId}`),

  // Write a new review
  createReview: (reviewData) => api.post("/api/reviews/create", reviewData),

  // Edit review
  editReview: (reviewId, reviewData) => api.put(`/api/reviews/edit/${reviewId}`, reviewData),

  // Delete review
  deleteReview: (reviewId) => api.delete(`/api/reviews/delete/${reviewId}`),
};

// ==================== FAVORITE APIs ====================
export const favoriteAPI = {
  // Get my favorite posts
  getMyFavorites: (params) => api.get("/api/favorites/my-favorites", { params }),
  
  likePost: (postId) =>
  api.post(`/api/favorites/like/${postId}`, {}, {
    headers: getAuthHeader(),
  }),

unlikePost: (postId) =>
  api.post(`/api/favorites/unlike/${postId}`, {}, {
    headers: getAuthHeader(),
  }),

};