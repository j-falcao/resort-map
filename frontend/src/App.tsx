import { useEffect } from "react";
import { fetchHealth } from "./api";

function App() {
  useEffect(() => {
    fetchHealth().then(console.log);
  }, []);

  return <h1>Resort Map</h1>;
}

export default App;
