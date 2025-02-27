import "../public/HomeSideBar.css";
import "../public/navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Link } from "react-router-dom";
import { isUserLoggedIn, logout } from "../services/AuthService.js";
import { useState } from "react";

//Dropdown menu that records which subject is being selected
const SubjectMenu = ({ onSubjectClick }) => {
  return (
    <ul className="dropdown-menu" aria-labelledby="subjectsDropdown">
      <li className="dropdown-item" onClick={() => onSubjectClick("MATH")}>
        Math
      </li>
      <li className="dropdown-item" onClick={() => onSubjectClick("PHYSICS")}>
        Physics
      </li>
      <li
        className="dropdown-item"
        onClick={() => onSubjectClick("COMPUTER SCIENCE")}
      >
        Computer Science
      </li>
    </ul>
  );
};

//HomeSideBar component has all elements in the menu and takes in parameter onSubjectChange
//onSubjectChange takes in values from SubjectMenu component
const HomeSideBar = ({ onSubjectChange }) => {
  // ---------
  // functionality for log in button on sidebar

  // check if user is logged in
  const isAuth = isUserLoggedIn();

  function handleLogout() {
    logout();
  }

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
        <Link to="/create-listing" style={{ textDecoration: "none" }}>
          <button
            className="btn my-5 py-4 d-flex align-items-center"
            style={{
              fontFamily: "Lato, sans-serif",
              backgroundImage: "linear-gradient(to right, #66DC6A, #0B6A31)",
              color: "white",
              border: "none",
              width: "100%",
            }}
          >
            <i
              className="bi bi-plus-circle-dotted px-3"
              style={{ fontSize: "32px" }}
            />
            Create Listing
          </button>
        </Link>

        <button
          className="btn my-3 py-3 d-flex align-items-center text-start gradient-button"
          onClick={() => onSubjectChange("ALL")}
        >
          <i className="bi bi-bag px-3" style={{ fontSize: "30px" }} />
          Browse
        </button>

        <div className="dropdown">
          <button
            className="btn my-2 py-3 d-flex align-items-center text-start gradient-button dropdown-toggle"
            type="button"
            id="subjectsDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ width: "100%" }}
          >
            <i className="bi bi-book px-3" style={{ fontSize: "30px" }} />
            Subjects
          </button>
          <SubjectMenu onSubjectClick={(subject) => onSubjectChange(subject)} />
        </div>

        {/*<button className="btn my-2 py-3 d-flex align-items-center text-start gradient-button">*/}
        {/*  <i className="bi bi-bookmark px-3" style={{ fontSize: "30px" }} />*/}
        {/*  Saved Listings*/}
        {/*</button>*/}

        {/*<button className="btn my-2 py-3 d-flex align-items-center text-start gradient-button">*/}
        {/*  <i className="bi bi-bell px-3" style={{ fontSize: "30px" }} />*/}
        {/*  Notifications*/}
        {/*</button>*/}

        {/*if isAuth is false then show login button, if its true then show log out button.
           also using onClick if user clicks logout then logout() method will handle it*/}

        {!isAuth && (
          <Link
            to="/login"
            className="d-flex align-items-center my-3 py-3 text-decoration-none btn gradient-button"
          >
            <i
              className="bi bi-box-arrow-in-right px-3"
              style={{ fontSize: "30px" }}
            />
            Log In
          </Link>
        )}

        {isAuth && (
          <Link
            to="/login"
            className="d-flex align-items-center my-3 py-3 text-decoration-none btn gradient-button"
          >
            <i
              className="bi bi-box-arrow-in-right px-3"
              style={{ fontSize: "30px" }}
            />
            Log Out
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeSideBar;
