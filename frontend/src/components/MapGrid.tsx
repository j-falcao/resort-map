import { useEffect, useState } from "react";
import BookingModal from "./BookingModal";
import { fetchMap } from "../api";
import TileCell from "./TileCell";

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
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchMap().then(setMap);
  }, [refreshKey]);

  if (!map) return <div>Loading map...</div>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${map.grid[0].length}, 50px)`,
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
            onCabanaClick={(id) => setSelectedCabana(id)}
          />
        ))
      )}
      {selectedCabana && (
        <BookingModal
          cabanaId={selectedCabana}
          onClose={() => setSelectedCabana(null)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
