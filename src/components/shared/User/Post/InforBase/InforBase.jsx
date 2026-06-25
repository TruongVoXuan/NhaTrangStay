import React, { useEffect, useState } from "react";
import "./InforBase.scss";
import locationPost from "assets/icons/locationPost.png";
import document from "assets/icons/document.png";
import notice from "assets/icons/notice.png";
import contact from "assets/icons/contact.png";
import picture from "assets/icons/picture.png";
import upload from "assets/icons/upload.png";
import GOOGLE from "../MapSection/MapSection";
import map from "assets/icons/map.png";
import { toast } from "react-toastify";
import { AlertTriangle, XCircle, CheckCircle, Bot } from "lucide-react";
const InforBase = () => {
    const [typeId, setTypeId] = useState("");

    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");

    const [addressDetail, setAddressDetail] = useState("");



    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [area, setArea] = useState("");

    const [roomQuantity, _setRoomQuantity] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    

    const handleMapChange = (data) => {

        setAddressDetail(data.fullAddress);

        setLatitude(data.lat);
        setLongitude(data.lng);
    };


    const handleSubmit = async () => {

        const token = localStorage.getItem("authToken");

        if (!token) {
            toast.error("Bạn chưa đăng nhập")
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("price", price);
        formData.append("area", area);
        formData.append("roomQuantity", roomQuantity);
        formData.append("typeId", Number(typeId));
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("address", addressDetail);
        formData.append("description", description);

        // nếu có ảnh
        images.forEach((img) => {
            formData.append("images", img);
        });

        try {

            const res = await fetch("http://localhost:8080/api/posts/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json().catch(() => null);

            console.log("STATUS:", res.status);
            console.log("RESPONSE:", data);

            if (res.ok) {

                toast.success("Đăng bài thành công!")

                setTitle("");
                setDescription("");
                setPrice("");
                setArea("");
                _setRoomQuantity(0);

                setAddressDetail("");
                setLatitude(0);
                setLongitude(0);

                setProvince("");
                setDistrict("");
                setWard("");

                setProvinceName("");
                setDistrictName("");
                setWardName("");

                setImages([]);

            } else {
                toast.error(data?.message || "Đăng bài that bại")
            }

        } catch (error) {
            console.log(error);
            toast.error("Không thể kết nối server")
        }
    };

    //Up images
    const [images, setImages] = useState([]);
    const maxImages = 6; // bạn chỉnh số lượng tối đa ở đây 

    // ===== ADD IMAGE =====
    const handleAddImage = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const MAX_SIZE = 1 * 1024 * 1024; // 1MB

        // lọc file hợp lệ
        const validFiles = files.filter(file => {

            // chỉ cho upload ảnh
            if (!file.type.startsWith("image/")) {
                toast.warning(`${file.name} không phải file ảnh`);
                return false;
            }

            // kiểm tra kích thước
            if (file.size > MAX_SIZE) {
                toast.warning(`Ảnh ${file.name} vượt quá 1MB`);
                return false;
            }

            return true;
        });

        const remaining = maxImages - images.length;
        if (remaining <= 0) return;

        setImages((prev) => [
            ...prev,
            ...validFiles.slice(0, remaining),
        ]);

        e.target.value = null;
    };
    // ===== REMOVE IMAGE =====
    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };


    //Drag and drop images

    const [isDragging, setIsDragging] = useState(false);

    // ===== HANDLE DRAG =====
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (!files.length) return;

        const MAX_SIZE = 1 * 1024 * 1024; // 1MB

        // lọc file hợp lệ
        const validFiles = files.filter(file => {
            if (file.size > MAX_SIZE) {
                toast.warning(`Ảnh ${file.name} vượt quá 1MB`);
                return false;
            }
            return true;
        });

        const remaining = maxImages - images.length;
        if (remaining <= 0) return;

        setImages((prev) => [
            ...prev,
            ...validFiles.slice(0, remaining),
        ]);
    };



    // ================= STATE =================
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");

   // ================= LOAD KHÁNH HÒA + VỊ TRÍ USER =================
useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/56?depth=3")
        .then(res => res.json())
        .then(data => {
            setProvinceName(data.name);

            // QUAN TRỌNG: luôn lấy districts kèm wards
            setDistricts(data.districts || []);
        })
        .catch(err => console.error(err));
}, []);


// ================= HANDLE DISTRICT =================
const handleDistrictChange = async (e) => {
    const code = e.target.value;

    setDistrict(code);
    const selectedDistrict = districts.find(d => d.code == code);
    setDistrictName(selectedDistrict?.name || "");

    setWard("");
    setWardName("");
    setWards([]);

    try {
        const res = await fetch(
            `https://provinces.open-api.vn/api/d/${code}?depth=2`
        );

        const data = await res.json();

        setWards(data.wards || []);
    } catch (err) {
        console.error("Load wards error:", err);
    }
};

