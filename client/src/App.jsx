import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .then((err) => console.error("Error fetching health status:", err));
  }, []);

  return (
    <div className="bg-gray-100 p-4">
      <h1>Backend Status: {health ? health.status : "Loading..."}</h1>
    </div>
  );
}

export default App;
