import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
// import useAuthStore from "../store/userStore";

// Use the same backend URL as the completed project
const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-backend.up.railway.app";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Pull email directly from auth store — same as completed project
//   const userData = useAuthStore((state: any) => state.userData);
//   const email = userData?.email ;
const email = "olamide@gmail.com"

  useEffect(() => {
    if (!email) return;

    // Create socket — matches how completed project creates it
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);

      // Join the user's room using their email — same event as completed project
      socket.emit("join", email);
    });

    socket.on("reconnect", () => {
      console.log("✅ Reconnected to socket");
      // Re-join room after reconnect
      socket.emit("join", email);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("reconnect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [email]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};