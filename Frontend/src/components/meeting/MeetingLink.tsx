
import { useState } from 'react';
import { Copy, Check, Link, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface MeetingLinkProps {
  meetingLink: string;
  className?: string;
}

const MeetingLink = ({ meetingLink, className }: MeetingLinkProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      toast.success('Meeting link copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const sendInvites = () => {
    toast.success('Invitations sent to all participants');
  };

  return (
    <div className={cn(
      "glass glass-dark p-6 rounded-xl animate-scale-in max-w-2xl mx-auto",
      className
    )}>
      <div className="flex items-center justify-center mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Link className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-center mb-1">Court Meeting Scheduled</h3>
      <p className="text-center text-muted-foreground mb-6">Meeting details have been created successfully</p>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium">Date</span>
          </div>
          <span className="text-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium">Time</span>
          </div>
          <span className="text-sm">10:00 AM - 11:00 AM</span>
        </div>
      </div>
      
      <div className="flex items-center bg-background/50 border border-border/50 rounded-lg p-1 mb-6">
        <div className="flex-1 px-3 py-2 truncate text-sm">
          {meetingLink}
        </div>
        <button 
          onClick={copyToClipboard}
          className={cn(
            "flex items-center justify-center p-2 rounded-md transition-colors",
            copied ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
          )}
          aria-label="Copy meeting link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          className="flex-1" 
          variant="outline"
          onClick={sendInvites}
        >
          Send Invitations
        </Button>
        <Button 
          className="flex-1" 
          onClick={() => toast.success('🎥 Video call is now active! Camera feed should appear at the top of this page.')}
        >
          Check Video Status
        </Button>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          All participants will receive an email with meeting details.<br/>
          The video call is now running above this section.
        </p>
      </div>
    </div>
  );
};

export default MeetingLink;