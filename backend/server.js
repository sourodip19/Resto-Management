import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/UserRoute.js";
import "dotenv/config";
import cartRouter from "./routes/CartRoute.js";
import orderRouter from "./routes/OrderRoute.js";
// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use("/images", express.static("uploads"));
//  db connection
connectDB();

// api endpoint
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.get("/", (req, res) => {
  res.send("Api working");
});

app.listen(port, () => console.log("Server is running at port ", port));
