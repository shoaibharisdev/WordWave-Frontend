import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (!user?._id) return;

    // ✅ Automatically switch between local and production backend
    const SOCKET_URL =
      process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL || window.location.origin
        : "http://localhost:4000";

    const socketInstance = io(SOCKET_URL, {
      query: { userId: user._id },
      transports: ["websocket"], // ensures compatibility with Vercel/production envs
    });

    setSocket(socketInstance);

    socketInstance.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
