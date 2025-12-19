import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="logo" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet,
            corporis veniam saepe sunt tempore quas in pariatur repellat impedit
            illum.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>

        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>

            {/* Link to Privacy Policy PDF */}
            <li>
              <a
                href="/FOODHUBINDIA_Privacy_Policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>Get In Touch</h2>
          <ul>
            <li>+91 9434132014</li>
            <li>contact@foodhubindia.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 © Tomato.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
