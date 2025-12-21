import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer" id="contact-section">
      <div className="footer-content">
        
        {/* LEFT */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="FoodHub logo" />
          <p>
            FoodHub brings your favorite meals right to your doorstep.
            Fresh food, fast delivery, and unforgettable taste.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        {/* CENTER */}
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>About Us</li>
            <li>Delivery</li>
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

        {/* RIGHT */}
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
        © 2025 FoodHub India. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
