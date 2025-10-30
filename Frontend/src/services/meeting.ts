import { api } from './api';

interface MeetingTokenResponse {
  token: string;
  channel: string;
  appId: string;
  uid: string;
}

export const meetingService = {
  generateToken: async (meetingLink: string): Promise<MeetingTokenResponse> => {
    const response = await api.post<MeetingTokenResponse>('/meeting/token', { meetingLink });
    return response.data;
  },

  scheduleMeeting: async (meetingData: {
    title: string;
    caseNumber: string;
    date: string;
    time: string;
    participants: {
      judgeEmail: string;
      lawyer1Email: string;
      lawyer2Email: string;
      litigant1Email: string;
      litigant2Email: string;
    };
  }) => {
    const response = await api.post('/meeting/schedule', meetingData);
    return response.data;
  },

  getMeetingDetails: async (meetingId: string) => {
    const response = await api.get(`/meeting/${meetingId}`);
    return response.data;
  }
};
