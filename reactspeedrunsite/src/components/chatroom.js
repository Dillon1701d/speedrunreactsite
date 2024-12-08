import React, { useState, useEffect } from "react";
import { WebPubSubClient } from "@azure/web-pubsub-client";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ChatRoom = () => {
  const [user, setUser] = useState(""); // Firebase user
  const [message, setMessage] = useState(""); // Message input
  const [messages, setMessages] = useState([]); // Chat messages
  const [connected, setConnected] = useState(false); // Connection state
  const [client, setClient] = useState(null); // Web PubSub client

  // Initialize Firebase auth and track the user
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Set the username from Firebase
        const username = firebaseUser.displayName || firebaseUser.email;
        setUser(username);
      } else {
        console.warn("No user signed in");
        setUser("");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Connect to the chat server
  const connect = async () => {
    if (!user) {
      console.error("User not signed in. Please log in to connect to the chat.");
      return;
    }
  
    try {
      const client = new WebPubSubClient({
        getClientAccessUrl: async () => {
          const response = await fetch("https://speedrunchatroomapi.azurewebsites.net/api/negotiate", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          return response.text();
        },
      });
  
      client.on("group-message", (event) => {
        const data = event.message.data;
        appendMessage(data);
      });
  
      await client.start();
      await client.joinGroup("chat"); // Ensure this matches the group name in the backend
  
      setClient(client);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting to chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!client) {
      console.error("Client not connected.");
      return;
    }

    const chatMessage = {
      from: user, // Use the Firebase user's name or email
      message: message,
    };

    try {
      await client.sendToGroup("chat", chatMessage, "json", { noEcho: true });
      appendMessage(chatMessage);
      setMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Append a new message to the chat
  const appendMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  return (
    <div>
      {!connected ? (
        <div>
          <h2>Enter Chatroom</h2>
          <p>Signed in as: <strong>{user || "Guest"}</strong></p>
          <button onClick={connect} disabled={!user}>
            Connect to Chat
          </button>
        </div>
      ) : (
        <div>
          <h2>Chat Room</h2>
          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              height: "300px",
              overflowY: "scroll",
            }}
          >
            {messages.map((msg, index) =>
              msg.from === user ? (
                <div key={index} style={{ textAlign: "right" }}>
                  <p>
                    <strong>{msg.from}</strong>: {msg.message}
                  </p>
                </div>
              ) : (
                <div key={index} style={{ textAlign: "left" }}>
                  <p>
                    <strong>{msg.from}</strong>: {msg.message}
                  </p>
                </div>
              )
            )}
          </div>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage} disabled={!message}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
