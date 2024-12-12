// utils/api.js

import axios from 'axios';

// Base URL for your API (can be environment-specific)
const BASE_URL = process.env.NEXT_PUBLIC_VIDEO_API_BASE_URL;
const AUTH_URL = process.env.NEXT_PUBLIC_VIDEO_API_AUTH_URL;
const HIRELLO_URL = process.env.NEXT_PUBLIC_VIDEO_API_HIRELLO_URL;
const CSV_URL = process.env.NEXT_PUBLIC_VIDEO_API_CSV_URL;
const SHARE_DEV = process.env.NEXT_PUBLIC_VIDEO_API_SHARE_DEV;


const apiClient = axios.create();
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

const findBaseUrl=(type)=>{
  switch(type){
    case "hirello":
      return HIRELLO_URL;
    case "csv":
      return CSV_URL
      case "share_dev":
        return SHARE_DEV
    default:
      return AUTH_URL
  }
}
export const fetchData = async (endpoint, params,type) => {
  try {
    let response
    let baseUrl = findBaseUrl(type);
    if (params) {
      response = await apiClient.get(`${baseUrl}/${endpoint}`, {
        params: { ...params },
      });
    } else {
      response = await apiClient.get(`${baseUrl}/${endpoint}`);
    }
 
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Example: Post data to an endpoint
export const postData = async (endpoint, data,type) => {
  try {
    let baseUrl = findBaseUrl(type);
    const response = await apiClient.post(`${baseUrl}/${endpoint}`, data);
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
export const putData = async (endpoint, data,type) => {
  try {
    let baseUrl = findBaseUrl(type);
    const response = await apiClient.put(`${baseUrl}/${endpoint}`, data);
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
export const deleteData = async (endpoint, params,type) => {
  try {
    let response
    let baseUrl = findBaseUrl(type);
    if (params) {
      response = await apiClient.delete(`${baseUrl}/${endpoint}`, {
        params: { ...params },
      });
    } else (
      response = await apiClient.delete(`${baseUrl}/${endpoint}`)
    )
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};