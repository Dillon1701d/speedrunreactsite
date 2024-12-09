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

    const commentPayload = {
        comment: newComment,
        userId: user.uid,
        userName: user.email,
    };

    try {
        const response = await fetch(
            `http://localhost:7071/api/deleteSpeedRun?id=${videoDetails.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentPayload),
            }
        );

        if (response.ok) {
            const updatedComments = await response.json(); // Get the updated comments from the backend
            setComments(updatedComments); // Update the comments in state
            setNewComment(''); // Clear the input field
        } else {
            const error = await response.json();
            alert(`Failed to add comment: ${error.message}`);
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('An unexpected error occurred while adding the comment.');
    }
};


  // Handler for deleting the video
  const handleDeleteVideo = async () => {
    if (!user || user.email !== videoDetails.userName) {
      alert('You are not authorized to delete this video.');
      return;
    }
    console.log(`Request URL: http://localhost:7071/api/deleteSpeedRun?id=${videoDetails.id}`);

  
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this video? This action cannot be undone.'
    );
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(
        `http://localhost:7071/api/deleteSpeedRun?id=${videoDetails.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
  
      if (response.ok) {
        alert('Video deleted successfully.');
        // Optionally redirect or update UI
        // navigate('/videos');
      } else {
        const error = await response.json();
        alert(`Failed to delete video: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('An unexpected error occurred while deleting the video.');
    }
  };

  return (
    <div>
      <h2>
        {videoDetails.game} - {videoDetails.category}
      </h2>
      <p>By: {videoDetails.userName}</p>
      <video controls width="600">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Conditionally show the delete button if the user is the creator */}
      {user && user.email === videoDetails.userName && (
        <button
          onClick={handleDeleteVideo}
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px 20px',
            marginTop: '10px',
            cursor: 'pointer',
          }}
        >
          Delete Video
        </button>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Comments</h3>
        <ul>
          {comments.length > 0 ? (
            comments.map((commentObj, index) => (
              <li key={index}>
                <p>
                  <strong>{commentObj.userName}:</strong> {commentObj.comment}
                </p>
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
