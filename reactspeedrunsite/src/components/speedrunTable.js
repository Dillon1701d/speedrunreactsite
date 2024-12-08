import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function SpeedrunTable() {
  const [speedruns, setSpeedruns] = useState([]);

  useEffect(() => {
    const fetchSpeedruns = async () => {
      try {
        const response = await fetch("https://prod-22.uksouth.logic.azure.com:443/workflows/7b1eddce01d0431e87d6a46b31cc0bcd/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=SIBghBMjXddbfFyY8MkXH9eQOxZq3HWEm9PpJyRU__8"); // Replace with your Logic App endpoint
        const data = await response.json();
        setSpeedruns(data);
      } catch (error) {
        console.error("Error fetching speedruns:", error);
      }
    };

    fetchSpeedruns();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Game</th>
            <th>Category</th>
            <th>Player</th>
            <th>Time</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {speedruns.map((run) => (
            <tr key={run.id}>
              <td>{run.game}</td>
              <td>{run.category}</td>
              <td>{run.userName}</td>
              <td>{run.time}</td>
              <td>{run.views}</td>
              <td>{run.likes}</td>
              <td>
                <Link 
                  to={`/speedrun/${run.id}`} 
                  state={{ 
                    videoDetails: run 
                  }}
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SpeedrunTable;
