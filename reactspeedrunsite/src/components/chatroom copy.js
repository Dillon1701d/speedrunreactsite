import { WebPubSubClient } from "@azure/web-pubsub-client";
import React, { useEffect, useRef, useState } from "react";

const ChatRoom = () => {
    const [messages, setMessages] = useState([]); // For storing received messages
    const [input, setInput] = useState(""); // For storing user input
    const clientRef = useRef(null); // Reference to the WebSocket client

    useEffect(() => {
        const initializeWebSocket = async () => {
            try {
                const response = await fetch("http://localhost:3000/negotiate");
                const { url } = await response.json();
        
                const client = new WebPubSubClient(url);
                clientRef.current = client;
        
                // Start the WebSocket connection
                await client.start();
        
                // Attach a listener to the WebSocket instance
                const socket = client._wsClient._socket;
                socket.onmessage = (event) => {
                    const receivedMessage = JSON.parse(event.data); // Parse incoming message
                    console.log("Message received from server:", receivedMessage);
                    setMessages((prev) => [...prev, receivedMessage]); // Append to state
                };
        
                console.log("WebSocket connection established.");
            } catch (error) {
                console.error("Error initializing WebSocket:", error);
            }
        };
        

        initializeWebSocket();

        return () => {
            if (clientRef.current) {
                clientRef.current.stop();
            }
        };
    }, []);

    const sendMessage = async () => {
        const socket = clientRef.current?._wsClient?._socket;
        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                const message = JSON.stringify({
                    type: "string", // Adjust this to match server expectations
                    text: input, // Adjust key if needed
                });
                socket.send(message);
                console.log("Message sent:", message);
                setInput(""); // Clear the input field
            } catch (error) {
                console.error("Error sending message:", error);
            }
        } else {
            console.error("WebSocket is not open or initialized.");
        }
    };
    
    

    return (
        <div>
            <h1>Chat Room</h1>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg.text}</p> // Display each message
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
    
};

export default ChatRoom;
