import { useState, useEffect, FC } from 'react';
import useMediaRecorder from '../hooks/useMediaRecorder';
import { useTranscriptionFlow } from '../hooks/useTranscriptionFlow';

const VoiceRecorder: FC = () => {
  const { 
    recordingState, 
    startRecording, 
    pauseRecording, 
    resumeRecording, 
    stopRecording, 
    audioBlob 
  } = useMediaRecorder();

  const [transcript, setTranscript] = useState<string>('');
  // Flag to ensure transcription is triggered only once per recording session
  const [hasTranscribed, setHasTranscribed] = useState<boolean>(false);

  const { transcribeAudio, transcriptionData, isTranscribing, error } = useTranscriptionFlow();

  useEffect(() => {
    if (recordingState === 'stopped' && audioBlob && !hasTranscribed) {
      transcribeAudio(audioBlob);
      setHasTranscribed(true);
    }
  }, [recordingState, audioBlob, transcribeAudio, hasTranscribed]);

  useEffect(() => {
    if (transcriptionData && transcriptionData.status === 'completed') {
      setTranscript(transcriptionData.text);
    }
  }, [transcriptionData]);

  return (
    <div className="voice-recorder">
      <h2>Voice Recorder</h2>
      <div className="controls">
        {recordingState !== 'recording' && <button onClick={startRecording}>Record</button>}
        {recordingState === 'recording' && <button onClick={pauseRecording}>Pause</button>}
        {recordingState === 'paused' && <button onClick={resumeRecording}>Resume</button>}
        {(recordingState === 'recording' || recordingState === 'paused') && <button onClick={stopRecording}>Stop</button>}
      </div>
      <div className="transcript">
        <h3>Transcript:</h3>
        {isTranscribing ? <p>Transcribing...</p> : <p>{transcript}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.toString()}</p>}
      </div>
    </div>
  );
};

export default VoiceRecorder;
