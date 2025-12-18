import foodModel from "../models/FoodModel.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// add food items
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Image required" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "foods" },
      async (error, result) => {
        if (error) {
          return res.json({ success: false, message: "Cloudinary error" });
        }

        const food = await foodModel.create({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          image: result.secure_url, // ✅ Cloudinary URL
        });

        res.json({
          success: true,
          message: "Food added",
          data: food,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    res.json({ success: false, message: "Add food failed" });
  }
};


// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while showing list of foods" });
  }
};

// remove food item

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    // delete image from uploads folder if exists
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.log("Image delete error:", err);
    });

    await foodModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// Hide/Unhide
const toggleFoodAvailability = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.json({
      success: true,
      message: `Item ${food.isAvailable ? "unhidden" : "hidden"} successfully!`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✏️ Update food item
const updateFood = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    };

    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "foods" },
        async (error, result) => {
          if (error) {
            return res.json({ success: false });
          }

          updateData.image = result.secure_url;

          await foodModel.findByIdAndUpdate(req.params.id, updateData);
          res.json({ success: true, message: "Food updated" });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      await foodModel.findByIdAndUpdate(req.params.id, updateData);
      res.json({ success: true, message: "Food updated" });
    }
  } catch {
    res.json({ success: false });
  }
};


export { addFood, listFood, removeFood, toggleFoodAvailability, updateFood };
