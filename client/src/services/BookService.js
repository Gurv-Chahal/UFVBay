// Going to use this file to store methods that are going to send api requests to backend for
// basic operations on the website. For example uploading a book.

import axios from "axios";
import {getToken} from "./AuthService.js";



// adding an axios interceptor
axios.interceptors.request.use(function (config) {

    // get the token from local storage. If the browser is being reopened you will automatically be logged in
    config.headers['Authorization'] = getToken();

    return config;
}, function (error) {
    return Promise.reject(error);
})