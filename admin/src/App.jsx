import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import Order from "./pages/Order/Order";
import List from "./pages/List/List";
import Edit from "./pages/Edit/Edit";
import AdminLogin from "./pages/Login/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

const App = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  return (
    <div>
      <ToastContainer />

      <Routes>
        {/* 🔐 LOGIN ROUTE */}
        <Route path="/login" element={<AdminLogin />} />

        {/* 🔒 PROTECTED ADMIN ROUTES */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <hr />
                <div className="app-content">
                  <Sidebar />
                  <Routes>
                    <Route path="/" element={<List url={url} />} />
                    <Route path="/add" element={<Add url={url} />} />
                    <Route path="/list" element={<List url={url} />} />
                    <Route path="/order" element={<Order url={url} />} />
                    <Route path="/admin/edit/:id" element={<Edit url={url} />} />
                  </Routes>
                </div>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
