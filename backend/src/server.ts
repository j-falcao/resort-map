import { bookCabana, loadGuests, isCabanaBooked } from "./bookingService";
import { loadMap, parseMap } from "./mapService";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});


const mapData = parseMap(loadMap("../map.ascii"));

app.get("/map", (_, res) => {
  const mapWithAvailability = mapData.grid.map(row =>
    row.map(tile => {
      if (tile.type === "cabana") {
        return {
          ...tile,
          available: !isCabanaBooked(tile.id!)
        };
      }
      return tile;
    })
  );

  res.json({ grid: mapWithAvailability });
});


loadGuests("bookings.json");

app.post("/book", (req, res) => {
  const { cabanaId, room, name } = req.body;

  if (!cabanaId || !room || !name) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  const result = bookCabana(cabanaId, room, name);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
