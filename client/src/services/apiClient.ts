import axios, { type AxiosInstance } from "axios";

import globalConfig from "@/config/globalConfig";

export const apiClient: AxiosInstance = axios.create({
  baseURL: globalConfig.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
