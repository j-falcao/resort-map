import express from "express";
import cors from "cors";
import fs from "fs";

import { bookCabana, loadGuests, isCabanaBooked, BookingError } from "./bookingService";
import { loadMap, parseMap } from "./mapService";

function getArg(flag: string, defaultValue: string) {
  const args = process.argv.slice(2);
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : defaultValue;
}

function validateFile(pathStr: string, label: string) {
  if (!fs.existsSync(pathStr)) {
    throw new Error(`${label} file not found: ${pathStr}`);
  }
}

export function startServer() {
  try {
    // -----------------------
    // CLI CONFIG
    // -----------------------
    const mapPath = getArg("--map", "map.ascii");
    const bookingsPath = getArg("--bookings", "bookings.json");

    validateFile(mapPath, "Map");
    validateFile(bookingsPath, "Bookings");

    // -----------------------
    // LOAD DATA (ONCE)
    // -----------------------
    const mapData = parseMap(loadMap(mapPath));
    loadGuests(bookingsPath);

    // -----------------------
    // EXPRESS APP
    // -----------------------
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get("/health", (_, res) => {
      res.json({ status: "ok" });
    });

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

      res.json({ success: true, grid: mapWithAvailability });
    });

    app.post("/book", (req, res) => {
      const { cabanaId, room, name } = req.body;

      if (cabanaId == null || room == null || !name?.trim()) {
        return res.status(400).json({
          success: false,
          error: "Missing or invalid required fields",
        });
      }

      try {
        const result = bookCabana(cabanaId, room, name);
        res.json({ success: true, cabanaId: result.cabanaId });

      } catch (err) {
        if (err instanceof BookingError) {
          return res.status(400).json({ success: false, error: err.message });
        }

        console.error(err);
        res.status(500).json({ success: false, error: "Failed to book cabana" });
      }
    });

    app.use((_, res) => {
      res.status(404).json({ error: "Not found" });
    });

    // -----------------------
    // START SERVER
    // -----------------------
    const PORT = 3001;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);

    // stop process
    process.exit(1);
  }
}
