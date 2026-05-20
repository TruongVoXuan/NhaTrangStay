import React, { useEffect, useState, useRef } from "react";

import "./AdminSetting.scss";
import { toast } from "react-toastify";
import { authAPI } from "lib/apiService";
import { supabase } from "lib/supabaseClient";
import Avatar from "components/shared/common/Avatar";
import {
  Pen,
  Lock,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
const AdminSetting = () => {
  const fileInputRef = useRef(null);

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
const [showPassword, setShowPassword] = useState({
  current: false,
  new: false,
});
  const [user, setUser] = useState({
    id: null,
    username: "",
    email: "",
    avatar: "",
    phone: "",
  });

  const [temp, setTemp] = useState({
    username: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",

  });

  // ================= FETCH PROFILE =================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await authAPI.getProfile();
      const data = res.data;

      setUser(data);

      setTemp({
        username: data.username || "",
        avatar: data.avatar || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTemp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      setSaving(true);

      
    // nếu có nhập password thì bắt buộc đủ cả 2
   if (!temp.currentPassword || !temp.newPassword) {
  toast.warning("Vui lòng nhập mật khẩu");
  return;
}

      // ================= UPLOAD AVATAR =================
      let avatarUrl = temp.avatar;

      if (avatarFile) {
        const fileName = `admin-avatar-${Date.now()}`;

        const { error } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (error) throw error;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = data.publicUrl;
      }

      // ================= UPDATE PROFILE =================
      await authAPI.updateProfile({
        username: temp.username,
        email: user.email,
        phone: user.phone || "",
        avatar: avatarUrl,
      });

      // ================= CHANGE PASSWORD =================
      if (temp.currentPassword && temp.newPassword) {
       await authAPI.changeAdminPassword({
  currentPassword: temp.currentPassword.trim(),
  newPassword: temp.newPassword.trim(),
});
      }

      toast.success("Cập nhật thành công!");

      setEdit(false);
      setAvatarFile(null);

      fetchProfile();
    } catch (err) {
      console.log(err);
        //  check lỗi backend trả về sai mật khẩu
    if (err?.response?.status === 400 || err?.response?.status === 403) {
      toast.error("Mật khẩu cũ chưa khớp");
    } else {
      toast.error("Cập nhật thất bại");
    }
  } finally {
      setSaving(false);
    }
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setEdit(false);

    setTemp({
      username: user.username || "",
      avatar: user.avatar || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setAvatarFile(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-setting-page">
      <div className="setting-card">

        {/* HEADER */}
        <div className="top-header">
          <h2>Admin Settings</h2>

          {!edit ? (
            <button className="edit-btn" onClick={() => setEdit(true)}>
              <Pen size={16} />
              Chỉnh sửa
            </button>
          ) : (
            <div className="action-group">
              <button className="cancel-btn" onClick={handleCancel}>
                <X size={16} />
                Hủy
              </button>

              <button className="save-btn" onClick={handleSave}>
                <Save size={16} />
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          )}
        </div>

        {/* AVATAR */}
        <div className="avatar-section">
          <Avatar
            className="avatar-img"
            src={temp.avatar}
          />

          {edit && (
            <>
              <input
                hidden
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setAvatarFile(file);

                  setTemp((prev) => ({
                    ...prev,
                    avatar: URL.createObjectURL(file),
                  }));
                }}
              />

              <button
                className="change-avatar-btn"
                onClick={() => fileInputRef.current.click()}
              >
                Đổi avatar
              </button>
            </>
          )}
        </div>

        {/* FORM */}
        <div className="form-grid">

          <div className="form-group">
            <label>Tên admin</label>
            <input
              name="username"
              value={temp.username}
              onChange={handleChange}
              readOnly={!edit}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={user.email} readOnly />
          </div>

          <div className="form-group password-field">
  <label>
    <Lock size={16} />
    Mật khẩu hiện tại
  </label>

  <div className="input-wrapper">
    <input
      type={showPassword.current ? "text" : "password"}
      name="currentPassword"
      value={temp.currentPassword}
      onChange={handleChange}
      readOnly={!edit}
    />

    {edit && (
      <span
        className="eye-icon"
        onClick={() =>
          setShowPassword((prev) => ({
            ...prev,
            current: !prev.current,
          }))
        }
      >
        {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
      </span>
    )}
  </div>
</div>

          <div className="form-group password-field">
  <label>Mật khẩu mới</label>

  <div className="input-wrapper">
    <input
      type={showPassword.new ? "text" : "password"}
      name="newPassword"
      value={temp.newPassword}
      onChange={handleChange}
      readOnly={!edit}
    />

    {edit && (
      <span
        className="eye-icon"
        onClick={() =>
          setShowPassword((prev) => ({
            ...prev,
            new: !prev.new,
          }))
        }
      >
        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
      </span>
    )}
  </div>
</div>


        </div>
      </div>
    </div>
  );
};

export default AdminSetting;