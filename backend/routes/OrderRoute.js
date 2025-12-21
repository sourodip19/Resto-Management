import express from "express";
import {
  listOrders,
  placeOrder,
  updateStatus,
  useOrders,
  verifyOrder,
} from "../controllers/OrderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/userorders", authMiddleware, useOrders);
orderRouter.post("/status", updateStatus);
orderRouter.get("/list", listOrders);

export default orderRouter;
