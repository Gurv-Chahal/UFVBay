import { useState, useEffect } from "react";
import "../public/Item.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Map from "../components/Map.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "Axios";

const Item = () => {
  const { productId } = useParams();
  const [listing, setListing] = useState(null);
  const [count, setCount] = useState(0);
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the listing data from the backend and make it async to not disrupt the code well waiting for api request
    const fetchListing = async () => {
      try {
        // get the JWT token from localstorage using "token" key
        const token = localStorage.getItem("token");

        // calls getListingById endpoint in backend which gives the productId and data for it
        const response = await axios.get(
          `http://localhost:8080/api/listings/${productId}`,
          {
            // uses authorization header and bearer token key value pair to authenticate user using JWT when calling endpoint
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // store data that was retrieved from backend into listingData variable
        const listingData = response.data;
        // give data in the variable to listing state
        setListing(listingData);

        // if there is an array of images AND there is atleast one image in the array
        if (listingData.imageUrls && listingData.imageUrls.length > 0) {
          // then set the first image in the array as the image in Item
          setSlider(listingData.imageUrls[0]);
        }

        // Get the current user ID from localStorage
        const currentUserId = localStorage.getItem("userId");

        // Compare the listing's owner ID with the current user ID
        if (
          listingData.userId &&
          currentUserId &&
          listingData.userId.toString() === currentUserId.toString()
        ) {
          setIsOwner(true);
        }

        // indicate fetching data is finished
        setLoading(false);
      } catch (err) {
        console.error("Error fetching listing:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch listing");
        setLoading(false);
      }
    };

    // call the function
    fetchListing();

    // dependency array holds productId so that the effect runs once and then every time productId changes
  }, [productId]);

  const handleDeleteListing = async () => {
    // create pop up window when delete button is clicked which then confirms or denies the request giving if statement true or false boolean
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        //retrieve JWT token
        const token = localStorage.getItem("token");

        // sent api delete request to backend, also send authorization header and jwt token to confirm user identity
        await axios.delete(`http://localhost:8080/api/listings/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // pop up
        alert("Listing deleted successfully");

        // Redirect to home page
        navigate("/");
      } catch (err) {
        console.error("Error deleting listing:", err.response || err);
        alert("Failed to delete listing");
      }
    }
  };

  // Handles the logic for going to the next image on Item page
  const IncSlider = () => {
    // if there is a listing AND imageUrls array exists AND there is at least one image
    if (listing && listing.imageUrls && listing.imageUrls.length > 0) {
      // advances index by 1 and uses % operator so that the index wraps to 0 when it reaches the end
      const newCount = (count + 1) % listing.imageUrls.length;
      // updates the state "Count" and rerenders new image
      setCount(newCount);

      // retrieve URL of next image
      const newSlider = listing.imageUrls[newCount];
      // updates state "slider" with new image URL to change the image
      setSlider(newSlider);
    }
  };

  // Handles logic for going to previous image on Item page
  const DecSlider = () => {
    // same as Inc Slider
    if (listing && listing.imageUrls && listing.imageUrls.length > 0) {
      // calculates the previous image index and uses % operator to wrap around to 0
      // also makes sure the number is not negative
      const newCount =
        (count - 1 + listing.imageUrls.length) % listing.imageUrls.length;

      // updates "count" state
      setCount(newCount);
      // retrieve and set previous image url
      setSlider(listing.imageUrls[newCount]);
    }
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
    <div className="container-fluid row" style={{ height: "100vh" }}>
      <div
        className="col-9 d-flex justify-content-center align-items-center position-relative border "
        style={{
          backgroundImage: `url(${slider})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          overflow: "hidden",
        }}
      >
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
        <ArrowBackIosIcon
          style={{
            zIndex: 3,
            color: "white",
            fontSize: "2rem",
            cursor: "pointer",
          }}
          onClick={DecSlider}
        />

        {/*if image array exists and there is more then 1 image then show arrow forward and back button
                and onClick trigger DecSlider IncSlider functions*/}
        {listing.imageUrls && listing.imageUrls.length > 1 && <></>}
        <ArrowForwardIosIcon
          onClick={IncSlider}
          style={{
            zIndex: 3,
            color: "white",
            fontSize: "2rem",
            cursor: "pointer",
          }}
        />

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

      <div className="col-3" style={{ height: "100vh", overflowY: "auto" }}>
        <div className="my-2 mx-3 ">
          {/* Listing Title */}
          <h3>{listing.title || "No Title"}</h3>
          {/* Listing Price */}
          <h5 className="my-2">CA {listing.amount || "N/A"}</h5>
          <div className="my-5">
            <h5>Meeting Spot 📍 </h5>
            {/* Map Component */}
            {listing.latitude && listing.longitude ? (
              <Map
                position={{ lat: listing.latitude, lng: listing.longitude }}
              />
            ) : (
              <p>No meeting spot specified.</p>
            )}
          </div>
          <h5>Listing Description: </h5>
          {/* Listing Description */}
          <p>{listing.description || "No description provided."}</p>
          {/* Contact Seller Button */}
          <button
            className="my-5"
            style={{
              height: "40px",
              width: "100%",
              backgroundColor: "#34c759",
              borderColor: "#34c759",
              border: "3px solid #34c759",
              color: "#fff",
            }}
          >
            Contact Seller
          </button>

          {/* Delete Listing Button conditionally renders only if the account is the owner of the listing*/}
          {isOwner && (
            <button
              className="my-2"
              style={{
                height: "40px",
                width: "100%",
                backgroundColor: "#ff3b30",
                borderColor: "#ff3b30",
                border: "3px solid #ff3b30",
                color: "#fff",
              }}
              onClick={handleDeleteListing}
            >
              Delete Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
