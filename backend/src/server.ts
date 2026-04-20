import express from "express";
import cors from "cors";
import { loadMap, parseMap } from "./mapService";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});


const mapData = parseMap(loadMap("../map.ascii"));

app.get("/map", (_, res) => {
  res.json(mapData);
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
