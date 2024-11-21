 
import api from './api';

export const clientService = {
  getAllClients: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  getClientProjects: async (clientName) => {
    const response = await api.get(`/clients/${encodeURIComponent(clientName)}/projects`);
    return response.data;
  }
};
