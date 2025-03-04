import React, { useState, useEffect, FC } from 'react';
import useMediaRecorder from '../hooks/useMediaRecorder';

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

  // Optional: Implement a function to handle conversion
  const convertVoiceToText = async (blob: Blob): Promise<void> => {
    // Example: using Web Speech API or sending blob to a third-party API
    // Set transcript state once conversion is done
    setTranscript("Voice-to-text result goes here");
  };

  // Example effect to trigger conversion after stopping recording
  useEffect(() => {
    if (recordingState === 'stopped' && audioBlob) {
      convertVoiceToText(audioBlob);
    }
  }, [recordingState, audioBlob]);

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
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default VoiceRecorder;
