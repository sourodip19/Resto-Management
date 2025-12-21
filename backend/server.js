import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/OrderRoute.js";
import cartRouter from "./routes/CartRoute.js";
import userRouter from "./routes/UserRoute.js";
import foodModel from "./models/FoodModel.js";

const app = express();
const port = process.env.PORT || 4000;
console.log("KEY_ID FROM ENV:", process.env.RAZORPAY_KEY_ID);

// ----------------------
// Allowed origins
// ----------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_ADMIN_URL,
  "http://localhost:5174",
  "http://localhost:5175",
];

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("CORS not allowed"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);



app.use("/images", express.static("uploads"));

// ----------------------
// DB
// ----------------------
connectDB();

// ----------------------
// Routes
// ----------------------
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

  
// ----------------------
// HTTP + Socket.IO
// ----------------------
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ----------------------
server.listen(port, () =>
  console.log("🚀 Server running on port", port)
);
