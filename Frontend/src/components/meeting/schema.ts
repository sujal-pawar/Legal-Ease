import * as z from 'zod';

export const meetingFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  caseNumber: z.string().min(1, 'Case number is required'),
  date: z.date({
    required_error: 'Meeting date is required',
  }),
  time: z.string().min(1, 'Meeting time is required'),
  duration: z.string().min(1, 'Duration is required'),
  judgeEmail: z.string().email('Invalid judge email'),
  lawyer1Email: z.string().email('Invalid lawyer email'),
  lawyer2Email: z.string().email('Invalid lawyer email'),
  litigant1Email: z.string().email('Invalid litigant email'),
  litigant2Email: z.string().email('Invalid litigant email'),
});

export type MeetingFormValues = z.infer<typeof meetingFormSchema>;

export interface ScheduledMeeting {
  id: string;
  meetingLink: string;
  scheduledAt: string;
  startTime: string;
  duration: string;
  participants: {
    judge: string;
    lawyers: string[];
    litigants: string[];
  };
  caseNumber: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}
