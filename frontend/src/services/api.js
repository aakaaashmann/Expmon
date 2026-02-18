import axios from "axios";

const api = axios.create({
  baseURL: "https://expmon-backend.onrender.com",

});

export default api;
