import React from "react";
import "../public/HomeSideBar.css";
import "../public/navbar.css";

const HomeSideBar = () => {
  return (
    <div
      className="h-100 z-0 col-2 navbar-fixed "
      style={{
        backgroundColor: "#f8f9fa",

        position: "fixed",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="d-flex flex-column">
        <button
          className="btn my-5 py-4 d-flex align-items-center"
          style={{
            fontFamily: "Lato, sans-serif",
            backgroundImage: "linear-gradient(to right, #66DC6A, #0B6A31)",
            color: "white",
            border: "none",
          }}
        >
          <i
            className="bi bi-plus-circle-dotted px-3"
            style={{ fontSize: "32px" }}
          />
          Create Listing
        </button>

        <button className="btn my-3 py-3 d-flex align-items-center text-start gradient-button">
          <i className="bi bi-bag px-3" style={{ fontSize: "30px" }} />
          Browse
        </button>

        <button className="btn my-2 py-3 d-flex align-items-center text-start gradient-button">
          <i className="bi bi-book px-3" style={{ fontSize: "30px" }} />
          Subjects
        </button>

        <button className="btn my-2 py-3 d-flex align-items-center text-start gradient-button">
          <i className="bi bi-bookmark px-3" style={{ fontSize: "30px" }} />
          Saved Listings
        </button>

        <button className="btn my-2 py-3 d-flex align-items-center text-start gradient-button">
          <i className="bi bi-bell px-3" style={{ fontSize: "30px" }} />
          Notifications
        </button>
      </div>
    </div>
  );
};

export default HomeSideBar;
