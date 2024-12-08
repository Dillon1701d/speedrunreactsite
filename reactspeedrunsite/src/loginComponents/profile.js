import React from "react";
import { useAuth } from "../authContext";

function Profile() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <h1>Welcome, {currentUser.email}!</h1>
      <p>Your UID: {currentUser.uid}</p>
    </div>
  );
}

export default Profile;
