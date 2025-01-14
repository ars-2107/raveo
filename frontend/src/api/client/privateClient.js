import axios from "axios";
import queryString from "query-string";

const baseURL = process.env.REACT_APP_BASE_URL;

const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

privateClient.interceptors.request.use(async config => {
  const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  };
});

privateClient.interceptors.response.use((response) => {
  if (response && response.data) return response.data;
  return response;
}, (err) => {
    let errorMessage = "Something went wrong. Please try again later.";
    
    if (err.response) {
      if (err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.request) {
      errorMessage = "No response received from the server.";
    } else {
      errorMessage = "An error occurred while making the request.";
    }

    console.error("Error:", err);

    throw new Error(errorMessage);
  }
);

export default privateClient;
