import { testData } from "./Home.jsx";
import { useState, useEffect } from "react";
import "../public/Item.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Map from "../components/Map.jsx";
import { useParams } from "react-router-dom";

const Item = () => {
  const [count, setCount] = useState(0);
  const [slider, setSlider] = useState(null);
  {
    /*Checks the http address and sees if the Product id is there*/
    /*Gets the product ID and checks if it's in the testData object in Home.jsx*/
  }
  const { productId } = useParams();

  const thisProduct = testData.find((prod) => prod.id === Number(productId));

  useEffect(() => {
    if (thisProduct) {
      setSlider(thisProduct.imageList[0]);
    }
  }, [thisProduct]);

  const IncSlider = () => {
    const newCount = (count + 1) % thisProduct.imageList.length;
    setCount(newCount);
    const newSlider = thisProduct.imageList[newCount];
    setSlider(newSlider);
  };

  const DecSlider = () => {
    const newCount =
      (count - 1 + thisProduct.imageList.length) % thisProduct.imageList.length;
    setCount(newCount);
    setSlider(thisProduct.imageList[count]);
  };

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

        <ArrowBackIosIcon
          style={{ zIndex: 3, color: "white", fontSize: "2rem" }}
          onClick={DecSlider}
        />

        <img
          src={slider}
          alt="UFVBay logo"
          className="w-50 position-relative mx-auto"
          style={{ zIndex: 2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
        />

        <ArrowForwardIosIcon
          onClick={IncSlider}
          style={{ zIndex: 3, color: "white", fontSize: "2rem" }}
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
