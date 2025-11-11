import React from "react";
import "./List.css";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import hideIcon from "../../assets/hide.png";
import unhideIcon from "../../assets/unhide.png";
import deleteIcon from "../../assets/delete.png";
const List = ({url}) => {
  const [list, setList] = useState([]);
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };
  useEffect(() => {
    fetchList();
  }, []);

  const toggleAvailability = async (id) => {
    try {
      const res = await axios.put(`${url}/api/food/toggle/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchList();
      }
    } catch (err) {
      toast.error("Failed to toggle item");
    }
  };

  // ✅ Delete
  const deleteItem = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this item permanently?")
    ) {
      try {
        const res = await axios.delete(`${url}/api/food/remove/${id}`);
        if (res.data.success) {
          toast.success(res.data.message);
          fetchList();
        }
      } catch (err) {
        toast.error("Failed to delete item");
      }
    }
  };

  return (
    <div className="list add flex-col">
      <p>All Foods list</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p
                className={
                  item.isAvailable ? "status-active" : "status-inactive"
                }
              >
                {item.isAvailable ? "Available" : "Hidden"}
              </p>
              <div className="list-actions">
                <img
                  src={item.isAvailable ? hideIcon : unhideIcon}
                  alt="toggle"
                  title={item.isAvailable ? "Hide Item" : "Unhide Item"}
                  onClick={() => toggleAvailability(item._id)}
                />
                <img
                  src={deleteIcon}
                  alt="delete"
                  title="Delete Item"
                  onClick={() => deleteItem(item._id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
