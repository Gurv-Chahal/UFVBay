import { testData } from "./Home.jsx";
import React from "react";
import { useParams } from "react-router-dom";

const Item = () => {
  const { productId } = useParams();
  const thisProduct = testData.find((prod) => prod.id === Number(productId));

  return (
    <div className="container-fluid row">
      <div
        className="col-9 d-flex justify-content-center align-items-center position-relative border "
        style={{
          backgroundImage: `url(${thisProduct.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
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

      <div className="col-3">
        <p>{thisProduct.name}</p>
      </div>
    </div>
  );
};

export default Item;
