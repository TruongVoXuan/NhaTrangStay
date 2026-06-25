import { useEffect, useState,useRef  } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "assets/icons/marker.png";
import houseIconImg from "assets/icons/house.png";
import apartmentIconImg from "assets/icons/apartment.png";
import roomIconImg from "assets/icons/room.png";
import { useNavigate } from "react-router-dom";
import userIconImg from "assets/icons/uLoca.png";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { toast } from "react-toastify";

// Vẽ đường đi từ vị trí người dùng đến marker
function Routing({ from, to }) {
  const map = useMap();
  const lineRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    const fetchRoute = async () => {
      try {
        // dùng OSRM API (free)
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
        );

        const data = await res.json();

        const coords = data.routes[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );

        //  xóa line cũ nếu có
        if (lineRef.current) {
          map.removeLayer(lineRef.current);
        }

        //  vẽ line mới
        lineRef.current = L.polyline(coords, {
          color: "#0066ff",
          weight: 5,
        }).addTo(map);
      } catch (err) {
        console.error("Routing error:", err);
      }
    };

    fetchRoute();

    return () => {
      if (lineRef.current) {
        try {
          map.removeLayer(lineRef.current);
        } catch (e) {}
        lineRef.current = null;
      }
    };
  }, [from, to, map]);

  return null;
}
/* ================= GET ICON ================= */
const getMarkerIcon = (type) => {
  const t = parseInt(type, 10);

  console.log("ICON TYPE RAW:", type, "=> PARSED:", t);

  switch (t) {
    case 1:
      return houseIcon;
    case 2:
      return apartmentIcon;
    case 3:
      return roomIcon;
    default:
      return defaultIcon;
  }
};
const createIcon = (url) =>
  new L.Icon({
    iconUrl: url,
    iconSize: [45, 55],
    iconAnchor: [22, 55],
    popupAnchor: [0, -50],
  });

const houseIcon = createIcon(houseIconImg);      // 1
const apartmentIcon = createIcon(apartmentIconImg); // 2
const roomIcon = createIcon(roomIconImg);        // 3


/* ===== FIX ICON ===== */
const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
});


const userIcon = new L.Icon({
  iconUrl: userIconImg,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function FitBounds({ markers }) {
  const map = useMap();

  
  useEffect(() => {
    if (!markers || markers.length < 2) return;

    const bounds = markers.map((m) => [m.lat, m.lng]);

    map.fitBounds(bounds, {
      padding: [50, 50], // khoảng cách viền
      animate: false,
    });
  }, [markers, map]);

  return null;
}


/* ===== MAP FLY ===== */
function MapFly({ lat, lng, province, district, ward,searchPos  }) {
  const map = useMap();

  useEffect(() => {
    // ƯU TIÊN LAT LNG (DETAIL PAGE)
    if (searchPos) {
    map.flyTo([searchPos.lat, searchPos.lng], 16, {
      animate: true,
    });
    return;
  }
    if (lat && lng) {
      map.flyTo([lat, lng], 16, {
        animate: true,
      });
      return; //  QUAN TRỌNG: chặn logic dưới
    }

    //  CHỈ CHẠY KHI KHÔNG CÓ LAT LNG (FORM ĐĂNG BÀI)
    const location = ward || district || province;
    if (!location) return;

    const timer = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            map.flyTo(
              [parseFloat(data[0].lat), parseFloat(data[0].lon)],
              14
            );
          }
        });
    }, 300); //  delay nhẹ tránh spam

    return () => clearTimeout(timer);
  }, [lat, lng, province, district, ward,searchPos, map]);

  return null;
}


/* ===== CLICK ===== */
function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

