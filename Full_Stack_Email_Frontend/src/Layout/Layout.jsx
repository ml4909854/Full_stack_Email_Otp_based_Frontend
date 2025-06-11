import React, { useEffect, useState } from "react";
import "./layout.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

 
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Handle Login Button Click
  const handleLoginClick = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/user/generateToken`, {
        token: refreshToken,
      });
             console.log(response)
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        alert("Welcome To Blog App!")
        setIsAuthenticated(true);
        navigate("/"); // or navigate("/myblog")
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log("Auto-login failed:", error.message);
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="logo">MyBlog</div>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)}>Blogs</Link>
          <Link to="/create" onClick={() => setIsOpen(false)}>CreateBlogs</Link>

          {isAuthenticated ? (
            <>
              <Link to="/myblog" onClick={() => setIsOpen(false)}>Myblogs</Link>
              <button className="button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="button" onClick={handleLoginClick}>Login</button>
              <Link to="/signup" onClick={() => setIsOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
