import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      console.log('Fetched clients:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }
);

export const fetchClientProjects = createAsyncThunk(
  'clients/fetchClientProjects',
  async (clientName) => {
    try {
      const response = await axios.get(`${API_URL}/clients/${encodeURIComponent(clientName)}/projects`);
      console.log('Fetched projects:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
);

const clientSlice = createSlice({
  name: 'clients',
  initialState: {
    list: [],
    selectedClientProjects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchClientProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClientProjects = action.payload;
      })
      .addCase(fetchClientProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default clientSlice.reducer;