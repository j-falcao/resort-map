export async function fetchHealth() {
  const res = await fetch("http://localhost:3001/health");
  return res.json();
}
