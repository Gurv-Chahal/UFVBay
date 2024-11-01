import axios from 'axios';

export const loginAPICall = (usernameOrEmail, password) => {
    return axios.post('http://localhost:8080/auth/login', { usernameOrEmail, password });
};

export const registerAPICall = (userData) => {
    return axios.post('http://localhost:8080/auth/register', userData);
};
