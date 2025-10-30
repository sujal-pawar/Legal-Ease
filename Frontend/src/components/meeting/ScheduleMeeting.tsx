
import ScheduleMeetingForm from './ScheduleMeetingForm';

interface ScheduleMeetingProps {
  onScheduled: (meetingLink: string) => void;
  defaultJudgeEmail?: string;
}

const ScheduleMeeting = ({ 
  onScheduled, 
  defaultJudgeEmail = 'judge1@court.gov' // Default judge from demo data
}: ScheduleMeetingProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl glass glass-dark p-6 animate-scale-in">
      <ScheduleMeetingForm 
        onScheduled={onScheduled} 
        defaultJudgeEmail={defaultJudgeEmail} 
      />
    </div>
  );
};

export default ScheduleMeeting;
