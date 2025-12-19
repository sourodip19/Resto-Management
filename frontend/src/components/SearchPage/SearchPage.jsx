import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FoodItem from "../FoodItem/FoodItem";
const SearchPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q");

  const [results, setResults] = useState([]);
  const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:4000";
  console.log("NODE_ENV:", import.meta.env.MODE);
  console.log("Backend URL chosen:", BACKEND_URL);
    

  useEffect(() => {
    if (!query) return;
  
    const fetchResults = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/food/search?q=${query}`
      );
      const data = await res.json();
      setResults(data);
    };
  
    fetchResults();
  }, [query]);
  
  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      <div className="search-grid">
      {results.length === 0 ? (
  <p>No items found</p>
) : (
  <div className="food-display-list">
     {results.map((item) => (
    <FoodItem
      key={item._id}
      id={item._id}
      name={item.name}
      price={item.price}
      image={item.image}
      description={item.description}
    />
  ))}
  </div>
)}

      </div>
    </div>
  );
};

export default SearchPage;
