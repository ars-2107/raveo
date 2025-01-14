import axios from "axios";
import queryString from "query-string";

const baseURL = process.env.REACT_APP_BASE_URL;

const publicClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

publicClient.interceptors.request.use(async config => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json"
    }
  };
});

publicClient.interceptors.response.use((response) => {
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


export default publicClient;
