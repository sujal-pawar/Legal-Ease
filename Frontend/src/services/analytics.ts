import { api } from './api';

export interface AnalyticsData {
  casesCount: {
    total: number;
    active: number;
    resolved: number;
    pending: number;
  };
  casesByType: {
    type: string;
    count: number;
  }[];
  resolutionTime: {
    average: number;
    byType: {
      type: string;
      days: number;
    }[];
  };
  courtPerformance: {
    court: string;
    disposalRate: number;
    pendingCases: number;
  }[];
  userActivity: {
    timestamp: string;
    action: string;
    user: string;
    details: string;
  }[];
}

export const analytics = {
  getDashboardStats: async () => {
    const response = await api.get<AnalyticsData>('/api/analytics/dashboard');
    return response.data;
  },
  
  getCourtPerformance: async (period: string) => {
    const response = await api.get<AnalyticsData['courtPerformance']>(`/api/analytics/court-performance?period=${period}`);
    return response.data;
  },
  
  getCaseResolutionTrends: async (startDate: string, endDate: string) => {
    const response = await api.get<{
      dates: string[];
      resolved: number[];
      new: number[];
    }>(`/api/analytics/case-trends?start=${startDate}&end=${endDate}`);
    return response.data;
  }
};
