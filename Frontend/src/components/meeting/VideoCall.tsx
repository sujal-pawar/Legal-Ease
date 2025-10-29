import { useState, useEffect, useRef } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-react';

interface VideoCallProps {
  channelName: string;
  token: string;
  uid: number;
  onError?: (error: Error) => void;
}

const client = AgoraRTC.createClient({ 
  mode: 'rtc', 
  codec: 'vp8'
});

export function VideoCall({ channelName, token, uid, onError }: VideoCallProps) {
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [localTracks, setLocalTracks] = useState<[ICameraVideoTrack, IMicrophoneAudioTrack]>();
  const localVideoRef = useRef<HTMLDivElement>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await client.join(
          process.env.VITE_AGORA_APP_ID!,
          channelName,
          token,
          uid
        );
        
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks([videoTrack, audioTrack]);
        
        videoTrack.play(localVideoRef.current!);
        await client.publish([audioTrack, videoTrack]);
        
        setJoined(true);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    init();

    return () => {
      localTracks?.[0].close();
      localTracks?.[1].close();
      client.leave();
    };
  }, [channelName, token, uid]);

  useEffect(() => {
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setUsers(prev => [...prev, user]);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div ref={localVideoRef} className="w-full h-full rounded-lg overflow-hidden bg-black">
        {!joined && (
          <div className="flex items-center justify-center h-full text-white">
            Joining call...
          </div>
        )}
      </div>
      {users.map(user => (
        <div 
          key={user.uid}
          className="w-full h-full rounded-lg overflow-hidden bg-black"
          id={`user-${user.uid}`}
        />
      ))}
    </div>
  );
}
