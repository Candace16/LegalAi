import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const summarizeDocument = async (docId) => {
  const response = await apiClient.post(`/summarize/${docId}`);
  return response.data;
};

export const translateDocument = async (docId, targetLanguage) => {
  const response = await apiClient.post(`/translate/${docId}`, {
    target_language: targetLanguage,
  });
  return response.data;
};

export const askQuestion = async (docId, question) => {
  const response = await apiClient.post(`/ask/${docId}`, {
    question,
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await apiClient.get('/history/');
  return response.data;
};
