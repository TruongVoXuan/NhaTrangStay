import React, { useEffect, useState } from "react";
import GOOGLE from "components/shared/User/Post/MapSection/MapSection";
import "./PopUpDetail.scss";
import { postAPI } from "lib/apiService";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete";
import { toast } from "react-toastify";

const PopUpDetail = ({
  closePopup,
  autoResize,
  postData, // Nhận dữ liệu phòng từ trang cha truyền vào
}) => {
  // 1. Khởi tạo formData
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    price: "",
    address: "",
    description: "",
    area: "",
    roomQuantity: 1,
    longitude: 109.1899,
    latitude: 12.2388,
  });

  // Images state
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 2. Khi mở Popup, đổ dữ liệu từ BE vào State
  useEffect(() => {
    if (postData) {
      setFormData({
        id: postData.id || "",
        title: postData.title || "",
        price: postData.price || "",
        address: postData.address || "",
        description: postData.description || "",
        area: postData.area || "",
        roomQuantity: postData.roomQuantity || 1,
        typeId: postData.type?.id || 1,
        longitude: postData.longitude || 109.1899,
        latitude: postData.latitude || 12.2388,
      });

      if (postData.images && postData.images.length > 0) {
        setExistingImages(postData.images);
      }
    }
  }, [postData]);

  // 3. Hàm thay đổi dữ liệu chung
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. XỬ LÝ ẢNH CHUYÊN SÂU
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const mappedImages = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages((prev) => [...prev, ...mappedImages]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setDeleteImageIds((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // 5. GỌI API UPDATE (DÙNG FORMDATA)
  const handleUpdate = async () => {
    try {
      const data = new FormData();
      
      data.append("title", formData.title);
      data.append("price", Number(formData.price.toString().replace(/[\.,\s]/g, "")));
      data.append("address", formData.address);
      data.append("description", formData.description);
      data.append("area", formData.area);
      data.append("roomQuantity", Number(formData.roomQuantity));
      data.append("typeId", Number(formData.typeId)); // Đảm bảo truyền số
      data.append("longitude", formData.longitude);
      data.append("latitude", formData.latitude);

      deleteImageIds.forEach((id) => data.append("deleteImageIds", Number(id)));
 
      newImages.forEach((img) => data.append("newImages", img.file));

      await postAPI.editPost(formData.id, data);
      
      toast.success("Cập nhật bài đăng thành công!");
      closePopup();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error(error.response?.data?.message || "Lỗi cập nhật bài đăng");
    }
  };

  return (
    <div className="edit-popup-overlay">
      <div className="edit-popup">
        <div className="popup-header">
          <h3>Chỉnh sửa tin đăng</h3>
          <button onClick={closePopup}>✕</button>
        </div>

        <div className="popup-body">
          {/* ĐỊA CHỈ */}
          <h4 className="section-title">📍 Địa chỉ cho thuê</h4>
          <input
            name="address"
            placeholder="Số nhà, tên đường..."
            value={formData.address}
            onChange={handleChange}
          />

          {/* HIỂN THỊ BẢN ĐỒ: Dùng cả địa chỉ và tọa độ */}
          <div className="map-box" style={{ height: "300px" }}>
  <GOOGLE
    lat={formData.latitude}
    lng={formData.longitude}
     searchAddress={formData.address}
    province="" // nếu có thì truyền
    district=""
    ward=""
    markers={[
      {
        id: formData.id,
        lat: formData.latitude,
        lng: formData.longitude,
        title: formData.title,
        price: formData.price,
        images: existingImages?.[0]?.url,
      },
    ]}
    currentPostId={formData.id}
    onChange={(data) => {
      //  update lại form khi click map
      setFormData((prev) => ({
        ...prev,
        latitude: data.lat,
        longitude: data.lng,
        address: data.fullAddress || prev.address,
      }));
    }}
  />
</div>

          {/* THÔNG TIN BÀI VIẾT */}
          <div className="post-info-section">
            <h4 className="section-title"> Thông tin bài viết</h4>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Tiêu đề bài viết"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onInput={autoResize}
              placeholder="Mô tả chi tiết..."
            />
          </div>

          {/* ĐẶC ĐIỂM */}
          <h4 className="section-title"> Thông tin đặc điểm</h4>
          <div className="form-row">
            <input
              name="area"
              type="number"
              value={formData.area}
              onChange={handleChange}
              placeholder="Diện tích"
            />
            {/* <select
              name="roomQuantity"
              value={formData.roomQuantity}
              onChange={handleChange}
            >
              <option value={0}>0 Phòng ngủ</option>
              <option value={1}>1 Phòng ngủ</option>
              <option value={2}>2 Phòng ngủ</option>
              <option value={3}>3 Phòng ngủ</option>
            </select> */}

            <select
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
            >
              <option value={1}>Phòng Trọ</option>
              <option value={2}>Căn Hộ</option>
              <option value={3}>Kí Túc Xá</option>
            </select>
          </div>

          <div className="form-row">
            <input
              name="price"
              type="text"
              value={formData.price}
              onChange={handleChange}
              placeholder="Giá thuê"
            />
          </div>

          {/* HÌNH ẢNH (Phần này bạn giữ nguyên logic cũ) */}
          <h4 className="section-title">Hình ảnh & Video</h4>
          <div className="upload-box">
            <p>Kéo và thả ảnh tại đây</p>
            <input type="file" multiple onChange={handleImageUpload} />
          </div>

          <div className="preview-images">
            {/* Ảnh Cũ */}
            {existingImages.map((img) => (
              <div className="image-item" key={`old-${img.id}`}>
                <img src={img.url} alt="old-pic" />
                <button
                  className="remove-btn"
                  onClick={() => removeExistingImage(img.id)}
                >✕</button>
              </div>
            ))}

            {/* Ảnh Mới */}
            {newImages.map((img, index) => (
              <div className="image-item" key={`new-${index}`}>
                <img src={img.preview} alt="new-pic" />
                <button
                  className="remove-btn"
                  onClick={() => removeNewImage(index)}
                >✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="popup-footer">
          <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>
            🗑 XÓA
          </button>
          <button className="update-btn" onClick={handleUpdate}>
            ➤ CẬP NHẬT
          </button>
          <button className="cancel-btn" onClick={closePopup}>
            Hủy
          </button>
        </div>

        {/* NÚT XÓA KHÔNG FIX CỨNG ID NỮA MÀ LẤY TỪ FORMDATA */}
        {showDeleteConfirm && (
          <ConfirmDelete 
            setShowDeleteConfirm={setShowDeleteConfirm} 
            IDPost={formData.id} 
            setShowEditPopup={closePopup}
          />
        )}
      </div>
    </div>
  );
};

export default PopUpDetail;