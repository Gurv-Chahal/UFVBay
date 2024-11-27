import "../public/HomeSideBar.css";
import { Link } from "react-router-dom";




// accountsidebar component recieves ontabchange function as a prop
// ontabchange = handletabchange (in Account.jsx)
const AccountSideBar = ({ onTabChange }) => {
    return (
        <div
            className="h-100 z-0 col-2 navbar-fixed"
            style={{
                backgroundColor: "#f8f9fa",
                position: "fixed",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                height: "100vh",
            }}
        >
            <div className="d-flex flex-column">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <button
                        className="btn my-5 py-4 d-flex align-items-center gradient-button"
                        style={{
                            fontFamily: "Lato, sans-serif",
                            textDecoration: "none",
                            width: "100%",
                            color: "black",
                        }}
                    >
                        <i
                            className="bi bi-arrow-left px-3"
                            style={{ fontSize: "32px" }}
                        ></i>
                        Back to Browse
                    </button>
                </Link>


                {/*When the user clicks on a button then onClick event handler calls onTabChange which then calls
                -> handletabchange in the parent component which holds the logic to update activeTab state
                and it will then change the activetab state value (account, listings, etc) */}

                <button
                    className="btn my-2 py-3 d-flex align-items-center text-start gradient-button"
                    onClick={() => onTabChange("account")}
                >
                    <i className="bi bi-person px-3" style={{ fontSize: "30px" }} />
                    Account
                </button>

                <button
                    className="btn my-3 py-3 d-flex align-items-center text-start gradient-button"
                    onClick={() => onTabChange("listings")}
                >
                    <i
                        className="bi bi-clock-history px-3"
                        style={{ fontSize: "30px" }}
                    />
                    Your Listings
                </button>


            </div>
        </div>
    );
};

export default AccountSideBar;
