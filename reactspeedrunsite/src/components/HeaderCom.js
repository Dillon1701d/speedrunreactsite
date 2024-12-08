import React from "react";
import { useAuth } from "../authContext";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import "./HeaderCom.css"; // Import CSS for styling (if applicable)

function HeaderCom() {
  const { currentUser } = useAuth(); // Get the current user from context
  const auth = getAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the leaderboard page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header>
      <h1>Speed Run App</h1>
      <nav>
        <Link className="nav-link" to="/">Leaderboard</Link>
        <Link className="nav-link" to="/submit">Submit Speedrun</Link>
        {currentUser ? (
          <>
            <Link className="nav-link" to="/profile">Profile</Link>
            <button className="nav-button" onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Sign In</Link>
            <Link className="nav-link" to="/signup">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default HeaderCom;
