import React from "react";
import "./Edit.css";
import { assets } from "../../assets/admin_assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
const Edit = ({ url }) => {
  const [existingImage, setExistingImage] = useState("");
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Starters",
  });

const { id } = useParams();

useEffect(() => {
    const fetchFood = async () => {
      const res = await axios.get(`${url}/api/food/list`);
      const item = res.data.data.find(f => f._id === id);
  
      setData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category
      });
  
      setExistingImage(item.image); // ✅ store old image
    };
  
    fetchFood();
  }, []);
  

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
  
    if (image) formData.append("image", image);
  
    const response = await axios.put(
      `${url}/api/food/update/${id}`,
      formData
    );
  
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Update failed");
    }
  };
  
  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
      <div className="add-image-upload flex-col">
  <p>Product Image</p>

  <label htmlFor="image">
    <img
      src={
        image
          ? URL.createObjectURL(image) // new image preview
          : existingImage
          ? `${url}/images/${existingImage}` // old image preview
          : assets.upload_area
      }
      alt="food"
    />
  </label>

  <input
    onChange={(e) => setImage(e.target.files[0])}
    type="file"
    id="image"
    hidden
  />

  <p style={{ fontSize: "12px", color: "#777" }}>
    Leave empty to keep existing image
  </p>
</div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows={6}
            placeholder="Write content here"
          />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} value={data.category} name="category">
              <option value="Starters">Starters</option>
              <option value="Sandwiches">Sandwiches</option>
              <option value="Pizza"> Pizza</option>
              <option value="Pasta">Pasta</option>
              <option value="Burger">Burger</option>
              <option value="Noodles">Noodles</option>
              <option value="Soups">Soups</option>
              <option value="Rice">Rice</option>
              <option value="Breads">Breads</option>
              <option value="Veg Main Course">Veg Main Course</option>
              <option value="Non-Veg Main Course">Non-Veg Main Course</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
              <option value="Extras">Extras</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="₹120"
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
            UPDATE
        </button>

      </form>
    </div>
  );
};

export default Edit;
