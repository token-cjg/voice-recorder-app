import { useState, useEffect, FC } from 'react';
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

  const convertVoiceToText = (blob: Blob): void => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
  
    fetch('https://api.your-speech-to-text-provider.com/recognize', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          console.error(`Request failed with status ${response.status}`);
          return;
        }
        return response.json();
      })
      .then(data => data && setTranscript(data.transcript))
      .catch(error => console.error("Error converting voice to text:", error));
  };
  

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
