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
            <a href="https://www.facebook.com/share/1CvjwkdXFc/" target="_blank"><img src={assets.facebook_icon} alt="Facebook"/></a>
            <a href="https://www.instagram.com/foodhub.india20?igsh=MWl4bmJ1aWgyeTBtaA==" target="_blank"><img src={assets.insta_icon} alt="Instagram"/></a>
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
            <li>+91 9093810998</li>
            <li>contact@foodhubindia.com</li>
            <li>
            <a href="https://share.google/gzA2nI6rz9D0XxWxk" target="_blank">
  Anatheswar Rd, near Forest Office, Krishnanagar, West Bengal 741101 —

    View on Google Maps
  </a>
</li>
<li>
  <a href="https://www.google.com/search?sca_esv=dd662b92346943f5&rlz=1C5CHFA_enIN1080IN1087&cs=1&output=search&kgmid=/g/11ynk4r7fn&q=Food+Hub&shndl=30&shem=ptotplc,shrtsdl&source=sh/x/loc/uni/m1/1&kgs=05536b2b7a05095b&utm_source=ptotplc,shrtsdl,sh/x/loc/uni/m1/1#lrd=0x39f91f7c188f539d:0x96cc48528b53d8e5,1,,,,"
  target="_blank">
    Help us improve 
    Share your exprience with us
  </a>
</li>

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
