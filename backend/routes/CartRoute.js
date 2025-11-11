import express from "express";
import {
  addtoCart,
  removefromCart,
  getfromCart,
} from "../controllers/CartController.js";
import authMiddleware from "../middleware/auth.js";
const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addtoCart);
cartRouter.post("/remove", authMiddleware, removefromCart);
cartRouter.post("/get", authMiddleware, getfromCart);

export default cartRouter;
