import axios from 'axios';
import localDb from '../../db.json';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Helper for resilient fetching: attempts API first, falls back to local data if server is offline
async function fetchWithFallback(url, fallbackData) {
  try {
    const res = await api.get(url);
    if (res && res.data && (!Array.isArray(res.data) || res.data.length > 0)) {
      return res.data;
    }
    return fallbackData;
  } catch {
    return fallbackData;
  }
}

// Provinces / Destinations
export const getProvinces = async () => {
  return fetchWithFallback('/provinces', localDb.provinces || []);
};

export const getDestinations = getProvinces;

export const getProvinceBySlug = async (slug) => {
  try {
    const res = await api.get(`/provinces?slug=${slug}`);
    if (res.data && res.data.length > 0) return res.data[0];
  } catch {
    // fallback to local data
  }
  return (localDb.provinces || []).find((p) => p.slug === slug);
};

// Tours
export const getTours = async () => {
  return fetchWithFallback('/tours', localDb.tours || []);
};

// Services
export const getServices = async () => {
  return fetchWithFallback('/services', localDb.services || []);
};

// Blog
export const getBlogPosts = async () => {
  return fetchWithFallback('/blogPosts', localDb.blogPosts || []);
};

// Testimonials
export const getTestimonials = async () => {
  return fetchWithFallback('/testimonials', localDb.testimonials || []);
};

// Master Requests
export const createMasterRequest = async (data) => {
  try {
    const res = await api.post('/masterRequests', data);
    return res.data;
  } catch (error) {
    console.warn('API offline or error, logging master request locally:', data, error);
    return { success: true, localOnly: true, data };
  }
};

// Contact Messages
export const createContactMessage = async (data) => {
  try {
    const res = await api.post('/contactMessages', data);
    return res.data;
  } catch (error) {
    console.warn('API offline or error, logging contact message locally:', data, error);
    return { success: true, localOnly: true, data };
  }
};

export default api;
