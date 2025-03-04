import { useState, useEffect, FC } from 'react';
import useMediaRecorder from '../hooks/useMediaRecorder';

const ASSEMBLYAI_API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY as string;

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

  const convertVoiceToText = async (blob: Blob): Promise<void> => {
    console.log('Converting voice to text...');
    console.log('Blob:', blob);
    console.log('API key:', ASSEMBLYAI_API_KEY);
    try {
      // Step 1: Upload the blob to AssemblyAI's upload endpoint
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
        },
        body: blob,
      });
      const uploadData = await uploadResponse.json();
      const audioUrl = uploadData.upload_url;
  
      // Step 2: Start a transcription job using the uploaded audio URL
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ audio_url: audioUrl }),
      });
      const transcriptData = await transcriptResponse.json();
      const transcriptId = transcriptData.id;
  
      // Step 3: Poll for the transcription result
      let transcriptText = '';
      let status = transcriptData.status;
      while (status !== 'completed') {
        // Wait a few seconds before polling again
        await new Promise((resolve) => setTimeout(resolve, 3000));
  
        const pollingResponse = await fetch(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: { authorization: ASSEMBLYAI_API_KEY },
          }
        );
        const pollingData = await pollingResponse.json();
        status = pollingData.status;
  
        if (status === 'completed') {
          transcriptText = pollingData.text;
        } else if (status === 'error') {
          console.error('Transcription error:', pollingData.error);
          break;
        }
      }
      setTranscript(transcriptText);
    } catch (error) {
      console.error('Error converting voice to text:', error);
    }
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
