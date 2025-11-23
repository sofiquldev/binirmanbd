import { create } from 'zustand';
import api from '@/lib/api';

export const useConstituenciesStore = create((set, get) => ({
  constituencies: [],
  constituency: null,
  loading: false,
  pagination: {
    page: 1,
    per_page: 15,
    total: 0,
  },
  error: null,

  fetchConstituencies: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { pagination } = get();
      const response = await api.get('/constituencies', {
        params: {
          page: pagination.page,
          per_page: pagination.per_page,
          ...params,
        },
      });
      set({
        constituencies: response.data.data || [],
        pagination: {
          ...pagination,
          total: response.data.total || 0,
        },
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch constituencies',
        loading: false,
      });
      throw error;
    }
  },

  fetchConstituency: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/constituencies/${id}`);
      set({ constituency: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch constituency',
        loading: false,
      });
      throw error;
    }
  },

  createConstituency: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/constituencies', data);
      set((state) => ({
        constituencies: [response.data, ...state.constituencies],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create constituency',
        loading: false,
      });
      throw error;
    }
  },

  updateConstituency: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/constituencies/${id}`, data);
      set((state) => ({
        constituencies: state.constituencies.map((c) =>
          c.id === id ? response.data : c
        ),
        constituency: state.constituency?.id === id ? response.data : state.constituency,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update constituency',
        loading: false,
      });
      throw error;
    }
  },

  deleteConstituency: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/constituencies/${id}`);
      set((state) => ({
        constituencies: state.constituencies.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete constituency',
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
      constituencies: [],
      constituency: null,
      loading: false,
      error: null,
      pagination: { page: 1, per_page: 15, total: 0 },
    });
  },
}));

