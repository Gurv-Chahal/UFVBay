import { Link, useLocation } from "react-router-dom";
import AccountNavBar from "../components/AccountNavBar.jsx";
import AccountSideBar from "../components/AccountSideBar.jsx";
import React from "react";
import Dropzone from "react-dropzone";
import Map from "../components/Map.jsx";
import "../public/CreateListing.css";

const CreateListing = () => {
  return (
    <div
      className="container-fluid p-0"
      style={{ backgroundColor: "#f0f0f0", height: "100vh" }}
    >
      <div className="row m-0">
        <div className="col-12 p-0">
          <AccountNavBar /> {/* Navbar spans the full width */}
        </div>
      </div>
      <div className="row m-0 ">
        <div className="col-md-3 p-0">
          {/* Sidebar occupies 3 columns on medium+ screens */}
          <AccountSideBar />
        </div>
        <div className="col-md-4 mx-5 px-5">
          {/* "Listing Details" Section */}
          <div className="my-5 py-3">
            <h1 className="mb-5">Listing Details</h1>
            <Map />
            <h4 className="my-2">Where on campus do you want to meet?</h4>
          </div>
          <input
            type="text"
            className="form-control py-2"
            placeholder="Enter Title"
            style={{
              borderTop: "none",
              borderLeft: "none",
              backgroundColor: "#e0e0e0",
              borderRight: "none",
            }}
          />
          <div className="my-3 d-flex">
            <input
              type="text"
              className="form-control py-2"
              placeholder="Enter Listing Amount"
              style={{
                width: "300px",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                backgroundColor: "#e0e0e0",
              }}
            />
            <select
              className="form-control py-2 mx-2"
              style={{
                width: "300px",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                backgroundColor: "#e0e0e0",
              }}
            >
              <option value="" disabled selected>
                Select subject
              </option>
              <option value="MATH">MATH</option>
              <option value="COMP">COMPUTER SCIENCE</option>
              <option value="PHYSICS">PHYSICS</option>
            </select>
          </div>
          <textarea
            id="description"
            className="form-control"
            rows="4"
            placeholder="Enter your description here"
            style={{
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              backgroundColor: "#e0e0e0",
            }}
          />
        </div>
        <div className="col-md-4 p-0 position-relative">
          {" "}
          {/* Set position-relative here */}
          {/* "Add Photos" Section */}
          <div className="my-5 py-3">
            <h1>Add Photos</h1>
            <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section className="dropzone my-5">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Add your images here, or click to select your images</p>
                  </div>
                </section>
              )}
            </Dropzone>
            <button
              className="btn btn-primary position-absolute"
              style={{ bottom: "20px", right: "20px" }}
            >
              Post Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
