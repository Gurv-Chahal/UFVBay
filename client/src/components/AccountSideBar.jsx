import React from "react";
import "../public/HomeSideBar.css";
import { Link, useLocation } from "react-router-dom";

const AccountSideBar = () => {
  return (
    <div
      className="h-100 z-0 "
      style={{
        backgroundColor: "#f8f9fa",
        width: "20%",
        position: "fixed",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="d-flex flex-column">
        <Link to="/" style={{ textDecoration: "none" }}>
          <button
            className="btn my-5 py-4 d-flex align-items-center gradient-button"
            style={{
              fontFamily: "Lato, sans-serif",
              textDecoration: "none",
              width: "100%",
              color: "black",
            }}
          >
            <i
              className="bi bi-arrow-left px-3"
              style={{ fontSize: "32px" }}
            ></i>
            Back to Browse
          </button>
        </Link>

        <button className="btn my-2 py-3 d-flex align-items-center text-start gradient-button">
          <i className="bi bi-person px-3" style={{ fontSize: "30px" }} />
          Account
        </button>

        <button className="btn my-3 py-3 d-flex align-items-center text-start gradient-button">
          <i
            className="bi bi-clock-history px-3"
            style={{ fontSize: "30px" }}
          />
          Your Listings
        </button>

        <button className="btn my-2 py-3 d-flex align-items-center text-start gradient-button">
          <i className="bi bi bi-star px-3" style={{ fontSize: "30px" }} />
          Wishlist
        </button>

        <button className="btn my-3 py-3 d-flex align-items-center text-start gradient-button">
          <i className="bi bi-bell px-3" style={{ fontSize: "30px" }} />
          Notifications
        </button>
      </div>
    </div>
  );
};

export default AccountSideBar;
