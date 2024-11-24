import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import testData from "../public/testData.jsx";
import ProductCards from "../components/ProductCards.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleSubjectChange = (subject) => {
    //If the subject is "ALL" the state is rest and the normal browse page is displayed"
    //If not the data is filtered
    setSelectedSubject(subject === "ALL" ? "" : subject);
    console.log("Selected Subject: ", subject);
  };
  //Data filtering based on the subject that is being passed in
  const filteredData = selectedSubject
    ? testData.filter((product) => product.subject === selectedSubject)
    : testData;

  return (
    <div>
      <Navbar />

      <div className="d-flex">
        <HomeSideBar onSubjectChange={handleSubjectChange} />
        <div className="ms-auto col-10 col-md-10">
          <div className="m-5 py-5 d-flex flex-wrap">
            {/*Maps out testData object to ProductCards component */}

            {filteredData.map((product) => (
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
