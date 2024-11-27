import axios from "Axios";
import { jwtDecode } from "jwt-decode";

export const loginAPICall = (usernameOrEmail, password) => {
  return axios.post("http://localhost:8080/auth/login", {
    usernameOrEmail,
    password,
  });
};

export const registerAPICall = (userData) => {
  return axios.post("http://localhost:8080/auth/register", userData);
};

// -----------
// tokens are so that we can store user login and when they reopen browser they auto login

// create token
export const storeToken = (token) => {
  console.log('Storing token:', token);
  return localStorage.setItem("token", token);
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log('Retrieved token from localStorage:', token);
  return token;
};

export const getUserInfo = () => {
  const token = getToken();
  if (!token) {
    return null;
  }

  //Decode token to get user info (if JWT contains user info)
  //may need to install jwt-decode library: npm install jwt-decode
  const decoded = jwtDecode(token);


  return decoded;
}




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

// retrieves username of logged in user allowing app to access user specific data
export const getLoggedInUser = () => {
  const username = sessionStorage.getItem("authenticatedUser");
  return username;
};

// logout - clear storage and reload page
export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  // refreshes the page when logout is clicked and doesnt route back to login page
  window.location.reload(false);
};
