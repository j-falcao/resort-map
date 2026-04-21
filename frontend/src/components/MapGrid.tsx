import { useEffect, useState } from "react";
import BookingModal from "./BookingModal";
import { fetchMap } from "../api";
import TileCell from "./TileCell";
import bg from "../assets/parchmentBasic.png";

type Tile =
  | { type: "empty" }
  | { type: "path" }
  | { type: "pool" }
  | { type: "chalet" }
  | { type: "cabana"; id: string; available: boolean };

type MapData = {
  grid: Tile[][];
};

export default function MapGrid() {
  const [map, setMap] = useState<MapData | null>(null);
  const [selectedCabana, setSelectedCabana] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(t);
    }

    fetchMap().then(setMap);
  }, [refreshKey, message]);

  if (!map) return <div>Loading map...</div>;

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${map.grid[0].length}, 50px)`,
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "4px solid #444",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        {map.grid.map((row, r) =>
          row.map((tile, c) => (
            <TileCell
              key={`${r}-${c}`}
              tile={tile}
              row={r}
              col={c}
              grid={map.grid}
              onCabanaClick={(id, available) => {
                if (!available) {
                  setMessage("Cabana is not available");
                  return;
                }
                setSelectedCabana(id);
              }}
            />
          ))
        )}
      </div>

      {selectedCabana && (
        <BookingModal
          cabanaId={selectedCabana}
          onClose={() => setSelectedCabana(null)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {message && <div style={toastStyle}>{message}</div>}
    </div>
  );

}

const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  background: "#333",
  color: "white",
  padding: "10px 16px",
  borderRadius: 6,
};

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh", // full screen height
};
