import { create } from 'zustand';
import api from '@/lib/api';

export const useCandidatesStore = create((set, get) => ({
  candidates: [],
  candidate: null,
  loading: false,
  pagination: {
    page: 1,
    per_page: 15,
    total: 0,
  },
  error: null,

  // Fetch all candidates
  fetchCandidates: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { pagination } = get();
      const response = await api.get('/candidates', {
        params: {
          page: pagination.page,
          per_page: pagination.per_page,
          ...params,
        },
      });
      set({
        candidates: response.data.data || [],
        pagination: {
          ...pagination,
          total: response.data.total || 0,
        },
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch candidates',
        loading: false,
      });
      throw error;
    }
  },

  // Fetch single candidate
  fetchCandidate: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/candidates/${id}`);
      set({ candidate: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch candidate',
        loading: false,
      });
      throw error;
    }
  },

  // Create candidate
  createCandidate: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/candidates', data);
      set((state) => ({
        candidates: [response.data, ...state.candidates],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create candidate',
        loading: false,
      });
      throw error;
    }
  },

  // Update candidate
  updateCandidate: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/candidates/${id}`, data);
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === id ? response.data : c
        ),
        candidate: state.candidate?.id === id ? response.data : state.candidate,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update candidate',
        loading: false,
      });
      throw error;
    }
  },

  // Delete candidate
  deleteCandidate: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/candidates/${id}`);
      set((state) => ({
        candidates: state.candidates.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete candidate',
        loading: false,
      });
      throw error;
    }
  },

  // Set pagination
  setPagination: (pagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  // Reset state
  reset: () => {
    set({
      candidates: [],
      candidate: null,
      loading: false,
      error: null,
      pagination: { page: 1, per_page: 15, total: 0 },
    });
  },
}));

