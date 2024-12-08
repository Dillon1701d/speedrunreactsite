import React, { useState } from "react";
import { useAuth } from "../authContext";
import HeaderCom from "./HeaderCom";

function SubmitSpeedRun() {
  const { currentUser } = useAuth(); // Fetch current user's details from auth context
  const [videoFile, setVideoFile] = useState(null);
  const [game, setGame] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    // Construct the form data
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("fileName", videoFile.name);
    formData.append("userID", currentUser.uid);
    formData.append("userName", currentUser.email || "Anonymous"); // Use email or fallback
    formData.append("game", game);
    formData.append("category", category);
    formData.append("time",time);
    formData.append("description", description);

    try {
      setUploading(true);

      // Send the request to the Logic App endpoint
      const response = await fetch("https://prod-18.uksouth.logic.azure.com:443/workflows/96981bb202d34e4ebfb97bcab856958a/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=Fp3S7x6mGhjOrox7VgiSAkANLY0zPT4MpoBUstE8OFY", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload the speed run.");
      }

      alert("Speed run uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred during the upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <HeaderCom></HeaderCom>
      <h2>Submit a Speed Run</h2>
      {currentUser ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Game:</label>
            <input
              type="text"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Time (HH:MM:SS):</label> {/* Time input */}
            <input
              type="time"
              step="1" // Allows seconds input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Video File:</label>
            <input type="file" accept="video/*" onChange={handleFileChange} required />
          </div>
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </form>
      ) : (
        <p>Please log in to submit a speed run.</p>
      )}
    </div>
  );
}

export default SubmitSpeedRun;
