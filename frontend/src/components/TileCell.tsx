import cabanaImg from "../assets/cabana.png";
import poolImg from "../assets/pool.png";
import chaletImg from "../assets/houseChimney.png";

import arrowStraight from "../assets/arrowStraight.png";
import arrowCorner from "../assets/arrowCornerSquare.png";
import arrowCrossing from "../assets/arrowCrossing.png";
import arrowSplit from "../assets/arrowSplit.png";
import arrowEnd from "../assets/arrowEnd.png";

type Tile =
  | { type: "empty" }
  | { type: "path" }
  | { type: "pool" }
  | { type: "chalet" }
  | { type: "cabana"; id: string; available: boolean };

type Props = {
  tile: Tile;
  row: number;
  col: number;
  grid: Tile[][];
  onCabanaClick?: (id: string, available: boolean) => void;
};

export default function TileCell({ tile, row, col, grid, onCabanaClick }: Props) {
  const baseStyle: React.CSSProperties = {
    width: 40,
    height: 40,
  };

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
  };

  // -----------------------------
  // PATH LOGIC
  // -----------------------------

  function isPath(r: number, c: number) {
    return grid[r]?.[c]?.type === "path";
  }

  function getConnections() {
    return {
      up: isPath(row - 1, col),
      down: isPath(row + 1, col),
      left: isPath(row, col - 1),
      right: isPath(row, col + 1),
    };
  }

  function getPathType(conn: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  }) {
    const { up, down, left, right } = conn;
    const count = [up, down, left, right].filter(Boolean).length;

    if (count === 4) return "crossing";
    if (count === 3) return "split";

    if (count === 2) {
      if ((up && down) || (left && right)) return "straight";
      return "corner";
    }

    if (count === 1) return "end";

    return "isolated";
  }

  function getRotation(
    type: string,
    conn: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }
    ) {
    const { up, down, left, right } = conn;

    switch (type) {
        case "straight":
        // vertical vs horizontal
        if (up && down) return 0;
        if (left && right) return 90;
        return 0;

        case "corner":
        if (up && right) return 0;
        if (right && down) return 90;
        if (down && left) return 180;
        if (left && up) return 270;
        return 0;

        case "end":
        if (up) return 0;
        if (right) return 270;
        if (down) return 180;
        if (left) return 90;
        return 0;

        case "split":
        // T-shape: missing one side
        if (!up) return 90;
        if (!right) return 180;
        if (!down) return 270;
        if (!left) return 0;
        return 0;

        case "crossing":
        return 0;

        default:
        return 0;
    }
  }


  function getPathImage(type: string) {
    switch (type) {
      case "straight":
        return arrowStraight;
      case "corner":
        return arrowCorner;
      case "crossing":
        return arrowCrossing;
      case "split":
        return arrowSplit;
      case "end":
        return arrowEnd;
      default:
        return arrowStraight;
    }
  }

  // -----------------------------
  // RENDER
  // -----------------------------

  switch (tile.type) {
    case "empty":
      return <div style={baseStyle} />;

    case "pool":
      return <img src={poolImg} style={imgStyle} alt="pool" />;

    case "chalet":
      return <img src={chaletImg} style={imgStyle} alt="chalet" />;

    case "cabana":
      return (
        <div
          style={{
            ...baseStyle,
            position: "relative",
            cursor: "pointer",
            opacity: tile.available ? 1 : 0.5,
            transition: "transform 0.1s",
          }}
          onClick={() => {
            onCabanaClick?.(tile.id!, tile.available!);
          }}


          onMouseEnter={(e) => {
            if (tile.available) e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <img src={cabanaImg} style={imgStyle} alt={`cabana-${tile.id}`} />

          {!tile.available && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,0,0,0.4)",
              }}
            />
          )}
        </div>
      );

    case "path": {
      const conn = getConnections();
      const type = getPathType(conn);
      const rotation = getRotation(type, conn);
      const img = getPathImage(type);

      return (
        <img
          src={img}
          style={{
            ...imgStyle,
            transform: `rotate(${rotation}deg)`,
          }}
          alt="path"
        />
      );
    }

    default:
      return <div style={baseStyle} />;
  }
}
