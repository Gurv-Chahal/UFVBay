// Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import ProductCards from "../components/ProductCards.jsx";
import { getAllListings } from "../services/ListingService.js";
import testData from "../public/testData.jsx";

const Home = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listings, setListings] = useState([]);
  const [filteredItems, setFilteredItems] = useState("");
  const [searchQuery, setsearchQuery] = useState("");

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject === "ALL" ? "" : subject);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const results = listings.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredItems(results);
  };

  const fetchListings = () => {
    // calls getAllListings function which sends an api call to backend endpoint
    getAllListings()
      .then((response) => {
        // combine testData with fetched listings by using spread operator
        const combinedListings = [...response.data];
        setListings(combinedListings);
        console.log(combinedListings);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  };

  const filteredData = selectedSubject
    ? listings.filter((product) => product.subject === selectedSubject)
    : listings;

  return (
    <div>
      <Navbar onSearch={handleSearch} results={filteredItems} />
      <div className="d-flex">
        <HomeSideBar onSubjectChange={handleSubjectChange} />
        <div className="ms-auto col-10 col-md-10">
          <div className="m-5 py-5 d-flex flex-wrap">
            {filteredData.map((product) => {
              // adjusted image selection to include imageUrls arraylist
              const image =
                (product.imageUrls && product.imageUrls[0]) ||
                (product.images && product.images[0]) ||
                product.image;

              return (
                <div key={product.id} className="m-4">
                  <Link
                    to={`/item/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <ProductCards
                      price={`CA ${product.amount || product.price}$`}
                      image={image}
                      name={product.title}
                      author={product.author}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
