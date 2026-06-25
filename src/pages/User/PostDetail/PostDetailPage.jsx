import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postAPI } from "lib/apiService";
import { CalendarDays } from "lucide-react";
import { useAuth } from "hooks/useAuth";
import ReviewSection from "components/shared/User/Post/ReviewSection/ReviewSection";
import { useLocation } from "react-router-dom";
import { rentalAPI } from "lib/apiService";

import {
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
} from "lucide-react";
import "./PostDetailPage.scss";
import GOOGLE from "components/shared/User/Post/MapSection/MapSection";

const formatVnd = (value) => {
  try {
    return Number(value || 0).toLocaleString("vi-VN");
  } catch {
    return value;
  }
};





export default function PostDetailPage() {

const { user: currentUser } = useAuth();
  const [post, setPost] = useState(null);
const owner = post?.user;
   const params = useParams();

  console.log("PATH:", window.location.pathname);
  console.log("PARAMS:", params);

  const locationHook = useLocation();
  const query = new URLSearchParams(locationHook.search);
  const { id, location: rawLocation } = params;

  const location =
    rawLocation && rawLocation !== "null" ? rawLocation : null;



const [filters, setFilters] = useState({
  priceMin: "",
  priceMax: "",
  type: "",
  pet: false,
  nearBeach: false,
  airConditioner: false,
  pool: false,
});

// useEffect(() => {
//   const priceMin = query.get("priceMin");
//   const priceMax = query.get("priceMax");
//   const type = query.get("type");

//   setFilters((prev) => ({
//     ...prev,
//     priceMin: priceMin ? Number(priceMin) : "",
//     priceMax: priceMax ? Number(priceMax) : "",
//     type: type ? Number(type) : "",
//   }));
// }, [locationHook.search]);

useEffect(() => {
  const params = new URLSearchParams(locationHook.search);

  setFilters((prev) => ({
    ...prev,
    priceMin: Number(params.get("priceMin")) || "",
    priceMax: Number(params.get("priceMax")) || "",
    type: params.get("type") ? Number(params.get("type")) : "",
  }));
}, [locationHook.search]);


const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // bỏ dấu
};


const hasKeyword = (text, keywords) => {
  const normalized = normalizeText(text);
  return keywords.some((kw) => normalized.includes(kw));
};


const [priceOpen, setPriceOpen] = useState(false);

const [minPrice, setMinPrice] = useState(0);
const [maxPrice, setMaxPrice] = useState(20000000); // 20tr

const [priceRange, setPriceRange] = useState([0, 20000000]);

const [posts, setPosts] = useState([]);

const isDetailMode = !!id;
const isLocationMode = !!location;
const isHomeMode = !id && !location;
const isListMode = isLocationMode || isHomeMode;
const getShortLocation = (location) => {
  if (!location) return "";

  // bỏ dấu + lowercase
  const normalized = location
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("nha trang")) {
    if (normalized.includes("bac")) return "Bắc Nha Trang";
    if (normalized.includes("nam")) return "Nam Nha Trang";
    if (normalized.includes("tay")) return "Tây Nha Trang";

    return "Trung Tâm Nha Trang";
  }

  return location;
};

useEffect(() => {
  if (!isHomeMode) return;

  setLoading(true);

  postAPI.search(filters, 0, 500)
    .then((res) => {
      setPosts(res.data?.content || res.data || []);
    })
    .finally(() => setLoading(false));
}, [isHomeMode]);
  //Tìm kiếm theo các chỉ tiêu
