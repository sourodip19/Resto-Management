import userModel from "../models/UserModel.js";

const addtoCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in add to cart" });
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
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error while fetching data from cart",
    });
  }
};




export { addtoCart, removefromCart, getfromCart };
