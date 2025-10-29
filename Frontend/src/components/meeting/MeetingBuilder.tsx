import { useState } from 'react';
// import Layoxut from '@/components/Layout';
import ScheduleMeeting from './ScheduleMeeting';
import MeetingLink from './MeetingLink';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { VideoCall } from './VideoCall';
import { toast } from 'sonner';

const MeetingBuilder = () => {
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [token, setToken] = useState('');
  const [channel, setChannel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleMeetingScheduled = async (link: string) => {
    setMeetingLink(link);
    
    // Scroll to meeting link after a short delay
    setTimeout(() => {
      document.getElementById('meeting-link-section')?.scrollIntoView({ 
        behavior: 'smooth'
      });
    }, 100);

    try {
      // Call your backend to generate a token and channel name
      const response = await fetch('/api/meeting/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ meetingLink: link })
      });

      if (!response.ok) {
        throw new Error('Failed to generate meeting token');
      }

      const data = await response.json();
      setToken(data.token);
      setChannel(data.channel);
      setIsCallActive(true);
    } catch (error) {
      toast.error('Failed to start meeting');
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleVideoError = (error: Error) => {
    toast.error(`Video call error: ${error.message}`);
    setError(error.message);
  };

  return (<div>
      <div className="max-w-4xl mt-20 mx-auto">
          <Navbar/>
       

        <section className="mb-16">
          {isCallActive && token && channel ? (
            <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
              <VideoCall
                channelName={channel}
                token={token}
                uid={Math.floor(Math.random() * 1000000)}
                onError={handleVideoError}
              />
            </div>
          ) : (
            <ScheduleMeeting onScheduled={handleMeetingScheduled} />
          )}
        </section>

        {meetingLink && (
          <section id="meeting-link-section" className="mb-16 animate-fade-in">
            <MeetingLink meetingLink={meetingLink} />
          </section>
        )}

        <section className="glass glass-dark rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Benefits of Virtual Court</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-primary"
                >
                  <path 
                    d="M15.5 12.5L11 16.5L8.5 14M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Increased Efficiency</h3>
              <p className="text-muted-foreground">
                Reduce travel time and expenses for all court participants.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-primary"
                >
                  <path 
                    d="M8 9.5H15M8 13.5H13M18 18.5H21M18 18.5V15.5M18 18.5L13.5 14M3 14.0298C3 15.2215 3 15.8173 3.30335 16.2521C3.45464 16.4615 3.64482 16.6398 3.86478 16.7825C4.31334 17.0638 4.92334 17.0362 6.14334 16.9811C6.68903 16.9546 6.96188 16.9414 7.09405 16.7355C7.09788 16.7288 7.10157 16.722 7.10512 16.7151C7.23132 16.5077 7.16222 16.2432 7.02402 15.7142C6.57902 14.1611 6.35652 13.3845 6.56804 12.7706C6.71087 12.3574 6.95032 11.9941 7.26231 11.7145C7.77023 11.261 8.57139 11.1044 10.1737 10.7911L14.4203 10M7.5 6C7.5 7.38071 6.38071 8.5 5 8.5C3.61929 8.5 2.5 7.38071 2.5 6C2.5 4.61929 3.61929 3.5 5 3.5C6.38071 3.5 7.5 4.61929 7.5 6ZM21.5 8.5C21.5 9.88071 20.3807 11 19 11C17.6193 11 16.5 9.88071 16.5 8.5C16.5 7.11929 17.6193 6 19 6C20.3807 6 21.5 7.11929 21.5 8.5Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Better Accessibility</h3>
              <p className="text-muted-foreground">
                Enable participants to join from any location, increasing access to justice.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-primary"
                >
                  <path 
                    d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5 19.5 16 16 16 12C16 8 14.5 4.5 12 2M12 22C9.5 19.5 8 16 8 12C8 8 9.5 4.5 12 2M2 12C2 6.47715 6.47715 2 12 2" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Reduced Delays</h3>
              <p className="text-muted-foreground">
                Minimize postponements and reschedules with flexible virtual options.
              </p>
            </div>
          </div>
        </section>
      </div>
        <Footer/>
      </div>
  );
};

export default MeetingBuilder;
