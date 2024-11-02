import React, {useState} from "react";
import "../public/Auth.css";
import ufvbaylogo from "../images/ufvbaylogo.png";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {loginAPICall, saveLoggedInUser, storeToken} from "../services/AuthService.js";
import axios from "axios";


const Auth = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigator = useNavigate();


    // made it async so that it waits for login api call to finish to make sure everything
    // runs in correct order
    async function handlelogin(e) {

        await loginAPICall(username, password).then((response) => {
            console.log(response.data)

            // basic authentication token used to authenticate users using username password
            // even if the browser gets closed and reopened. In this case its just storing the token
            const token = 'Basic' + window.btoa(username + ':' + password);
            storeToken(token);

            saveLoggedInUser(username)

            navigator('/');


        }).catch(error => {
            console.log(error);
        })
    }



  return (
    <div className="w-full h-screen d-flex align-items-center justify-content-center">
      <div className="row w-100 vh-100">
        {/*Log In half of auth page */}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          {/*Sign Up portion */}
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-light-green p-3 rounded-pill"
              onClick={handlelogin}
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
          {/*Button redirects to signup page*/}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-light-green p-3 rounded-pill"
                style={{
                  width: "200px",
                  backgroundColor: "#3AF669",
                  border: "2px solid #fff",
                  color: "#fff",
                }}
              >
                Create Account
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