const filteredPosts = useMemo(() => {
  let data = posts;

  //  CHỈ filter location khi có location mode
  if (isLocationMode && location) {
    const normalizedLocation = normalizeText(decodeURIComponent(location));

    console.log("LOCATION PARAM:", decodeURIComponent(location));
    console.log("POSTS:", posts);

    data = data.filter((item) => {
      const itemLocation = normalizeText(item.location || "");

      if (
        !itemLocation.includes(normalizedLocation) &&
        !normalizedLocation.includes(itemLocation)
      )
        return false;

      return true;
    });
  }

  //  GIỮ NGUYÊN TOÀN BỘ FILTER
  return data.filter((item) => {
    if (filters.priceMin && item.price < filters.priceMin) return false;
    if (filters.priceMax && item.price > filters.priceMax) return false;

    if (filters.type && item.type?.id !== filters.type) return false;

    const desc = item.description || "";

    //  PET
    if (
      filters.pet &&
      !hasKeyword(desc, ["thu cung", "cho nuoi", "pet"])
    )
      return false;

    //  GẦN BIỂN
    if (
      filters.nearBeach &&
      !hasKeyword(desc, ["gan bien", "view bien", "sat bien"])
    )
      return false;

    //  MÁY LẠNH
    if (
      filters.airConditioner &&
      !hasKeyword(desc, ["may lanh", "dieu hoa", "air conditioner"])
    )
      return false;

    //  HỒ BƠI
    if (
      filters.pool &&
      !hasKeyword(desc, ["ho boi", "pool"])
    )
      return false;

    return true;
  });
}, [location, filters, posts, isLocationMode]);




  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const mapQuery = useMemo(
    () => (post ? post.address || post.location || "" : ""),
    [post]
  );

  const googleEmbedUrl = useMemo(() => {
    if (!mapQuery) return null;
    return `https://www.google.com/maps?q=${encodeURIComponent(
      mapQuery
    )}&output=embed`;
  }, [mapQuery]);

useEffect(() => {
  if (isLocationMode) return;

  setLoading(true);

  postAPI.getById(id)
    .then((res) => {
      setPost(res.data);
    })
    .catch(() => {
    
    })
    .finally(() => {
      setLoading(false);
    });
}, [id, isLocationMode]);


useEffect(() => {
  if (!isLocationMode || !location) return;

  setLoading(true);

  postAPI.getByLocation(decodeURIComponent(location))
    .then((res) => {
      setPosts(res.data?.content || res.data || []);
    })
    .catch(() => {
      toast.error("Lỗi tải danh sách bài đăng");
    })
    .finally(() => {
      setLoading(false);
    });
}, [location, isLocationMode]);

