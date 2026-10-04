import axios from 'axios';
import localDb from '../../db.json';

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const configuredApiUrl = import.meta.env.VITE_API_URL;

// Prevent browser mixed-content security blocks when running over HTTPS (e.g. ngrok tunnel) without an HTTPS backend
const shouldSkipRemoteApi = isHttps && (!configuredApiUrl || configuredApiUrl.startsWith('http://'));

const api = axios.create({
  baseURL: configuredApiUrl || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
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

// Contact Messages (ذخیره پویا در دیتابیس MySQL از طریق بک‌ند Node.js)
export const getContactMessages = async () => {
  try {
    const res = await api.get('/api/contact');
    if (res && res.data && Array.isArray(res.data)) {
      return res.data;
    }
    return localDb.contactMessages || [];
  } catch (error) {
    console.warn('Could not fetch contact messages from backend, using local fallback:', error);
    return localDb.contactMessages || [];
  }
};

export const createContactMessage = async (data) => {
  try {
    const res = await api.post('/api/contact', data);
    return res.data;
  } catch (error) {
    console.error('Failed to submit contact message to MySQL backend:', error);
    throw error;
  }
};

export const updateMessageStatus = async (id, status) => {
  try {
    const res = await api.patch(`/api/contact/${id}/status`, { status });
    return res.data;
  } catch (error) {
    console.error('Failed to update message status:', error);
    throw error;
  }
};

export const deleteContactMessage = async (id) => {
  try {
    const res = await api.delete(`/api/contact/${id}`);
    return res.data;
  } catch (error) {
    console.error('Failed to delete contact message:', error);
    throw error;
  }
};

// Company / Contact Info Settings
export const getSettings = async () => {
  const fallback = {
    email: 'info@amovitravel.com',
    phone: '+93 70 633 8223',
    address: 'چهارراهی انصاری، شهرنو، کابل، افغانستان',
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Char+Rahi+Ansari+Shahr-e+Naw+Kabul+Afghanistan'
  };
  try {
    const res = await api.get('/api/settings');
    if (res && res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
    return fallback;
  } catch (error) {
    console.warn('Could not fetch settings from backend, using fallback:', error);
    return fallback;
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const res = await api.post('/api/settings', settingsData);
    return res.data;
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
};

// Gallery Items
export const getGalleryItems = async () => {
  try {
    const res = await api.get('/api/gallery');
    if (res && res.data && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.warn('Could not fetch dynamic gallery items, using local fallback:', error);
    return [];
  }
};

export const uploadGalleryItem = async (formData) => {
  try {
    const res = await api.post('/api/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    console.error('Failed to upload gallery item:', error);
    throw error;
  }
};

export const deleteGalleryItem = async (id) => {
  try {
    const res = await api.delete(`/api/gallery/${id}`);
    return res.data;
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    throw error;
  }
};

export default api;
