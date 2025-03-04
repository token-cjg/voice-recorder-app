import { useState, useRef } from 'react';

type RecordingState = 'inactive' | 'recording' | 'paused' | 'stopped';

const useMediaRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('inactive');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
    if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
    }
    };

    mediaRecorderRef.current.onstop = () => {
    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    setAudioBlob(blob);
    audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setRecordingState('recording');
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecordingState('stopped');
    }
  };

  return { recordingState, audioBlob, startRecording, pauseRecording, resumeRecording, stopRecording };
};

export default useMediaRecorder;
