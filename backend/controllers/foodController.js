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
  {
    folder: "foods",
    transformation: [
      { width: 400, height: 300, crop: "fill", gravity: "auto" }, // 👈 consistent card size
      { fetch_format: "auto" },                                    // 👈 auto WebP/AVIF
      { quality: "auto" },                                         // 👈 auto compress
    ],
  },
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;
    const category = req.query.category; // 👈 read category

    const filter = category && category !== "All" ? { category } : {}; // 👈 build filter

    const totalItems = await foodModel.countDocuments(filter);
    const foods = await foodModel.find(filter).skip(skip).limit(limit);

    res.json({
      success: true,
      data: foods,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      hasMore: page * limit < totalItems,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while showing list of foods" });
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

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    // ✅ Delete from Cloudinary instead of local fs
    if (food.image && food.image.includes("res.cloudinary.com")) {
      const publicId = food.image.split("/").slice(-2).join("/").split(".")[0]; // 👈 extracts "foods/filename"
      await cloudinary.uploader.destroy(publicId);
    }

    await foodModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
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
        {
          folder: "foods",
          transformation: [
            { width: 400, height: 300, crop: "fill", gravity: "auto" }, // ✅ same as addFood
            { fetch_format: "auto" },
            { quality: "auto" },
          ],
        },
        async (error, result) => {
          if (error) {
            return res.json({ success: false, message: "Cloudinary error" });
          }

          // ✅ Delete old image from Cloudinary before replacing
          const oldFood = await foodModel.findById(req.params.id);
          if (oldFood?.image?.includes("res.cloudinary.com")) {
            const publicId = oldFood.image.split("/").slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(publicId);
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
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Update failed" });
  }
};


export { addFood, listFood, removeFood, toggleFoodAvailability, updateFood };
