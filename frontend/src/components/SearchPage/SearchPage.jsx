import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q");

  const [results, setResults] = useState([]);
  const BACKEND_URL =  process.env.MODE === "production"
  ? process.env.VITE_API_URL
  : "http://localhost:4000";
  console.log("NODE_ENV:", process.env.MODE);
  console.log("Backend URL chosen:", BACKEND_URL);
    

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(`${BACKEND_URL}/api/food/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    };

    fetchResults();
  }, [query, BACKEND_URL]);

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      <div className="search-grid">
        {results.length === 0 ? (
          <p>No items found.</p>
        ) : (
          results.map((item) => (
            <div className="food-card" key={item._id}>
              <img src={item.image} />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
