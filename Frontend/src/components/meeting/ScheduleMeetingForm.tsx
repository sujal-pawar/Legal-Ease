import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { useState } from 'react';
import MeetingDetails from './MeetingDetails';
import DateTimeSelection from './DateTimeSelection';
import ParticipantsSection from './ParticipantsSection';
import HelpDialog from './HelpDialogue';
import { meetingFormSchema, MeetingFormValues } from './schema';
import { meetingService } from '@/services/meeting';
import { useQueryClient } from '@tanstack/react-query';

interface ScheduleMeetingFormProps {
  onScheduled: (meetingLink: string) => void;
  defaultJudgeEmail: string;
}

const ScheduleMeetingForm = ({ 
  onScheduled, 
  defaultJudgeEmail 
}: ScheduleMeetingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: '',
      caseNumber: '',
      time: '',
      judgeEmail: defaultJudgeEmail,
      lawyer1Email: '',
      lawyer2Email: '',
      litigant1Email: '',
      litigant2Email: '',
    },
  });

  async function onSubmit(data: MeetingFormValues) {
    setIsSubmitting(true);
    try {
      const result = await meetingService.scheduleMeeting({
        title: data.title,
        caseNumber: data.caseNumber,
        date: data.date.toISOString(),
        time: data.time,
        participants: {
          judgeEmail: data.judgeEmail,
          lawyer1Email: data.lawyer1Email,
          lawyer2Email: data.lawyer2Email,
          litigant1Email: data.litigant1Email,
          litigant2Email: data.litigant2Email,
        }
      });

      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      
      toast.success('Meeting scheduled successfully');
      onScheduled(result.meetingLink);
    } catch (error) {
      toast.error('Failed to schedule meeting');
      console.error('Meeting scheduling error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-center flex-1">Schedule a Court Meeting</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowHelp(true)}
          aria-label="Help"
        >
          <span className="h-5 w-5 text-muted-foreground">?</span>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <MeetingDetails control={form.control} />
          <DateTimeSelection control={form.control} />
          <ParticipantsSection control={form.control} defaultJudgeEmail={defaultJudgeEmail} />
          
          <Button 
            type="submit" 
            className="w-full transition-all hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Court Meeting'}
          </Button>
        </form>
      </Form>
      
      <HelpDialog open={showHelp} onOpenChange={setShowHelp} />
    </>
  );
};

export default ScheduleMeetingForm;
