import express from "express";
import multer from "multer";
import {
  addFood,
  listFood,
  removeFood,
  toggleFoodAvailability,
  updateFood,
} from "../controllers/foodController.js";

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
  const q = req.query.q;

  if (!q) return res.json([]);

  const results = await foodModel.find({
    name: { $regex: q, $options: "i" }
  });

  res.json(results);
});

export default foodRouter;
