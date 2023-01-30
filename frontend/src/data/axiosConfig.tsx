// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const api = axios.create({
    // .. where we make our configurations
    baseURL: 'http://127.0.0.1:8000/'
});

// Where you would set stuff like your 'Authorization' header, etc ...
//api.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';
api.defaults.headers.post['Content-Type'] = 'application/json';

// Also add/ configure interceptors && all the other cool stuff
axios.interceptors.request.use(request => {
    console.log(request);
    // Edit request config
    return request;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    console.log(response);
    // Edit response config
    return response;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

export default api;