import React from "react";
import { useAuth } from "../authContext";
import HeaderCom from "../components/HeaderCom";

function Profile() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <HeaderCom>
      </HeaderCom>
      <h1>Welcome, {currentUser.email}!</h1>
      <p>Your UID: {currentUser.uid}</p>
    </div>
  );
}

export default Profile;
