import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Import Firebase authentication

const SpeedrunPage = () => {
  const account = process.env.REACT_APP_STORAGE_ACCOUNT;

  const location = useLocation();
  const { videoDetails } = location.state || {}; // Get the passed video details

  const [comments, setComments] = useState(videoDetails.comments || []); // Initialize comments
  const [newComment, setNewComment] = useState(''); // State for new comment
  const [user, setUser] = useState(null); // State for the logged-in user

  // Initialize Firebase authentication
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser); // Set the logged-in user
    }
  }, []);

  if (!videoDetails) {
    return <p>Error: No video details provided.</p>;
  }

  const videoUrl = `https://${account}.blob.core.windows.net${videoDetails.filePath}`;

  // Handler for submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (newComment.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }

    if (!user) {
      alert('You must be logged in to comment.');
      return;
    }

    try {
      // Simulate adding a comment to the backend
      const newCommentObj = {
        comment: newComment,
        userId: user.uid, // Attach the user's ID
        userName: user.email, // Optional: Attach the user's email or name
        timestamp: new Date().toISOString(), // Add a timestamp
      };

      const updatedComments = [...comments, newCommentObj]; // Add the new comment to the list
      setComments(updatedComments); // Update the comments in state

      // Optionally: Send the new comment to the backend here
      // await fetch('YOUR_BACKEND_ENDPOINT', {
      //   method: 'POST',
      //   body: JSON.stringify({ videoId: videoDetails.id, comment: newCommentObj }),
      //   headers: { 'Content-Type': 'application/json' },
      // });

      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <h2>{videoDetails.game} - {videoDetails.category}</h2>
      <p>By: {videoDetails.userName}</p>
      <video controls width="600">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={{ marginTop: '20px' }}>
        <h3>Comments</h3>
        <ul>
          {comments.length > 0 ? (
            comments.map((commentObj, index) => (
              <li key={index}>
                <p><strong>{commentObj.userName}:</strong> {commentObj.comment}</p>
                <small>{new Date(commentObj.timestamp).toLocaleString()}</small>
              </li>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </ul>

        <form onSubmit={handleCommentSubmit} style={{ marginTop: '20px' }}>
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpeedrunPage;
