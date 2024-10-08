import React from "react";
import ufvbaylogo from "../images/ufvbaylogo.png";
import "../public/navbar.css";

//Navbar component
const Navbar = () => {
  return (
    <nav
      //Sets nav bar colour and makes it appear above homeside navbar
      className="navbar navbar-light bg-light z-1"
      style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand d-flex" href="#">
          <img
            src={ufvbaylogo}
            className="mx-2"
            alt="UFV Bay Logo"
            style={{ width: "50px", height: "50px", marginRight: "12px" }}
          />
          <h2 className="py-2">UFVBay</h2>
        </a>

        <form className="d-flex order-1 order-md-0 search-bar">
          <input
            className="form-control "
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>

        <div className="d-flex order-0 order-md-1">
          <button
            className="btn border-0"
            style={{ padding: "15px 20px", border: "none" }}
          >
            <i className="bi bi-chat-left" style={{ fontSize: "32px" }}></i>
          </button>
          <button
            className="btn border-0"
            style={{ padding: "15px 20px", border: "none" }}
          >
            <i className="bi bi-person" style={{ fontSize: "35px" }}></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