// ================= HANDLE WARD =================
const handleWardChange = (e) => {
    const code = e.target.value;
    const selectedWard = wards.find(w => w.code == code);

    setWard(code);
    setWardName(selectedWard?.name || "");
};

    return (
        <div className="post-page">
            <div className="container">
                <h1 className="page-title">Đăng Tin Cho Thuê</h1>
                <p className="page-subtitle">
                    Vui lòng cung cấp thông tin chính xác để bài đăng của bạn sớm được duyệt
                </p>

                {/* ADDRESS + NOTE */}
                <div className="row two-cols">
                    <div className="card">
                        <h3 className="card-title">
                            <img src={locationPost} alt="location" className="title-icon" />
                            Địa chỉ cho thuê
                        </h3>

                        {/* TỈNH */}
                        <div className="form-group">
                            
                            <div className="form-group">
    <label>Tỉnh / Thành Phố</label>
    <input value={provinceName} disabled />
</div>
                        </div>

                       

                        <div className="form-group address-detail">
                            <label>Địa Chỉ Cụ Thể</label>
                            <textarea
                                rows="2"
                                placeholder="Nhập địa chỉ cụ thể ..."
                                value={addressDetail}
                                onChange={(e) => setAddressDetail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="card">
                        <div className="info-base__map">
                            <h3 className="card-title">
                                <img src={map} alt="map" className="title-icon" />
                                Vị trí trên bản đồ
                            </h3>
                            <div className="map-placeholder">
                               <GOOGLE
    onChange={handleMapChange}
    lat={latitude}
    lng={longitude}
    searchAddress={addressDetail}
      ward={wardName}
      district={districtName}
    province={districtName ? provinceName : ""}
     type={typeId}
       
/>
                            </div>
                        </div>
                    </div>

                </div>

                {/* POST INFO */}
                <div className="card">
                    <h3 className="card-title">
                        <img src={document} alt="document" className="title-icon" />
                        Thông tin bài viết
                    </h3>

                    <div className="form-group short-input1">
                        <label>Tiêu đề đăng tin</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ví dụ: Phòng cho thuê 20m vuông tại..."
                        />
                    </div>

                    <div className="form-group short-input2">
                        <label>Nội dung mô tả</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả chi tiết..."
                        />
                    </div>
                </div>

                {/* FEATURES + SUPPORT */}
                <div className="row two-cols">
                    <div className="card">
                        <h3 className="card-title">
                            <img src={notice} alt="notice" className="title-icon" />
                            Thông tin đặc điểm
                        </h3>

                        <div className="row">
                            <div className="form-group">
                                <label>Diện tích (m²)</label>
                                <input
                                    type="text"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    placeholder="Ví dụ: 25"
                                />
                            </div>

                            {/* <div className="form-group label-sophong">
                                <label>Số phòng trống</label>
                                <select>
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                </select>
                            </div> */}
                        </div>

                        <div className="form-group short-input">
                            <label>Loại hình</label>

                            <select value={typeId} onChange={(e) => setTypeId(Number(e.target.value))}>
                                <option value="">Chọn loại hình</option>
                                <option value={1}>Phòng Trọ</option>
                                <option value={2}>Chung cư</option>
                                <option value={3}>Nhà Nguyên Căn</option>
                            </select>

                        </div>

                        <div className="form-group short-input">
                            <label>Giá tiền (VNĐ)</label>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Ví dụ: 3.200.000"
                            />
                        </div>
                    </div>

                    <div className="support-box">
<h2><AlertTriangle size={20} /> Lưu ý khi đăng bài</h2>
<ul className="notice-list">
<li><XCircle size={14} color="#e53e3e" /> Không dùng từ ngữ <b>bạo lực, tục tĩu, xúc phạm</b></li>
<li><XCircle size={14} color="#e53e3e" /> Không đăng nội dung <b>lừa đảo, scam</b></li>
<li><XCircle size={14} color="#e53e3e" /> Không chèn <b>link </b> trong mô tả</li>
<li><XCircle size={14} color="#e53e3e" /> Không đăng <b>ảnh nhạy cảm, bạo lực, 18+</b></li>
<li><CheckCircle size={14} color="#38a169" /> Mô tả <b>trung thực, rõ ràng</b> về phòng</li>
<li><CheckCircle size={14} color="#38a169" /> Ảnh <b>thực tế</b> của phòng cho thuê</li>
</ul>
<div className="notice-footer">
<Bot size={14} /> Bài đăng vi phạm sẽ bị <b>từ chối tự động</b> và thông báo qua email
</div>
</div>
                </div>

                {/* UPLOAD */}
                <div className="card">
                    <h3 className="card-title">
                        <img src={picture} alt="picture" className="title-icon" />
                        Hình ảnh & Video
                    </h3>

                    {/* Upload Box */}
                    <div
                        className={`upload-box ${isDragging ? "dragging" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <label className="upload-area">
                            <div className="upload-icon">
                                <img src={upload} alt="upload" className="title-icon" />
                            </div>

                            <h3>Kéo và thả ảnh hoặc video tại đây</h3>
                            <span>Hoặc click để chọn từ thiết bị của bạn</span>

                            <input
                                type="file"
                                multiple
                                hidden
                                accept="image/*"
                                onChange={handleAddImage}
                            />
                        </label>
                    </div>

                    {/* Preview */}
                    {images.length > 0 && (
                        <div className="image-preview">
                            {images.map((file, index) => (
                                <div className="preview-item" key={index}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`upload-${index}`}
                                    />

                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="upload-note">
                        Bạn đã chọn {images.length}/{maxImages} ảnh
                    </p>
                </div>

                {/* BUTTON */}
                <button className="submit-btn" onClick={handleSubmit}>
                    ➤ ĐĂNG TIN NGAY
                </button>
            </div>
        </div>
    );
}

export default InforBase;