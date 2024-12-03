import { useState, useEffect } from "react";
import "../public/Item.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import Map from "../components/Map.jsx";
import { useNavigate, useParams, Link } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axios from "Axios";

const Item = () => {
  const { productId } = useParams();
  const [listing, setListing] = useState(null);
  const [count, setCount] = useState(0);
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // State for Update Listing functionality
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedListing, setUpdatedListing] = useState({
    title: "",
    subject: "",
    amount: "",
    description: "",
    longitude: "",
    latitude: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the listing data from the backend
    const fetchListing = async () => {
      try {
        // get the JWT token from localStorage using "token" key
        const token = localStorage.getItem("token");

        // get the user ID from localStorage (ensure it's stored during login)
        const currentUserId = localStorage.getItem("userId");

        // Call getListingById endpoint in backend
        const response = await axios.get(
          `http://localhost:8080/api/listings/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // store data retrieved from backend into listingData variable
        console.log("Listing data:", response.data);
        const listingData = response.data;
        setListing(listingData);

        // set the initial slider image
        if (listingData.imageUrls && listingData.imageUrls.length > 0) {
          setSlider(listingData.imageUrls[0]);
        }

        // COmpare the listing's owner ID with the current user ID
        if (
          listingData.userId &&
          currentUserId &&
          listingData.userId.toString() === currentUserId.toString()
        ) {
          setIsOwner(true);
        }

        // initialize updatedListing with existing listing data
        setUpdatedListing({
          title: listingData.title || "",
          subject: listingData.subject || "",
          amount: listingData.amount || "",
          description: listingData.description || "",
          longitude: listingData.longitude || "",
          latitude: listingData.latitude || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching listing:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch listing");
        setLoading(false);
      }
    };

    fetchListing();
  }, [productId]);

  const handleDeleteListing = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        // Retrieve JWT token
        const token = localStorage.getItem("token");

        // Send API delete request to backend
        await axios.delete(`http://localhost:8080/api/listings/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Listing deleted successfully");
        navigate("/");
      } catch (err) {
        console.error("Error deleting listing:", err.response || err);
        alert("Failed to delete listing");
      }
    }
  };

  // handles the logic for going to the next image on Item page
  const IncSlider = () => {
    if (listing && listing.imageUrls && listing.imageUrls.length > 0) {
      const newCount = (count + 1) % listing.imageUrls.length;
      setCount(newCount);
      const newSlider = listing.imageUrls[newCount];
      setSlider(newSlider);
    }
  };

  // handles logic for going to previous image on Item page
  const DecSlider = () => {
    if (listing && listing.imageUrls && listing.imageUrls.length > 0) {
      const newCount =
        (count - 1 + listing.imageUrls.length) % listing.imageUrls.length;
      setCount(newCount);
      setSlider(listing.imageUrls[newCount]);
    }
  };

  // Handle input changes in the update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedListing((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to update the listing
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      // retrieve JWT token
      const token = localStorage.getItem("token");

      // Prepare the updated listing data
      const payload = {
        id: listing.id,
        title: updatedListing.title,
        subject: updatedListing.subject,
        amount: parseFloat(updatedListing.amount),
        description: updatedListing.description,
        longitude: parseFloat(updatedListing.longitude),
        latitude: parseFloat(updatedListing.latitude),
        imageUrls: listing.imageUrls,
        userId: listing.userId,
      };

      // send PUT request in listingcontroller to update the listing
      const response = await axios.put(
        `http://localhost:8080/api/listings/${listing.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // update the listing state with the response data
      setListing(response.data);

      // hide the update form
      setIsUpdating(false);

      alert("Listing updated successfully!");
    } catch (err) {
      console.error("Error updating listing:", err.response || err);
      alert("Failed to update listing. Please try again.");
    }
  };

  // Handle the "Update Listing" button click
  const handleUpdateClick = () => {
    setIsUpdating(true);
  };

  // Handle cancelling the update
  const handleCancelUpdate = () => {
    setIsUpdating(false);
    // Reset updatedListing to current listing data
    setUpdatedListing({
      title: listing.title || "",
      subject: listing.subject || "",
      amount: listing.amount || "",
      description: listing.description || "",
      longitude: listing.longitude || "",
      latitude: listing.latitude || "",
    });
  };

  // handle the X button click to navigate back to home
  const handleClose = () => {
    navigate("/");
  };

  if (loading) {
    return <div>Loading listing...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!listing) {
    return <div>No listing found.</div>;
  }

  return (
    <div
      className="container-fluid row"
      style={{ height: "100vh", position: "relative" }}
    >
      {/* image Slider Section */}
      <div
        className="col-9 d-flex justify-content-center align-items-center position-relative border"
        style={{
          backgroundImage: `url(${slider})`,
          backgroundPosition: "center",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Overlay for darkening the background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        ></div>

        {/* Previous Image Button */}
        <ArrowBackIosIcon
          style={{
            zIndex: 3,
            color: "white",
            fontSize: "2rem",
            cursor: "pointer",
            position: "absolute",
            left: "10px",
          }}
          onClick={DecSlider}
        />

        {/* Next Image Button */}
        <ArrowForwardIosIcon
          onClick={IncSlider}
          style={{
            zIndex: 3,
            color: "white",
            fontSize: "2rem",
            cursor: "pointer",
            position: "absolute",
            right: "10px",
          }}
        />

        {/* Display the current image */}
        {slider ? (
          <img
            src={slider}
            alt="Listing Image"
            className="w-50 position-relative mx-auto"
            style={{ zIndex: 2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
          />
        ) : (
          <div
            className="w-50 position-relative mx-auto"
            style={{
              zIndex: 2,
              height: "300px",
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>No image available</p>
          </div>
        )}
      </div>

      {/* Listing Details Section */}
      <div className="col-3" style={{ height: "100vh", overflowY: "auto" }}>
        <div className="my-2 mx-3">
          {/* Listing Title */}
          <h1 className="listtitle">{listing.title || "No Title"}</h1>

          {/*Owner username*/}
          <p className="listowner">
            <strong>Posted By:</strong> {listing.username || "Unknown"}
          </p>

          {/* Listing Price */}
          <div className="price-container">
            <h5 className="listprice">Listing Price:</h5>
            <h5 className="listamount">${listing.amount || "N/A"}</h5>
          </div>
          <div className="my-5">
            <h5 className="b5">Meeting Spot 📍 </h5>
            {/*Map Component */}
            {listing.latitude && listing.longitude ? (
                <Map
                    position={{lat: listing.latitude, lng: listing.longitude}}
                />
            ) : (
                <p>No meeting spot specified.</p>
            )}

            <div>
              {/* "X" Button*/}
              <button
                  onClick={handleClose}
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "2%",
                    borderRadius: "20%",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "2.5rem",
                    cursor: "pointer",
                    zIndex: 5,
                  }}
                  aria-label="Close"
              >
                <DisabledByDefaultIcon fontSize="inherit"/>
              </button>
            </div>
          </div>
          <h5 className="b5">Listing Description: </h5>
          {/* Listing Description */}
          <p className="listdescr">
            {listing.description || "No description provided."}
          </p>

          {/* update Listing Button */}
          {isOwner && (
              <button
                  className="btn btn-primary updatelisting"
                  onClick={handleUpdateClick}
              >
                Update Listing
              </button>
          )}
          {/* Delete Listing Button conditionally renders only if the account is the owner of the listing */}
          {isOwner && (
              <button
                  className="my-2 btn btn-danger"
                  onClick={handleDeleteListing}
              >
                Delete Listing
              </button>
          )}
        </div>
      </div>

      {/* Update Form that opens after clicking button */}
      {isUpdating && (
          <div className="update-form-overlay">
            <div className="update-form-container">
            <h2 className="updateformlisting">Update Listing</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={updatedListing.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject:</label>
                <input
                  type="text"
                  name="subject"
                  value={updatedListing.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  value={updatedListing.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={updatedListing.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Longitude:</label>
                <input
                  type="number"
                  name="longitude"
                  step="0.0001"
                  value={updatedListing.longitude}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Latitude:</label>
                <input
                  type="number"
                  name="latitude"
                  step="0.0001"
                  value={updatedListing.latitude}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Add more fields as necessary */}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelUpdate}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
