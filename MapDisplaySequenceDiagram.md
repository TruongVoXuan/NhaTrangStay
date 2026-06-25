# Map Display Sequence Diagram

File này mô tả trình tự hiển thị bản đồ số trong NhaTrangStay, dựa theo `src/components/shared/User/Post/MapSection/MapSection.jsx` và cách nó được sử dụng trong `src/pages/User/PostDetail/PostDetailPage.jsx`.

```mermaid
sequenceDiagram
  participant User as Người dùng
  participant PostPage as Trang chi tiết bài đăng
  participant MapComponent as MapSection (Leaflet)
  participant Browser as Trình duyệt
  participant OSM as OpenStreetMap Tile Server
  participant Nominatim as Nominatim Geocoding
  participant RouterOSM as OSRM Routing

  User->>PostPage: Mở trang chi tiết bài đăng / danh sách vị trí
  PostPage->>Browser: Fetch dữ liệu bài đăng từ backend
  Browser-->>PostPage: Trả về dữ liệu post hoặc danh sách posts
  PostPage->>MapComponent: Render với props markers, lat, lng, province, district, ward

  activate MapComponent
  MapComponent->>Browser: Yêu cầu vị trí người dùng qua Geolocation API
  alt Geolocation thành công
    Browser-->>MapComponent: Trả vị trí GPS của người dùng
  else Geolocation bị từ chối hoặc lỗi
    Browser-->>MapComponent: Trả vị trí mặc định Nha Trang
  end
  MapComponent->>MapComponent: Thiết lập userPos và postPos

  MapComponent->>Browser: Khởi tạo MapContainer + TileLayer
  Browser->>OSM: Tải tile bản đồ từ `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  OSM-->>Browser: Trả về ảnh tile
  Browser-->>MapComponent: Hiển thị bản đồ

  alt Chi tiết bài đăng có tọa độ lat/lng
    MapComponent->>MapComponent: Ưu tiên flyTo([lat,lng]) vào marker bài đăng
  else Chỉ có địa chỉ / khu vực
    MapComponent->>Nominatim: Tìm toạ độ theo địa chỉ
    Nominatim-->>MapComponent: Trả về lat/lng
    MapComponent->>MapComponent: Fly tới vị trí địa chỉ
  end

  MapComponent->>MapComponent: Hiển thị marker người dùng và marker bài đăng
  MapComponent->>Browser: Vẽ đường dẫn nếu có userPos và postPos
  Browser->>RouterOSM: Fetch route từ user tới bài đăng
  RouterOSM-->>Browser: Trả về đường đi geojson
  Browser-->>MapComponent: Vẽ polyline route trên bản đồ

  User->>MapComponent: Click marker
  MapComponent->>MapComponent: Hiển thị Popup với hình ảnh và thông tin bài đăng
  opt Marker là post khác
    MapComponent->>PostPage: Dispatch sự kiện changePost hoặc navigate tới /post/:id
  end
  deactivate MapComponent
```

## Ghi chú

- Bản đồ dùng `react-leaflet` với `MapContainer`, `TileLayer`, `Marker`, `Popup`.
- Tile data lấy từ OpenStreetMap.
- `MapFly` điều khiển zoom và di chuyển camera:
  - Ưu tiên dùng `lat`/`lng` trực tiếp nếu có.
  - Nếu không có tọa độ, gọi Nominatim để geocode địa chỉ (tỉnh, quận, phường).
- `Routing` dùng OSRM (router.project-osrm.org) để vẽ đường đi giữa vị trí người dùng và bài đăng.
- Click vào marker bài đăng có thể dẫn đến thay đổi bài đăng hiện tại hoặc điều hướng tới trang chi tiết bài đăng.
