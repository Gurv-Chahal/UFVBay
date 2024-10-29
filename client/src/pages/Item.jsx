import { testData } from "./Home.jsx";
import "../public/Item.css";
import Map from "../components/Map.jsx";
import React from "react";
import { useParams } from "react-router-dom";

const Item = () => {
  {
    /*Checks the http address and sees if the Product id is there*/
    /*Gets the product ID and checks if it's in the testData object in Home.jsx*/
  }
  const { productId } = useParams();

  const thisProduct = testData.find((prod) => prod.id === Number(productId));

  return (
    <div className="container-fluid row" style={{ height: "100vh" }}>
      <div
        className="col-9 d-flex justify-content-center align-items-center position-relative border "
        style={{
          backgroundImage: `url(${thisProduct.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Dark overlay to enhance contrast between blurred background and foreground */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
            zIndex: 1, // Puts this as the background image
          }}
        ></div>

        {/* Foreground image */}
        <img
          src={thisProduct.image}
          alt="UFVBay logo"
          className="w-50 position-relative"
          style={{ zIndex: 2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
        />
      </div>
      {/*Makes right side scrollable*/}
      <div className="col-3" style={{ height: "100vh", overflowY: "auto" }}>
        {/*Necessary spacing for right column*/}
        <div className="my-2 mx-3 ">
          {/*Name property that is retrieved from testData*/}
          <h3>{thisProduct.name}</h3>
          {/*Price property that is retrieved from testData*/}
          <h5 className="my-2">CA {thisProduct.price}</h5>
          <div className="my-5">
            <h5>Meeting Spot 📍 </h5>
            <Map />
          </div>
          <h5>Listing Description: </h5>
          {/*Description property that is retrieved from testData*/}
          <p>{thisProduct.description}</p>
          {/*Inline styling for button*/}
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
        </div>
      </div>
    </div>
  );
};

export default Item;
