import React, { useContext, useEffect } from "react";
import "./LoginPopup.css";
import { useState } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const onChangehandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    const res = await axios.post(newUrl, data);
    if (res.data.success) {
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      setShowLogin(false);
    } else {
      alert(res.data.message);
    }
  };
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img src={assets.cross_icon} onClick={() => setShowLogin(false)} />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <>
              <input
                type="email"
                placeholder="Your email"
                required
                onChange={onChangehandler}
                name="email"
                value={data.email}
              />
              <input
                type="password"
                placeholder="Password "
                required
                onChange={onChangehandler}
                name="password"
                value={data.password}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Your name"
                required
                onChange={onChangehandler}
                name="name"
                value={data.name}
              />
              <input
                type="email"
                placeholder="Your email"
                required
                onChange={onChangehandler}
                name="email"
                value={data.email}
              />
              <input
                type="password"
                placeholder="Password "
                required
                onChange={onChangehandler}
                name="password"
                value={data.password}
              />
            </>
          )}
        </div>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By coninuing, i agree to the terms of use & privacy policies</p>
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
      
        {currentState === "Login" ? (
          <p>
            Create new Account ?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an Account ?{" "}
            <span onClick={() => setCurrentState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
