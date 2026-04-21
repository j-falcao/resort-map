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
  const [success, setSuccess] = useState(false);


  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await bookCabana({ cabanaId, room, name });
      setSuccess(true);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {!success ? (
          <>
            <h2 style={{ margin: 0 }}>Book Cabana</h2>
            <p style={{ color: "#666", marginTop: 4 }}>Cabana: {cabanaId}</p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <label>
                Room number
                <input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  required
                  style={inputStyle}
                />
              </label>

              <label>
                Guest name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </label>

              {error && <div style={errorStyle}>{error}</div>}

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" disabled={loading} style={primaryButton}>
                  {loading ? "Booking..." : "Confirm"}
                </button>
                <button type="button" onClick={onClose} style={secondaryButton}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 style={{ margin: 0 }}>Booking Confirmed</h2>
            <p style={{ color: "#666" }}>
              Cabana <strong>{cabanaId}</strong> has been successfully booked.
            </p>

            <button
              onClick={onClose}
              style={{ ...primaryButton, marginTop: 12 }}
            >
              Back to map
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(2px)",
};

const modalStyle: React.CSSProperties = {
  background: "white",
  padding: 24,
  borderRadius: 12,
  width: 320,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  marginTop: 4,
  borderRadius: 6,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const errorStyle: React.CSSProperties = {
  color: "#b00020",
  background: "#ffe6e6",
  padding: 8,
  borderRadius: 6,
};

const primaryButton: React.CSSProperties = {
  flex: 1,
  padding: 10,
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  flex: 1,
  padding: 10,
  background: "#eee",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
