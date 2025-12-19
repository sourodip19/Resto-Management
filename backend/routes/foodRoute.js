import express from "express";
import multer from "multer";
import {
  addFood,
  listFood,
  removeFood,
  toggleFoodAvailability,
  updateFood,
} from "../controllers/foodController.js";
import foodModel from "../models/FoodModel.js";

const foodRouter = express.Router();

// ✅ Multer MEMORY storage (no uploads folder)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/remove/:id", removeFood);
foodRouter.put("/toggle/:id", toggleFoodAvailability);
foodRouter.put("/update/:id", upload.single("image"), updateFood);
foodRouter.get("/search", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.json([]); // 👈 VERY IMPORTANT
    }

    const results = await foodModel.find({
      name: { $regex: q, $options: "i" },
    });

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default foodRouter;
