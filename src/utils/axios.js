import axios from "axios";

import { BASE_URL } from "../config";

const axiosInstance = axios.create({ baseURL: BASE_URL });

axios.interceptors.request.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;
