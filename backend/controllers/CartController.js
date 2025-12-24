import userModel from "../models/UserModel.js";

const addtoCart = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.body.itemId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // initialize cart if missing
    if (!user.cartData) {
      user.cartData = {};
    }

    user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;

    await user.save();

    res.json({
      success: true,
      message: "Item added to cart",
      cartData: user.cartData
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removefromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId]) {
      cartData[req.body.itemId] -= 1;
    }
    if (cartData[req.body.itemId] <= 0) {
      delete cartData[req.body.itemId];
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in remove from cart" });
  }
};
const getfromCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      cartData: user.cartData || {}
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





export { addtoCart, removefromCart, getfromCart };
