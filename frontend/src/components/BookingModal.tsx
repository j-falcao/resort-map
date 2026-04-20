import { useState, type SyntheticEvent } from "react";
import { bookCabana } from "../api";

type Props = {
  cabanaId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function BookingModal({ cabanaId, onClose, onSuccess }: Props) {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await bookCabana({ cabanaId, room, name });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Book Cabana</h3>
        <p>{cabanaId}</p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Room number"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
          />
          <input
            placeholder="Guest name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book"}
          </button>
        </form>

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
