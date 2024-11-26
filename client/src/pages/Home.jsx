import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import testData from "../public/testData.jsx";
import ProductCards from "../components/ProductCards.jsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllListings } from "../services/ListingService.js"; // Adjust the path as necessary

const Home = () => {
    const [selectedSubject, setSelectedSubject] = useState("");
    const [listings, setListings] = useState([]);

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject === "ALL" ? "" : subject);
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = () => {
        getAllListings()
            .then((response) => {
                // Combine testData with fetched listings
                const combinedListings = [...testData, ...response.data];
                setListings(combinedListings);
            })
            .catch((error) => {
                console.error("Error fetching listings:", error);
                setListings(testData);
            });
    };

    const filteredData = selectedSubject
        ? listings.filter((product) => product.subject === selectedSubject)
        : listings;

    return (
        <div>
            <Navbar />

            <div className="d-flex">
                <HomeSideBar onSubjectChange={handleSubjectChange} />
                <div className="ms-auto col-10 col-md-10">
                    <div className="m-5 py-5 d-flex flex-wrap">
                        {filteredData.map((product) => (
                            <div key={product.id} className="m-4">
                                <Link to={`/item/${product.id}`}>
                                    <ProductCards
                                        price={`CA ${product.amount || product.price}`}
                                        image={
                                            (product.images && product.images[0]) || product.image
                                        }
                                        name={product.title || product.name}
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
