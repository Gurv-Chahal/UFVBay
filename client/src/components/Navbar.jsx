import React from "react";
import ufvbaylogo from "../images/ufvbaylogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

import { useState } from "react";
import "../public/navbar.css";

//Navbar component
const Navbar = ({ onSearch, results }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowDropdown(true);
    console.log(searchQuery);
  };

  const handleResultClick = (item) => {
    console.log("Selected Item: ", item);
    setShowDropdown(false);
    navigate(`/item/${item.id}`);
  };

  return (
    <nav
      //Sets nav bar colour and makes it appear above homeside navbar
      className="navbar navbar-light bg-light z-1 fixed-top"
      style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="container-fluid ">
        <a className="navbar-brand d-flex" href="#">
          <img
            src={ufvbaylogo}
            className="mx-2"
            alt="UFV Bay Logo"
            style={{ width: "50px", height: "50px", marginRight: "12px" }}
          />
          <h2 className="py-2">UFVBay</h2>
        </a>
        {/*Search bar jsx*/}
        <form
          className="d-flex order-1 order-md-0 search-bar position-relative"
          onSubmit={handleSearch}
          ref={dropdownRef}
        >
          <input
            className="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery} // Controlled input field
            onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
            onFocus={() => setShowDropdown(true)} // Show dropdown on focus
          />
          <button className="btn btn-outline-success" type="submit">
            <i className="bi bi-search"></i>
          </button>

          {/* Dropdown Suggestions */}
          {showDropdown && results.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                zIndex: 1050,
              }}
            >
              <ul className="dropdown-menu w-100 show">
                {results.map((item, index) => (
                  <li
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleResultClick(item)} // Handle selection
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Display the title and price */}
                      <div className="d-flex align-items-center">
                        <span className="me-3" style={{ fontWeight: "bold" }}>
                          {item.title}
                        </span>

                        {/* Display the price if available */}
                        {item.amount && (
                          <span
                            className="text-muted"
                            style={{ fontSize: "14px" }}
                          >
                            ${item.amount}
                          </span>
                        )}
                      </div>

                      {item.imageUrls && item.imageUrls[0] && (
                        <img
                          src={item.imageUrls[0]} // Use the first image URL
                          alt={item.title} // Provide alt text for the image
                          style={{
                            width: "40px", // Adjust size as needed
                            height: "40px",
                            marginLeft: "10px",
                            borderRadius: "5px", // Optional: Add border radius for rounded corners
                          }}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <div className="d-flex order-0 order-md-1">
          {/*Message button*/}
          {/*<button */}
          {/*  className="btn border-0"*/}
          {/*  style={{ padding: "15px 20px", border: "none" }}*/}
          {/*>*/}
          {/*  <i className="bi bi-chat-left" style={{ fontSize: "32px" }}></i>*/}
          {/*</button>*/}
          {/*Account Button*/}
          <button
            className="btn border-0"
            style={{ padding: "15px 20px", border: "none" }}
          >
            {" "}
            <Link to="/account">
              <i
                className="bi bi-person"
                style={{ fontSize: "35px", color: "black" }}
              ></i>
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
