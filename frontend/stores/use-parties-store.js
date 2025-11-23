import { create } from 'zustand';
import api from '@/lib/api';

export const usePartiesStore = create((set, get) => ({
  parties: [],
  party: null,
  loading: false,
  pagination: {
    page: 1,
    per_page: 15,
    total: 0,
  },
  error: null,

  fetchParties: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { pagination } = get();
      const response = await api.get('/parties', {
        params: {
          page: pagination.page,
          per_page: pagination.per_page,
          ...params,
        },
      });
      set({
        parties: response.data.data || [],
        pagination: {
          ...pagination,
          total: response.data.total || 0,
        },
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch parties',
        loading: false,
      });
      throw error;
    }
  },

  fetchParty: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/parties/${id}`);
      set({ party: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch party',
        loading: false,
      });
      throw error;
    }
  },

  createParty: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/parties', data);
      set((state) => ({
        parties: [response.data, ...state.parties],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create party',
        loading: false,
      });
      throw error;
    }
  },

  updateParty: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/parties/${id}`, data);
      set((state) => ({
        parties: state.parties.map((p) =>
          p.id === id ? response.data : p
        ),
        party: state.party?.id === id ? response.data : state.party,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update party',
        loading: false,
      });
      throw error;
    }
  },

  deleteParty: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/parties/${id}`);
      set((state) => ({
        parties: state.parties.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete party',
        loading: false,
      });
      throw error;
    }
  },

  setPagination: (pagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  reset: () => {
    set({
      parties: [],
      party: null,
      loading: false,
      error: null,
      pagination: { page: 1, per_page: 15, total: 0 },
    });
  },
}));

