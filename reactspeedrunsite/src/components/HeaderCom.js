import React from "react";
import { useAuth } from "../authContext";
import { getAuth, signOut } from "firebase/auth";

function HeaderCom() {
  const { currentUser } = useAuth();
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header>
      <h1>Speed Run App</h1>
      {currentUser ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <a href="/login">Sign In</a>
      )}
    </header>
  );
}

export default HeaderCom;
