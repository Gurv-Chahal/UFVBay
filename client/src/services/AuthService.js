import axios from "Axios";
import { jwtDecode } from "jwt-decode";


// Random commment


// login api call
export const loginAPICall = (usernameOrEmail, password) => {
  return axios.post("http://localhost:8080/auth/login", {
    usernameOrEmail,
    password,
  });
};

// Store user ID
export const storeUserId = (userId) => {
  localStorage.setItem("userId", userId);
};


// register api call
export const registerAPICall = (userData) => {
  return axios.post("http://localhost:8080/auth/register", userData);
};







// Stores a JWT token in the browsers localstorage - (token) holds JWT String
export const storeToken = (token) => {
  console.log('Storing token:', token);

  // setItem stores the token with "token" as the key and token variable as value
  return localStorage.setItem("token", token);
};

// retrieves the JWT token from localstorage
export const getToken = () => {

  // getItem retrieves value stored in the "token" key, then it is stored in token variable
  const token = localStorage.getItem("token");
  console.log('Retrieved token from localStorage:', token);
  return token;
};


// fetches authenticated users information from backend using JWT token
export const getUserInfo = async () => {

  // retrives the JWT token from localstorage
  const token = getToken();
  console.log("Token:", token);

  if (!token) {
    return null;
  }

  try {

    // send api request to backend "userinfo" endpoint
    const response = await axios.get(`http://localhost:8080/api/listings/userinfo`, {
      // Authorization header and "Bearer token" is sent to the backend so the user can be authenticated before the info is sent back
      headers: { Authorization: `Bearer ${token}` },
    });

    // now that the user has been authenticated this will contain users info
    return response.data;

  } catch (error) {
    console.error("error fetching user info from backend:", error);
    return null;
  }
};









// ---------
// change button from log in to log out when the user is logged in

// store username in sessionstorage to maintain authenticated user state during current session
export const saveLoggedInUser = (username) => {
  // session storage goes away once browser is closed
  return sessionStorage.setItem("authenticatedUser", username);
};

// check if user is logged in
export const isUserLoggedIn = () => {
  // get username from session storage
  const username = sessionStorage.getItem("authenticatedUser");

  // check whether anything is returned from session storage
  if (username == null) {
    return false;
  } else {
    return true;
  }
};


// logout - clear storage and reload page
export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  // refreshes the page when logout is clicked and doesnt route back to login page
  window.location.reload(false);
};
