import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderCom from "./HeaderCom";
import "./frontPage.css"; // Optional: Add styling for the front page.
import ChatRoom from "./chatroom";

function FrontPage() {
  const [mainLeaderboard, setMainLeaderboard] = useState([]);
  const [gameLeaderboards, setGameLeaderboards] = useState({
    zelda: [],
    mario: [],
    halo: [],
  });

  // Fetch data for the main leaderboard (Top 15 Speedruns)
  useEffect(() => {
    const fetchMainLeaderboard = async () => {
      try {
        const response = await fetch(
          "https://prod-22.uksouth.logic.azure.com:443/workflows/7b1eddce01d0431e87d6a46b31cc0bcd/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=SIBghBMjXddbfFyY8MkXH9eQOxZq3HWEm9PpJyRU__8" // Replace with Logic App endpoint for Top 15 Speedruns
        );
        const data = await response.json();
        setMainLeaderboard(data);
      } catch (error) {
        console.error("Error fetching main leaderboard:", error);
      }
    };

    fetchMainLeaderboard();
  }, []);

  // Fetch data for game-specific leaderboards
  useEffect(() => {
    const fetchGameLeaderboards = async () => {
      const games = ["zelda", "mario", "halo"];
      try {
        const results = await Promise.all(
          games.map((game) =>
            fetch(
              `https://prod-24.uksouth.logic.azure.com:443/workflows/646870947559461084638aff01a696b8/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=bsnazIYO6QZ674-2438Ln9vnPFwT-CCIiQ0RggYyzaE&game=${game}`
            ).then((response) => response.json())
          )
        );

        setGameLeaderboards({
          zelda: results[0],
          mario: results[1],
          halo: results[2],
        });
      } catch (error) {
        console.error("Error fetching game leaderboards:", error);
      }
    };

    fetchGameLeaderboards();
  }, []);

  // Render leaderboard tables
  const renderLeaderboard = (data, title) => (
    <div className="leaderboard">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Game</th>
            <th>Category</th>
            <th>Time</th>
            <th>Views</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((run) => (
            <tr key={run.id}>
              <td>{run.userName}</td>
              <td>{run.game}</td>
              <td>{run.category}</td>
              <td>{run.time}</td>
              <td>{run.views}</td>
              <td>
                <Link
                  to={`/speedrun/${run.id}`}
                  state={{ videoDetails: run }}
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

  return (
    <div>
      <HeaderCom />
      <h1>Speedrun Leaderboards</h1>

      {/* Main Leaderboard */}
      {mainLeaderboard.length > 0 ? (
        renderLeaderboard(mainLeaderboard, "Top 15 Most Popular Speedruns")
      ) : (
        <p>Loading main leaderboard...</p>
      )}
    <ChatRoom></ChatRoom>
      {/* Game-Specific Leaderboards */}
      <div className="game-leaderboards">
        {gameLeaderboards.zelda.length > 0 &&
          renderLeaderboard(gameLeaderboards.zelda, "Top Zelda Speedruns")}
        {gameLeaderboards.mario.length > 0 &&
          renderLeaderboard(gameLeaderboards.mario, "Top Mario Speedruns")}
        {gameLeaderboards.halo.length > 0 &&
          renderLeaderboard(gameLeaderboards.halo, "Top Halo Speedruns")}
      </div>
    </div>
  );
}

export default FrontPage;
