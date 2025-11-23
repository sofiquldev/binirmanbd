import { create } from 'zustand';
import api from '@/lib/api';

export const useDashboardStore = create((set) => ({
  metrics: null,
  trends: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/dashboard');
      set({
        metrics: response.data.metrics || null,
        trends: response.data.trends || null,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch dashboard',
        loading: false,
      });
      throw error;
    }
  },

  reset: () => {
    set({
      metrics: null,
      trends: null,
      loading: false,
      error: null,
    });
  },
}));

