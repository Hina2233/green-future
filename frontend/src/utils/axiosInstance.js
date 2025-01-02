import axios from "axios";

// Create Axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: "https://idea-collection.vercel.app/",
  // baseURL: "http://localhost:4000/",
  withCredentials: true, // Allows sending cookies with requests
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve token from local storage
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to headers
    }
    return config; // Return the updated config
  },
  (error) => {
    console.error("Request error:", error.message); // Log the error
    return Promise.reject(error); // Reject the promise with error
  }
);

// Add a response interceptor (optional, can customize error handling)
axiosInstance.interceptors.response.use(
  (response) => response, // Directly return the response on success
  (error) => {
    console.error("Response error:", error.message); // Log the error
    if (error.response && error.response.status === 401) {
      // Optional: Handle unauthorized errors (e.g., logout user)
      localStorage.removeItem("authToken");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error); // Reject the promise with error
  }
);

export default axiosInstance;
