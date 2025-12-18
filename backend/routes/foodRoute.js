import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  toggleFoodAvailability,
  updateFood
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.delete("/remove/:id", removeFood);
foodRouter.get("/list", listFood);
foodRouter.put("/toggle/:id", toggleFoodAvailability); // hide/unhide
foodRouter.put("/update/:id", upload.single("image"), updateFood);


export default foodRouter;
