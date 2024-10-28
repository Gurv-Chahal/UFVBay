import "../public/Auth.css";
import ufvbaylogo from "../images/ufvbaylogo.png";
import { Link, useLocation } from "react-router-dom";

const Signup = () => {
  return (
    <div className="w-full h-screen d-flex align-items-center justify-content-center">
      <div className="row w-100 vh-100">
        {/*Create account portion of the page*/}
        <div className="col-6 border d-flex flex-column justify-content-center">
          <h1 className="text-center" style={{ fontSize: "4rem" }}>
            Create an Account
          </h1>
          <div className="my-5">
            <div className="d-flex justify-content-center">
              <input
                type="email"
                className="form-control my-4 py-3 custom-placeholder"
                id="email"
                placeholder="Enter your email"
                style={{
                  width: "600px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid #000",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <input
                type="password"
                className="form-control py-3"
                id="password"
                placeholder="Enter your password"
                style={{
                  width: "600px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid #000",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <input
                type="password"
                className="form-control py-3"
                id="password"
                placeholder="Re-enter your password"
                style={{
                  width: "600px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid #000",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
          </div>
          {/*Right half of the webpage for logging in if you have an account */}
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-light-green p-3 rounded-pill"
              style={{
                width: "200px",
                backgroundColor: "#34c759",
                borderColor: "#34c759",
                border: "3px solid #34c759",
                color: "#fff",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
        <div className="col-6  d-flex flex-column justify-content-center bg-signup">
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={ufvbaylogo}
              alt="logo for UFVBay"
              style={{ width: "120px", height: "auto", marginRight: "10px" }}
            />
            <h1
              className="text-center"
              style={{ color: "#fff", fontSize: "5rem", margin: 0 }}
            >
              UFVBay
            </h1>
          </div>
          <div className="my-5">
            <div className="d-flex justify-content-center">
              <h3
                className="text-center "
                style={{
                  color: "#fff",
                  fontSize: "2rem",
                  width: "800px",
                }}
              >
                Already have an account? Sign in and checkout the newest
                listings while you were gone!
              </h3>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            {/*Button redirects to log in npage*/}
            <Link to="/login">
              <button
                className="btn btn-light-green p-3 rounded-pill"
                style={{
                  width: "200px",
                  backgroundColor: "#3AF669",
                  border: "2px solid #fff",
                  color: "#fff",
                }}
              >
                Log In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
