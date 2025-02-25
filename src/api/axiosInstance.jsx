import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://test-bjakapi.liara.run",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
