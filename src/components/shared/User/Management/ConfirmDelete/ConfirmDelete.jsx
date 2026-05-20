import React from "react";
import "./ConfirmDelete.scss";
import { toast } from "react-toastify";
import { postAPI } from "lib/apiService";

const ConfirmDelete = ({ setShowDeleteConfirm, IDPost, setShowEditPopup }) => {
  const handleDeletePost = async () => {
    try {
      await postAPI.deletePost(IDPost);
      toast.success("🗑 Xóa bài đăng thành công!");
      setShowDeleteConfirm(false);
      if (setShowEditPopup) {
        setShowEditPopup(); 
      }
    } catch (error) {
      console.error("Lỗi xóa bài:", error);
      toast.error(error.response?.data?.message || "Xóa bài thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="main-delete-confirm-container">
      <div className="delete-confirm-box">
        <h3 className="title-delete-confirm">
          Bạn có chắc muốn xóa{" "}
          <span style={{ color: "#BA8713" }}>bài đăng</span> này không?
        </h3>
        <hr className="delete-line" />
        <div className="button-confirm-delete-container">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="button-confirm-cancel-delete"
          >
            Hủy
          </button>
          <button
            onClick={handleDeletePost}
            className="button-confirm-delete"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;