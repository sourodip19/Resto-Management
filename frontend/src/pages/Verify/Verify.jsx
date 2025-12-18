import React, { useContext, useEffect, useRef } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const hasVerified = useRef(false); // 🔒 BLOCK multiple calls

  const verifyPayment = async () => {
    try {
      const res = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });

      if (res.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Verify error:", err);
      navigate("/");
    }
  };

  useEffect(() => {
    if (hasVerified.current) return; // 🛑 already called
    hasVerified.current = true;

    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
      <p>Verifying payment, please wait...</p>
    </div>
  );
};

export default Verify;