/* ===== MAIN MAP ===== */
function GOOGLE({
  onChange,
  province,
  district,
  ward,
  markers = [],
  lat,
  lng,
  title,
  currentPostId,
  searchAddress,
   type,
}) {



  const navigate = useNavigate();
  useEffect(() => {
    console.log(" MAP RECEIVED:", lat, lng);
  }, [lat, lng]);

  const [userPos, setUserPos] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [postPos, setPostPos] = useState(null);
  const markerRefs = useRef({});
  

  const [searchPos, setSearchPos] = useState(null);

    useEffect(() => {
  if (!currentPostId) return;

  const timer = setTimeout(() => {
    const marker = markerRefs.current[currentPostId];
    if (marker) {
      marker.openPopup();
    }
  }, 200); //  delay 1 xíu là ăn ngay

  return () => clearTimeout(timer);
}, [currentPostId, markers]);


  useEffect(() => {
  if (!searchAddress || searchAddress.length < 5) return;

  const timer = setTimeout(async () => {
    try {
      //  BUILD QUERY CHUẨN
      const keyword = `${searchAddress}, ${ward || ""}, ${district || ""}, ${province || ""}, Vietnam`;

      console.log("SEARCH:", keyword); // debug

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=vn&q=${encodeURIComponent(
          keyword
        )}`
      );

      const data = await res.json();

      if (data.length > 0) {
        setSearchPos({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      }
    } catch (err) {
      console.error("Search address error:", err);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [searchAddress, ward, district, province]);

  /* ===== LẤY GPS ===== */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setUserPos({
          lat: 12.2585,
          lng: 109.0526,
        });
      }
    );
  }, []);

  /* ===== SET MARKER BÀI ĐĂNG ===== */
  useEffect(() => {
    if (lat && lng) {
      setPostPos({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
    }
  }, [lat, lng]);
   
 const handleSearchAddress = async () => {
  if (!searchAddress) return;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchAddress
      )}`
    );

    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      setSearchPos({ lat, lng });

      // nếu muốn auto set vào form luôn
      if (onChange) {
        onChange({
          lat,
          lng,
          fullAddress: data[0].display_name,
        });
      }
    } else {
      toast.error("Không tìm thấy địa chỉ");
    }
  } catch (err) {
    console.error("Search address error:", err);
  }
};

  

  /* ===== CLICK MAP ===== */
  const handleSelect = async (latlng) => {
    setSelectedPos(latlng);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
      );

      const data = await res.json();
      const address = data.address || {};

      if (onChange) {
        onChange({
          lat: latlng.lat,
          lng: latlng.lng,
          province: address.state || "",
          district: address.city || address.town || "",
          ward: address.suburb || address.village || "",
          street: address.road || "",
          fullAddress: data.display_name
            .replace(/\b\d{5}\b,?\s*/g, "")
            .replace(", Việt Nam", ""),
        });
      }
    } catch (err) {
      console.error("Lỗi reverse geocode:", err);
    }
  };

  if (!userPos) {
    return <div>Đang lấy vị trí...</div>;
  }

  return (
    <MapContainer
      center={[
  markers[0]?.lat || userPos.lat,
  markers[0]?.lng || userPos.lng,
]}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
{!currentPostId && <FitBounds markers={markers} />}
      {/* BAY TỚI VỊ TRÍ */}
      <MapFly
        lat={postPos?.lat}
        lng={postPos?.lng}
        province={province}
        district={district}
        ward={ward}
        searchPos={searchPos}
      />
      {userPos && postPos && (
  <Routing from={userPos} to={postPos} />
)}

      {/* MARKER BÀI ĐĂNG */}
      {postPos && console.log(" RENDER MARKER:", postPos)}

      {userPos && (
  <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
    <Popup> Vị trí của bạn</Popup>
  </Marker>
)}







{markers.map((m) => (
  <Marker
    key={m.id}
    position={[m.lat, m.lng]}
    icon={getMarkerIcon(m.type)}

    //  GẮN REF THEO ID
    ref={(ref) => {
      if (ref) markerRefs.current[m.id] = ref;
    }}

    eventHandlers={{
      click: () => {
        if (m.id === currentPostId) return;

        if (currentPostId) {
          window.dispatchEvent(
            new CustomEvent("changePost", { detail: m.id })
          );
        } else {
          navigate(`/post/${m.id}`);
        }
      },
    }}
  >
    <Popup>
      <div style={{ width: "220px" }}>
      <img
  src={m.images || "https://via.placeholder.com/220x120?text=No+Image"}
  alt={m.title}
  onError={(e) => {
    console.log(" IMAGE FAIL:", m.images);
    e.target.src = "https://via.placeholder.com/220x120?text=No+Image";
  }}
  style={{
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "10px",
  }}
/>

        <div style={{ padding: "8px 4px" }}>
          <div style={{ fontWeight: "600", fontSize: "14px" }}>
            {m.title}
          </div>

          <div
            style={{
              color: "#e53935",
              fontWeight: "700",
              marginTop: "4px",
            }}
          >
            {m.price?.toLocaleString()} đ/tháng
          </div>
        </div>
      </div>
    </Popup>
  </Marker>
))}

      {/* MARKER CLICK
      {selectedPos && (
        <Marker
           position={[selectedPos.lat, selectedPos.lng]} 
  icon={customIcon}
        >
          <Popup>Vị trí bạn chọn</Popup>
        </Marker>
      )} */}

      <MapClickHandler onSelect={handleSelect} />
    </MapContainer>
  );
}

export default GOOGLE;