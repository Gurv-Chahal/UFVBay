import { useState } from "react";
import AccountNavBar from "../components/AccountNavBar.jsx";
import AccountSideBar from "../components/AccountSideBar.jsx";
import axios from "Axios";
import Dropzone from "react-dropzone";
import Map from "../components/Map.jsx";
import "../public/CreateListing.css";
import { addListing } from "../services/ListingService.js";
import { useNavigate } from "react-router-dom";


const CreateListing = () => {

  //State to be posted
  const [position, setPosition] = useState(null);

  const [preview, setPreview] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [price, setPrice] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleDrop = (acceptedFiles) => {
    const uploadImages = acceptedFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file); //Apends image file
      formData.append("upload_preset", "UFVBay");

      //Use axios to post image files to the URL
      return axios
        .post(
          `https://api.cloudinary.com/v1_1/dl3lcg7x5/image/upload`,
          formData
        )
        .then((response) => response.data.secure_url); // Image URL from response
    });

    // When all uploads are complete, image state is set with spread operator to add the new URLs when another image is uploaded

    Promise.all(uploadImages).then((urls) => {
      setImages((prev) => [...prev, ...urls]);
      const newPreviews = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setPreview((prev) => [...prev, ...newPreviews]);
    });
  };



  const handleSubmit = () => {
    // Validate inputs
    if (!bookTitle || !price || !subject) {
      alert("Please fill in all required fields.");
      return;
    }

    // Construct the listing data object
    const listingData = {
      title: bookTitle,
      subject: subject,
      amount: parseFloat(price),
      description: description,
      images: images,
    };

    // Call addListing to send data to the backend - parameter is the ListingData object
    addListing(listingData)
        .then((response) => {
          console.log("Listing added:", response.data);

        })
        .catch((error) => {
          console.error("Error adding listing:", error);
          // Show an error message to the user
          alert("An error occurred while adding the listing. Please try again.");
        });
  };






  return (
    <div
      className="container-fluid p-0 min-vh-100 "
      style={{ backgroundColor: "#f0f0f0" }}
    >
      <AccountNavBar /> {/* Navbar spans the full width */}
      <div className="d-flex ">
        <div className="col-md-3 p-0">
          <AccountSideBar />
          {/* Sidebar occupies 3 columns on medium+ screens */}
        </div>
        <div className="col-md-4 mx-5 px-5 my-5 ">
          {/* "Listing Details" Section */}
          <div className="my-5 py-3">
            <h1 className="mb-5">Listing Details</h1>
            {/*Pass in position state to Map component */}
            <Map position={position} setPosition={setPosition} />
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
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div
          className="col-md-4 p-0 position-relative my-5 py-5"
          style={{ textDecoration: "none" }}
        >
          {" "}
          {/* "Add Photos" Section */}
          <div className="my-5 py-5 ">
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <section className="dropzone my-5">
                  <div {...getRootProps()} className="p-3  text-center">
                    <input {...getInputProps()} />
                    <p className="p-3">
                      Add your images here, or click to select your images
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
            <div className="mt-3">
              {preview.map((image, index) => (
                <img
                  key={index}
                  src={image.preview}
                  alt="Preview"
                  style={{ width: "150px", marginBottom: "10px" }}
                  className="mx-2"
                />
              ))}
            </div>
            <button
              className="btn btn-primary position-absolute"
              style={{ bottom: "20px", right: "20px" }}
              onClick={handleSubmit}
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
