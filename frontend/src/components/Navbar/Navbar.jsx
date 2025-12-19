import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
  
    if (section) {
      // Section exists on current page → just scroll
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      // Section not present → go home then scroll
      navigate("/");
  
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 150);
    }
  };
  
  
  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>

      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
          Home
        </Link>
        <li onClick={() => {setMenu("Menu"), scrollToSection("explore-menu");}} className={menu === "Menu" ? "active" : ""}>
          Menu
        </li>
        <li onClick={() => {setMenu("Mobile-App"), scrollToSection("app-download");}} className={menu === "Mobile-App" ? "active" : ""}>
          Mobile-App
        </li>
        <li onClick={() => {setMenu("Contact Us"), scrollToSection("footer");}} className={menu === "Contact Us" ? "active" : ""}>
          Contact Us
        </li>
      </ul>

      <div className="navbar-right">
        {/* 🔍 Search box */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <img
            src={assets.search_icon}
            alt="search"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logOut}>
                <img src={assets.logout_icon} alt="" />
                <p>LogOut</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
