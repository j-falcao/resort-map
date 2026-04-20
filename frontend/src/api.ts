export async function fetchHealth() {
  const res = await fetch("http://localhost:3001/health");
  return res.json();
}

export async function fetchMap() {
  const res = await fetch("http://localhost:3001/map");
  if (!res.ok) throw new Error("Failed to fetch map");
  return res.json();
}
