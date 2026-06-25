import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import RoleBasedRoute from "./RoleBasedRoute";

import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";

import PostDetailPage from "pages/User/PostDetail/PostDetailPage";

import LoginPage from "../pages/Auth/LoginPage/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage/ResetPasswordPage";

import HomePage from "../pages/User/Home/HomePage";
import InforBase from "components/shared/User/Post/InforBase/InforBase";
import HistoryTransactionPage from "pages/User/HistoryTransaction/HistoryTransactionPage";
import ProfilePage from "pages/User/Profile/ProfilePage";
import PreOrderPage from "pages/User/PreOrderPage/PreOrderPage";
import PreOrderManage from "components/shared/User/Management/PreOrderManage/PreOrderManage";
import ManagePostPage from "pages/User/ManagePostPage/ManagePostPage";
import FavoritePostsPage from "pages/User/FavoritePosts/FavoritePostsPage";

import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "pages/Admin/Dashboard/DashboardPage";

import AdminUsers from "pages/Admin/AdminUser/AdminUsers";
import PostViewAdmin from "pages/Admin/PostViewAdmin/PostViewAdmin";

import PendingPostsPage from "pages/Admin/PendingPostsPage/PendingPostsPage";

import AdminSetting from "pages/Admin/AdminSetting/AdminSetting";
export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= AUTH ================= */}
      <Route element={<AuthRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

    {/* ================= ADMIN ================= */}
<Route
  path="/admin"
  element={
    <RoleBasedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout />
    </RoleBasedRoute>
  }
>
  <Route path="dashboard" element={<DashboardPage />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="users/:id/posts" element={<PostViewAdmin />} />
      <Route path="pending-posts" element={<PendingPostsPage />} />

      <Route
  path="/admin/settings" element={<AdminSetting />}/>
</Route>
      {/* ================= USER ================= */}
      <Route element={<UserLayout />}>
        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />

        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/khu-vuc/:location" element={<PostDetailPage />} />
        <Route path="/browse" element={<PostDetailPage />} />

        <Route path="/post" element={<InforBase />} />

        {/* PRIVATE (FIX CHUẨN) */}
        <Route
          path="/user/profile"
          element={
            <RoleBasedRoute allowedRoles={["USER"]}>
              <ProfilePage />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/user/pre-order"
          element={
            <RoleBasedRoute allowedRoles={["USER"]}>
                <PreOrderPage />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/user/pre-order/:id"
          element={
            <RoleBasedRoute allowedRoles={["USER"]}>
              <PreOrderPage />
            </RoleBasedRoute>
          }
        />
<Route
  path="/user/my-preorders"
  element={
    <RoleBasedRoute allowedRoles={["USER"]}>
      <HistoryTransactionPage />
    </RoleBasedRoute>
  }
/>
        <Route
          path="/user/manage-post"
          element={
            <RoleBasedRoute allowedRoles={["USER"]}>
              <ManagePostPage />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/user/favorites"
          element={
            <RoleBasedRoute allowedRoles={["USER"]}>
              <FavoritePostsPage />
            </RoleBasedRoute>
          }
        />
      </Route>

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}