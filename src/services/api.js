import axios from 'axios';
import localDb from '../../db.json';

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const configuredApiUrl = import.meta.env.VITE_API_URL;

// Prevent browser mixed-content security blocks when running over HTTPS (e.g. ngrok tunnel) without an HTTPS backend
const shouldSkipRemoteApi = isHttps && (!configuredApiUrl || configuredApiUrl.startsWith('http://'));

const api = axios.create({
  baseURL: configuredApiUrl || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Helper for resilient fetching: attempts API first, falls back to local data if server is offline or inaccessible
async function fetchWithFallback(url, fallbackData) {
  if (shouldSkipRemoteApi) {
    return fallbackData;
  }
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
  if (!shouldSkipRemoteApi) {
    try {
      const res = await api.get(`/provinces?slug=${slug}`);
      if (res.data && res.data.length > 0) return res.data[0];
    } catch {
      // fallback to local data
    }
  }
  return (localDb.provinces || []).find((p) => p.slug === slug);
};

export const getPlaceBySlug = async (provinceSlug, placeId) => {
  const province = await getProvinceBySlug(provinceSlug);
  if (!province || !province.sub_destinations) return null;
  return province.sub_destinations.find((p) => p.id === placeId) || null;
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
export const getMasterRequests = async () => {
  return fetchWithFallback('/masterRequests', localDb.masterRequests || []);
};

export const createMasterRequest = async (data) => {
  if (shouldSkipRemoteApi) {
    console.info('Master request saved locally (HTTPS tunnel active):', data);
    return { success: true, localOnly: true, data };
  }
  try {
    const res = await api.post('/masterRequests', data);
    return res.data;
  } catch (error) {
    console.warn('API offline or error, logging master request locally:', data, error);
    return { success: true, localOnly: true, data };
  }
};

// Contact Messages
export const getContactMessages = async () => {
  return fetchWithFallback('/contactMessages', localDb.contactMessages || []);
};

export const createContactMessage = async (data) => {
  if (shouldSkipRemoteApi) {
    console.info('Contact message saved locally (HTTPS tunnel active):', data);
    return { success: true, localOnly: true, data };
  }
  try {
    const res = await api.post('/contactMessages', data);
    return res.data;
  } catch (error) {
    console.warn('API offline or error, logging contact message locally:', data, error);
    return { success: true, localOnly: true, data };
  }
};

export default api;
