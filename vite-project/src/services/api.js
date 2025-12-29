import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth API
export const authAPI = {
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_URL}/auth/login`, data),
  getProfile: () => axios.get(`${API_URL}/auth/profile`),
  forgotPassword: (data) => axios.post(`${API_URL}/auth/forgot-password`, data),  // NEW
  resetPassword: (data) => axios.post(`${API_URL}/auth/reset-password`, data)     // NEW
};

// Donation API
export const donationAPI = {
  create: (data) => axios.post(`${API_URL}/donations`, data),
  getUserDonations: () => axios.get(`${API_URL}/donations/my-donations`),
  getAllDonations: () => axios.get(`${API_URL}/donations`),
  updateStatus: (id, status) => axios.put(`${API_URL}/donations/${id}/status`, { status }),
  getStats: () => axios.get(`${API_URL}/donations/stats`)
};

// Campaign API
export const campaignAPI = {
  getAll: () => axios.get(`${API_URL}/campaigns`),
  getAllAdmin: () => axios.get(`${API_URL}/campaigns/all`),
  getById: (id) => axios.get(`${API_URL}/campaigns/${id}`),
  create: (data) => axios.post(`${API_URL}/campaigns`, data),
  update: (id, data) => axios.put(`${API_URL}/campaigns/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/campaigns/${id}`)
};

export default { authAPI, donationAPI, campaignAPI };