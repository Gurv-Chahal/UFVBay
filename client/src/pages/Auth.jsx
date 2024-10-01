import react from "react";
import "../public/Auth.css";
import ufvbaylogo from "../images/ufvbaylogo.png";

const Auth = () => {
  return (
    <div className="w-full h-screen d-flex align-items-center justify-content-center">
      <div className="row w-100 vh-100">
        <div className="col-6 border d-flex flex-column justify-content-center">
          <h1 className="text-center" style={{ fontSize: "4rem" }}>
            Sign In
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
          </div>
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
              Log In
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
                Make an account and start shopping for textbooks for cheap!
              </h3>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-light-green p-3 rounded-pill"
              style={{
                width: "200px",
                backgroundColor: "#3AF669",
                border: "2px solid #fff", // Added solid style to the border
                color: "#fff",
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
