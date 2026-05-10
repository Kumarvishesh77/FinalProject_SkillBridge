import api from "../../../services/api";

const API_URL = '/api/assessment';

export const startAssessment = async (data) => {
  const response = await api.post(`${API_URL}/start`, data);
  return response.data;
};

export const submitBatch = async (data) => {
  const response = await api.post(`${API_URL}/submit-batch`, data);
  return response.data;
};

export const finishAssessment = async (data) => {
  const response = await api.post(`${API_URL}/finish`, data);
  return response.data;
};

export const getResult = async (id) => {
  const response = await api.get(`${API_URL}/result/${id}`);
  return response.data;
};

export const getHistory = async (userId) => {
  const response = await api.get(`${API_URL}/history/${userId}`);
  return response.data;
};