useEffect(() => {
  const handler = (e) => {
    const newId = e.detail;

    setLoading(true);

    postAPI.getById(newId).then((res) => {
      setPost(res.data);
      setLoading(false);
    });

    //  update URL nhưng KHÔNG reload
    navigate(`/post/${newId}`, { replace: true });
  };

  window.addEventListener("changePost", handler);

  return () => {
    window.removeEventListener("changePost", handler);
  };
}, []);

  
const images = useMemo(() => {
  if (!post?.images) return [];
  return post.images.map(img => img.url);
}, [post]);
  const activeImage = images[activeImageIndex] || images[0];

  const handlePrev = () => {
    if (!images.length) return;
    setActiveImageIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  const handleNext = () => {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };
const handlePreOrder = async () => {

   if (currentUser?.id === post?.user?.id) {
    toast.warning("Bạn là chủ phòng này rồi, không thể đặt lịch xem phòng!");
    return;
  }
  try {
    await rentalAPI.registerView(post.id, {});

    toast.success("Đặt lịch thành công!");
  } catch (err) {
    const message =
      err.response?.data?.message || err.response?.data || "";

    if (message.includes("đã đặt phòng này rồi")) {
      toast.warning("Bạn đã đặt phòng này rồi, vui lòng đợi Chủ phòng xem xét");
    } else if (message.includes("Phòng đã có người đặt")) {
      toast.warning("Phòng đã có người đặt trước, vui lòng liên hệ chủ phòng");
    } else {
      toast.error("Có lỗi xảy ra, thử lại sau!");
    }
  }
};
  const locationLabelMap = {
  "Nha Trang Center": "Trung tâm Nha Trang",
  "Bắc Nha Trang": "Bắc Nha Trang",
  "Nam Nha Trang": "Nam Nha Trang",
  "Tây Nha Trang": "Tây Nha Trang",
};

const locationLabel = isLocationMode
  ? getShortLocation(decodeURIComponent(location))
  : locationLabelMap[post?.location] || "Khu vực";

  // ================= LOADING =================
  if (loading) {
    return (
      
      <div className="post-detail-layout">
        <div className="map-fixed" />
        <div className="post-detail-content">
          <div className="post-detail-loading">
            Đang tải chi tiết bài đăng...
          </div>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!post && !isLocationMode) {
    return (
      
      <div className="post-detail-layout">
        <div className="map-fixed" />
        <div className="post-detail-content">
          <div className="post-detail-notfound">
            <p>Không tìm thấy bài đăng.</p>
            <button className="btn" onClick={() => navigate(-1)}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }






  // ================= MAIN =================
  // ================= MAIN =================
return (
  <>
   

    <div
      className={`post-detail-layout ${
        isListMode ? "list-mode" : ""
      }`}
    >
      {/* LEFT - MAP FIXED */}
     
<div className="map-fixed">
<GOOGLE
  markers={
  (isListMode ? filteredPosts : post ? [post] : []).map((item) => {
    console.log("RAW ITEM:", item);
    console.log("RAW IMAGES:", item.images);

    const raw = item.images?.[0]?.url;

    console.log("RAW URL:", raw, "TYPE:", typeof raw);

    const img =
      typeof raw === "string"
        ? raw
        : raw?.path || "";

    console.log("FINAL IMG:", img);

    return {
      id: item.id,
      lat: item.latitude,
      lng: item.longitude,
      title: item.title,
      price: item.price,
       type: item.typeId || item.type?.id,
      images: img,
    };
  })
}
lat={post?.latitude}
lng={post?.longitude}
currentPostId={post?.id}

/>

      </div>

    

      {/* RIGHT - CONTENT SCROLL */}
      <div className="post-detail-content">
        <div className="post-detail-page">
          {/* BREADCRUMB */}
          <div className="post-detail-breadcrumb">
<span
  className={`crumb ${isHomeMode ? "active" : ""}`}
  onClick={() => navigate("/browse")}
>
  Trang chủ
</span>


  <span className="sep">/</span>

  {/* ĐỊA ĐIỂM */}
  <span
    className={`crumb ${isLocationMode ? "active" : ""}`}
    onClick={() => {
 const targetLocation = isLocationMode
  ? location
  : post?.location || post?.address;

if (!targetLocation || targetLocation === "null") {
 
  return;
}

const shortLocation = getShortLocation(targetLocation);

navigate(`/khu-vuc/${encodeURIComponent(shortLocation)}`);
}}
  >
    {locationLabel}
  </span>

  <span className="sep">/</span>

  {/* CHI TIẾT */}
  <span
    className={`crumb ${!isLocationMode ? "active" : ""}`}
  >
    Chi tiết bài viết
  </span>
</div>

<div className="post-detail-grid">
  {/* MAIN */}
  {!isDetailMode ? (
    <div className="post-list">
      <h2 className="list-title">
        {isHomeMode
          ? "Tất cả bài đăng"
            : `Khu vực: ${getShortLocation(decodeURIComponent(location))}`}
      </h2>

      <div className="filter-bar">
        {/* PRICE */}
        <div className="price-dropdown">
          <button
            className="dropdown-btn"
            onClick={() => setPriceOpen(!priceOpen)}
            type="button"
          >
            {priceRange[0] === 0 && priceRange[1] === 20000000
              ? "Mọi mức giá"
              : `${formatVnd(priceRange[0])} - ${formatVnd(priceRange[1])}`}
          </button>

          {priceOpen && (
            <div className="dropdown-panel">
              <h4>Khoảng giá</h4>

              <div className="price-inputs">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(
                      Math.min(Number(e.target.value), maxPrice - 100000)
                    )
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      Math.max(Number(e.target.value), minPrice + 100000)
                    )
                  }
                />
              </div>

              <div className="range-sliders">
                <input
                  type="range"
                  min={0}
                  max={20000000}
                  step={100000}
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(
                      Math.min(Number(e.target.value), maxPrice - 100000)
                    )
                  }
                />

                <input
                  type="range"
                  min={0}
                  max={20000000}
                  step={100000}
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      Math.max(Number(e.target.value), minPrice + 100000)
                    )
                  }
                />
              </div>

              <button
                className="done-btn"
                onClick={() => {
                  setPriceRange([minPrice, maxPrice]);
                  setFilters({
                    ...filters,
                    priceMin: minPrice,
                    priceMax: maxPrice,
                  });
                  setPriceOpen(false);
                }}
              >
                Xong
              </button>
            </div>
          )}
        </div>

        {/* TYPE */}
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: Number(e.target.value) })
          }
        >
          <option value="">Tất cả loại</option>
          <option value={1}>Phòng trọ</option>
          <option value={2}>Chung cư</option>
          <option value={3}>Nhà nguyên căn</option>
        </select>

        {/* FEATURES */}
        <label>
          <input
            type="checkbox"
            checked={filters.pet}
            onChange={(e) =>
              setFilters({ ...filters, pet: e.target.checked })
            }
          />
          Cho nuôi thú
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.nearBeach}
            onChange={(e) =>
              setFilters({ ...filters, nearBeach: e.target.checked })
            }
          />
          Gần biển
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.airConditioner}
            onChange={(e) =>
              setFilters({
                ...filters,
                airConditioner: e.target.checked,
              })
            }
          />
          Máy lạnh
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.pool}
            onChange={(e) =>
              setFilters({ ...filters, pool: e.target.checked })
            }
          />
          Hồ bơi
        </label>
      </div>

      <div className="list-grid">
        {filteredPosts.map((item) => (
          <div
            key={item.id}
            className="post-card"
            onClick={() => navigate(`/post/${item.id}`)}
          >
            <img src={item.images?.[0]?.url} alt="" />

            <div className="info">
              <h4>{item.title}</h4>
              <p>{formatVnd(item.price)}đ/tháng</p>
              <span>{item.area} m²</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <>
      {/* DETAIL */}
      <section className="post-detail-main">
        <div className="gallery">
          <div className="gallery-main">
            {!!activeImage && (
              <img src={activeImage} alt={post.title} className="main-img" />
            )}

            <button className="nav-btn left" onClick={handlePrev}>
              <ChevronLeft size={28} />
            </button>
            <button className="nav-btn right" onClick={handleNext}>
              <ChevronRight size={28} />
            </button>

            <div className="image-count">
              <Camera size={14} /> {post.imageCount || images.length}
            </div>
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((url, idx) => (
                <button
                  key={url + idx}
                  className={
                    "thumb" +
                    (idx === activeImageIndex ? " active" : "")
                  }
                  onClick={() => setActiveImageIndex(idx)}
                  type="button"
                >
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="post-meta">
          <div className="badge">TIN VIP NỔI BẬT</div>
          <h1 className="title">{post.title}</h1>

          <div className="meta-row">
            <div className="price">
              {formatVnd(post.price)}đ/tháng
            </div>
            <div className="dot">•</div>
            <div className="area">{post.area} m²</div>
          </div>

          <div className="address">
            <MapPin size={16} />
            <span>{post.address || post.location}</span>
          </div>

          <div className="desc">
            <h3>Thông tin mô tả</h3>
            <p>{post.description}</p>
          </div>
        </div>

             <ReviewSection postId={post.id} />
      </section>

      {/*  SIDEBAR CHỈ HIỆN Ở DETAIL */}
      <aside className="post-detail-side">
        <div className="contact-card">
          <div className="profile">
 <img
  className="avatar"
  src={owner?.avatar}
  alt=""
/>
<div>
  <div className="name">{owner?.username}</div>
  <div className="sub">{post.postDate || ""}</div>
</div>
</div>

<a
  className="phone"
  href={`https://zalo.me/${owner?.phone || ""}`}
  target="_blank"
  rel="noopener noreferrer"
>
  {owner?.phone}
</a>
          <div className="hint">
            Lưu ý: Hãy kiểm tra kỹ thông tin trước khi đặt cọc.
          </div>
            <div style={{ marginTop: "20px" }}>
             <button 
  className="btn-pre-order"
  onClick={handlePreOrder}
   disabled={currentUser?.id === post?.user?.id}
>
  <CalendarDays size={18} />
  ĐẶT LỊCH XEM PHÒNG NGAY
</button>
            </div>
        </div>

        <div className="related-card">
          <div className="related-title">Tin cùng khu vực</div>
          <div className="related-empty">(MVP) Sẽ bổ sung sau</div>
        </div>
      </aside>
    </>
  )}
</div>
        </div>
      </div>
    </div>
      </>
  );
}