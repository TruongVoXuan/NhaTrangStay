const USER_KEY = "authUser"; // Khóa để lưu/lấy thông tin user trong localStorage
const TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// ==================== USER MANAGEMENT ====================
export function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error("Error setting user:", error);
  }
}
// ==================== ROLE MANAGEMENT ====================
export function getCurrentRole() {
  const user = getCurrentUser();
  const role = user?.role || user?.Role;
  return role ? role.toUpperCase() : null;
}

export function isAdmin() {
  return getCurrentRole() === "ADMIN";
}

export function isUser() {
  return getCurrentRole() === "USER";
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}



// ==================== TOKEN MANAGEMENT ====================
export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error setting token:", error);
  }
}

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token) {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error setting refresh token:", error);
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

// ==================== AUTHENTICATION ====================
export function isAuthenticated() {
  return !!getAuthToken();
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ==================== PACKAGE/SUBSCRIPTION ====================
export function getCurrentPackage() {
  const user = getCurrentUser();
  return user?.package || user?.subscription || "FREE";
}

export function isPro() {
  const pkg = getCurrentPackage();
  return pkg === "PRO" || pkg === "pro";
}

export function canPostMoreRooms() {
  const user = getCurrentUser();
  const postCount = user?.roomCount || user?.postCount || 0;

  if (isPro()) {
    return true; // Pro không giới hạn
  }

  // Free chỉ được đăng 2-3 tin
  const freeLimit = 3;
  return postCount < freeLimit;
}
