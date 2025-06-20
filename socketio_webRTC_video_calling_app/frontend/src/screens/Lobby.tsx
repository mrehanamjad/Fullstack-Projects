import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";


const LobbyScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

const navigate = useNavigate();
  const socket = useSocket();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log(`Joining room: ${room} with email: ${email}`);
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback((data: any) => {
    const { email, room } = data;
    console.log(email, room);
    navigate(`/room/${room}`)
  }, [navigate]);

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Join Video Call
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-100"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="room"
              className="block text-sm font-medium text-gray-100"
            >
              Room Name
            </label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
              placeholder="Enter room name"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LobbyScreen;
