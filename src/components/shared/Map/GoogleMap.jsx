import { useMemo } from "react";

const GoogleMap = ({ address }) => {

  const googleEmbedUrl = useMemo(() => {
    if (!address) return null;
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }, [address]);

  const googleMapsUrl = useMemo(() => {
    if (!address) return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }, [address]);

  return (
    <div className="map-wrapper">

      {googleEmbedUrl ? (
        <iframe
          title="Google Maps"
          src={googleEmbedUrl}
          style={{ width: "100%", height: "300px", border: 0 }}
          loading="lazy"
        />
      ) : (
        <div>Chưa có địa chỉ</div>
      )}

      {googleMapsUrl && (
        <a href={googleMapsUrl} target="_blank" rel="noreferrer">
          Mở trên Google Maps
        </a>
      )}

    </div>
  );
};

export default GoogleMap;