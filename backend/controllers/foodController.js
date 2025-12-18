import foodModel from "../models/FoodModel.js";
import fs from "fs";

// add food items
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while adding food" });
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
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    // Update fields
    food.name = req.body.name || food.name;
    food.description = req.body.description || food.description;
    food.price = req.body.price || food.price;
    food.category = req.body.category || food.category;

    // If new image uploaded
    if (req.file) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.log("Old image delete error:", err);
      });
      food.image = req.file.filename;
    }

    await food.save();
    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

export { addFood, listFood, removeFood, toggleFoodAvailability, updateFood };
