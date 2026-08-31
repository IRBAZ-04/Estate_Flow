import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30s timeout
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unified Security & Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred while communicating with the server.';
    const status = error.response?.status;

    if (!error.response) {
      message = 'Network error: Unable to connect to server. Please check your internet connection.';
    } else if (status === 401) {
      message = error.response.data?.message || 'Session expired or invalid token. Please log in again.';
      // Clean up expired credentials from localStorage
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Dispatch custom event so AuthContext can handle logout without hard refresh
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    } else if (status === 403) {
      message = error.response.data?.message || 'Access Forbidden: You do not have permission for this resource.';
    } else if (status === 404) {
      message = error.response.data?.message || 'Requested resource was not found on the server.';
    } else if (status === 429) {
      message = error.response.data?.message || 'Too many requests. Please wait a few moments before retrying.';
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    }

    const customError = {
      message,
      status: status || 500,
      data: error.response?.data || null,
    };

    return Promise.reject(customError);
  }
);

export default api;
