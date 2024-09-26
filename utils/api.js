// utils/api.js

import axios from 'axios';

// Base URL for your API (can be environment-specific)
const BASE_URL = process.env.NEXT_PUBLIC_VIDEO_API_BASE_URL;
const apiClient = axios.create({
  baseURL: BASE_URL,
});
// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add authorization token to headers if needed
    const token = localStorage.getItem('token'); // Example: getting token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
/**
 * Fetch data from an API endpoint with optional query parameters.
 * @param {string} endpoint - The API endpoint to call (e.g., 'users').
 * @param {Object} [params={}] - Optional query parameters to include in the request.
 * @returns {Promise<Object>} - The response data.
 */

/**
 * Post data to an API endpoint.
 * @param {string} endpoint - The API endpoint to call (e.g., 'users').
 * @param {Object} data - The data to send in the request body.
 * @returns {Promise<Object>} - The response data.
 */
// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally here (optional)
    return Promise.reject(error);
  }
);
// Example: Fetch data from an endpoint
export const fetchData = async (endpoint, params) => {
  try {
    let response
    if (params) {
      response = await apiClient.get(`${BASE_URL}/${endpoint}`, {
        params: { ...params },
      });
    } else {
      response = await apiClient.get(`${BASE_URL}/${endpoint}`);
    }
    console.log(response.data, endpoint, "pershant")
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Example: Post data to an endpoint
export const postData = async (endpoint, data) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};


/**
 * Update data at an API endpoint.
 * @param {string} endpoint - The API endpoint to call (e.g., 'users/:id').
 * @param {Object} data - The data to send in the request body.
 * @returns {Promise<Object>} - The response data.
 */
export const putData = async (endpoint, data) => {
  try {
    const response = await apiClient.put(`${BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

/**
 * Delete data at an API endpoint.
 * @param {string} endpoint - The API endpoint to call (e.g., 'users/:id').
 * @returns {Promise<Object>} - The response data.
 */
export const deleteData = async (endpoint, params) => {
  try {
    let response
    if (params) {
      response = await apiClient.delete(`${BASE_URL}/${endpoint}`, {
        params: { ...params },
      });
    } else (
      response = await apiClient.delete(`${BASE_URL}/${endpoint}`)
    )
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};