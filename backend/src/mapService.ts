import fs from "fs";
import { ParsedMap, Tile } from "./types";

export function loadMap(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  return content
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export function parseMap(lines: string[]): ParsedMap {
  let cabanaCounter = 1;

  const grid: Tile[][] = lines.map(row =>
    row.split("").map((char): Tile => {
      switch (char) {
        case ".":
          return { type: "empty" };

        case "#":
          return { type: "path" };

        case "p":
          return { type: "pool" };

        case "c":
          return { type: "chalet" };

        case "W":
          return {
            type: "cabana",
            id: `cabana-${cabanaCounter++}`,
            available: true
          };

        default:
          throw new Error(`Unknown map character: ${char}`);
      }
    })
  );


  return { grid };
}
