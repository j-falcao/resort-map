export type TileType = "empty" | "path" | "pool" | "chalet" | "cabana";

export interface Tile {
  type: TileType;
  id?: string;         // only for cabanas
  available?: boolean; // only for cabanas
}

export interface ParsedMap {
  grid: Tile[][];
  cabanas: { id: string }[];
}
