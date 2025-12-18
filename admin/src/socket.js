import { io } from "socket.io-client";
import { socket } from "../socket";

export const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});

useEffect(() => {
  socket.on("newOrder", (order) => {
    setOrders((prev) => [order, ...prev]);
  });

  return () => socket.off("newOrder");
}, []);
