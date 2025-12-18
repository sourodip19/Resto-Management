import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/OrderRoute.js";
import cartRouter from "./routes/CartRoute.js";
import userRouter from "./routes/UserRoute.js";
import { Server } from "socket.io";
import http from "http";

const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO
export const io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5174"
      ],
      methods: ["GET", "POST"],
    },
  });
  

// Socket events
io.on("connection", (socket) => {
  console.log("🟢 Admin/User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

// Middleware
app.use(express.json());
app.use(
    cors({
      origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5174"
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    })
  );
  
app.use("/images", express.static("uploads"));

// DB
connectDB();

// Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

server.listen(port, () =>
  console.log("🚀 Server running on port", port)
);
