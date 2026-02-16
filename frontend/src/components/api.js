import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // change if deployed
});

export default api;