import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get the ID from the URL

function SpeedrunPage() {
  const { id } = useParams(); // Extract the speed run ID from the URL
  const [speedrun, setSpeedrun] = useState(null);

  useEffect(() => {
    const fetchSpeedrun = async () => {
      try {
        const response = await fetch(`https://prod-24.uksouth.logic.azure.com:443/workflows/43673659e2b54d22b55aff38695df91f/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-12-08T19:39:34Z&st=2024-12-08T11:39:34Z&spr=https&sig=7mrCIZdTnNw5klfCNFQsoaP6nYxT1vqIQmHO7hVr9DY%3D&id=${id}`); // Query Logic App with the ID
        const data = await response.json();
        setSpeedrun(data[0]);
      } catch (error) {
        console.error("Error fetching speedrun details:", error);
      }
    };

    fetchSpeedrun();
  }, [id]);

  if (!speedrun) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{speedrun.game} - {speedrun.category}</h2>
      <p><strong>Player:</strong> {speedrun.userName}</p>
      <p><strong>Time:</strong> {speedrun.time}</p>
      <p><strong>Description:</strong> {speedrun.description}</p>
      <p><strong>Views:</strong> {speedrun.views}</p>
      <p><strong>Likes:</strong> {speedrun.likes}</p>
      {/* Video can be embedded here in the next step */}
    </div>
  );
}

export default SpeedrunPage;
