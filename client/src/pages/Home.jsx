import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import testData from "../public/testData.jsx";
import ProductCards from "../components/ProductCards.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [filteredItems, setFilteredItems] = useState(testData);
  const [searchQuery, setsearchQuery] = useState("");

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const results = testData.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredItems(results);
  };

  const handleSubjectChange = (subject) => {
    //If the subject is "ALL" the state is reset and the normal browse page is displayed"
    //If not the data is filtered
    setSelectedSubject(subject === "ALL" ? "" : subject);
  };
  //Data filtering based on the subject that is being passed in
  const filteredProducts = testData.filter((product) => {
    const matchSubject =
      !selectedSubject || product.subject === selectedSubject;

    const matchSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery);

    return matchSubject && matchSearch;
  });

  return (
    <div>
      <Navbar onSearch={handleSearch} />

      <div className="d-flex">
        <HomeSideBar onSubjectChange={handleSubjectChange} />
        <div className="ms-auto col-10 col-md-10">
          <div className="m-5 py-5 d-flex flex-wrap">
            {/* Map over filtered products */}
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
