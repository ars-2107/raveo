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
  throw err.response.data;
});

export default privateClient;
