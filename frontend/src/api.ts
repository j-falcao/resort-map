export async function fetchHealth() {
  const res = await fetch("http://localhost:3001/health");
  return res.json();
}

export async function fetchMap() {
  const res = await fetch("http://localhost:3001/map");
  if (!res.ok) throw new Error("Failed to fetch map");
  return res.json();
}

export async function bookCabana(data: {
  cabanaId: string;
  room: string;
  name: string;
}) {
  const res = await fetch("http://localhost:3001/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Booking failed");
  }

  return json;
}