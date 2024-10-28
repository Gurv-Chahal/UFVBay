import React from "react";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import ufvbaylogo from "../images/ufvbaylogo.png";
import ProductCards from "../components/ProductCards.jsx";
import HomeMain from "../components/HomeMain.jsx";
import { Link, useLocation } from "react-router-dom";

// Test Data for cards
export const testData = [
  {
    image: ufvbaylogo,
    name: "Single Variable Calculus Early Transcendentals, 8th Edition by James Stewart ",
    price: "20.99$",
    author: "Ronald E. Walpole",
    subject: "MATH",
    id: 19203,
    description: "lightly used don't need it anymore",
  },
  {
    image: ufvbaylogo,
    name: "Ralph P. Grimaldi - Discrete and combinatorial mathematics_ An Applied Introduction-Pearson (2004)",
    price: "20.99$",
    id: 10234,
    description: "lightly used don't need it anymore",
  },
  {
    image: ufvbaylogo,
    name: "Product1",
    price: "20 bucks",
    description: "lightly used don't need it anymore",
  },
  {
    image: ufvbaylogo,
    name: "Product1",
    price: "20 bucks",
    description: "lightly used don't need it anymore",
  },
  {
    image: ufvbaylogo,
    name: "Product1",
    price: "20 bucks",
    description: "lightly used don't need it anymore",
  },
  {
    image: ufvbaylogo,
    name: "Product1",
    price: "20 bucks",
    description: "lightly used don't need it anymore",
  },
];

const Home = () => {
  return (
    <div>
      <Navbar />

      <div className="d-flex">
        <HomeSideBar />
        <div className="ms-auto col-10 col-md-10">
          <div className="m-5 py-5 d-flex flex-wrap">
            {/*Maps out testData object to ProductCards component */}
            {testData.map((product) => (
              <div key={product.id} className="m-4">
                <Link to={`/item/${product.id}`}>
                  <ProductCards
                    price={`CA ${product.price}`}
                    image={product.image}
                    name={product.name}
                    author={product.author}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
