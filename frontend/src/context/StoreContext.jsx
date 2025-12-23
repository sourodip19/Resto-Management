import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodlist] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); // 👈 added
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const fetchFoodList = async () => {
    const res = await axios.get(url + "/api/food/list");
    setFoodlist(res.data.data);
  };
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const safePrev = prev || {};
      return {
        ...safePrev,
        [itemId]: (safePrev[itemId] || 0) + 1,
      };
    });
  
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const safePrev = prev || {};
      if (!safePrev[itemId]) return safePrev;
  
      const updated = { ...safePrev };
      updated[itemId] -= 1;
      if (updated[itemId] <= 0) delete updated[itemId];
      return updated;
    });
  
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };
  
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((p) => p._id === item);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const loadCartData = async (token) => {
    const res = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(res.data.cartData);
  };

  const getTotalCartItems = () => {
    let total = 0;
    for (const itemId in cartItems) {
      total += cartItems[itemId];
    }
    return total;
  };
  
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        const savedToken = localStorage.getItem("token");
        setToken(savedToken);
        await loadCartData(savedToken);
      }
      setLoading(false); // ✅ finished loading
    }
    loadData();
  }, []);

  const ContextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loading, // 👈 added
    getTotalCartItems
  };

  return (
    <StoreContext.Provider value={ContextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
