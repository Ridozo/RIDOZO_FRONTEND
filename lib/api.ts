import axios from "axios";
import { store } from "../redux/store";
import { setTokens, logout } from "../redux/globalSlice";
import { Toast } from "./toastService";

// Read environment variables from Vite
const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

if (!API_URL) throw new Error("VITE_API_URL is not defined in .env");
if (!IMAGE_URL) throw new Error("VITE_IMAGE_URL is not defined in .env");

// Create Axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

//  Request Interceptor — add Authorization header automatically
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — handle token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

  if(error.response?.status === 403)
  {
      Toast.error("You are not authorized to access this");
  }

    // If token expired and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token found");

        // Request new tokens
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Save new tokens in Redux + localStorage
        store.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        store.dispatch(logout());
        window.location.href = "/"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Utility to get full image URL
export const getImageUrl = (path: string) => `${IMAGE_URL}/${path}`;
