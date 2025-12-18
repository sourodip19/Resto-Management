import { io } from "socket.io-client";
import { socket } from "../socket";

export const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});


useEffect(() => {
  socket.on("orderStatusUpdate", ({ orderId, status }) => {
    if (orderId === currentOrderId) {
      setStatus(status);
    }
  });

  return () => socket.off("orderStatusUpdate");
}, []);
