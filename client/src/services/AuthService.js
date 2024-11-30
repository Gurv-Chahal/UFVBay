import axios from "Axios";

const authAxios = axios.create({
  baseURL: "http://localhost:8080/auth/",
  headers: {
    "Content-Type": "application/json",
  },
});

const apiAxios = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginAPICall = (usernameOrEmail, password) => {
  return authAxios.post("login", {
    usernameOrEmail,
    password,
  });
};

export const registerAPICall = (userData) => {
  return authAxios.post("register", userData);
};

export const storeUserId = (userId) => {
  localStorage.setItem("userId", userId);
};

export const storeToken = (token) => {
  console.log("Storing token:", token);
  localStorage.setItem("token", token);
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Retrieved token from localStorage:", token);
  return token;
};

export const getUserInfo = async () => {
  const token = getToken();
  console.log("Token:", token);

  if (!token) {
    return null;
  }

  try {
    const response = await apiAxios.get(`api/listings/userinfo`);
    // Return the user's information
    return response.data;
  } catch (error) {
    console.error("Error fetching user info from backend:", error);
    return null;
  }
};

export const saveLoggedInUser = (username) => {
  sessionStorage.setItem("authenticatedUser", username);
};

export const isUserLoggedIn = () => {
  const username = sessionStorage.getItem("authenticatedUser");
  return username !== null;
};

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload(false);
};
