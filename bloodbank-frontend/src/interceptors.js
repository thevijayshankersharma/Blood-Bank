import axios from "axios";
import Cookies from "js-cookie";

export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/"

const useInterceptor = () => {
  const instance = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
    timeout: "10000"
  })

  instance.defaults.headers.common["Content-Type"] = "application/json"
  instance.defaults.headers.common["Accept"] = "application/json"

  instance.interceptors.request.use(
    config => {
      const token = Cookies.get('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    response => {
      return response
    },
    error => {
      console.error('Response error:', error.response?.status, error.response?.data || error.message);
      return Promise.reject(error)
    }
  )
  return instance
}

export default useInterceptor