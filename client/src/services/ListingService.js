// Going to use this file to store methods that are going to send api requests to backend for
// basic operations on the website. For example uploading a book.

import axios from "Axios";
import { getToken } from "./AuthService.js";


const BASE_REST_API_URL = 'http://localhost:8080';


axios.interceptors.request.use(
    function (config) {

        const token = getToken();

        if (token) {
            // Set Authorization header to 'Bearer ' + token
            config.headers["Authorization"] = 'Bearer ' + token;

        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


// Function to get all listings
export function getAllListings() {
    return axios.get(`${BASE_REST_API_URL}/api/listings`);
}

// Function to add a new listing - listing object is where the JSON is held
export function addListing(listing) {
    return axios.post(`${BASE_REST_API_URL}/api/listings`, listing);
}

// Function to get a listing by ID
export function getListingById(id) {
    return axios.get(`${BASE_REST_API_URL}/api/listings/${id}`);
}

// Function to update a listing
export function updateListing(id, listing) {
    return axios.put(`${BASE_REST_API_URL}/api/listings/${id}`, listing);
}

// Function to delete a listing
export function deleteListing(id) {
    return axios.delete(`${BASE_REST_API_URL}/api/listings/${id}`);
}
