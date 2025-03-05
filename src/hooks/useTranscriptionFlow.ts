import { useState } from 'react';
import { useUploadAudio } from './transcribe/useUploadAudio';
import { useStartTranscription } from './transcribe/useStartTranscription';
import { usePollTranscription } from './transcribe/usePollTranscription';

const useTranscriptionFlow = () => {
    const [transcriptId, setTranscriptId] = useState<string | null>(null);
  
    const { mutateAsync: uploadAudio } = useUploadAudio();
    const { mutateAsync: startTranscription } = useStartTranscription();
    const pollQuery = usePollTranscription(transcriptId, transcriptId !== null);
  
    /**
     * Runs the transcription flow:
     * 1. Uploads the blob.
     * 2. Starts the transcription.
     * 3. Sets the transcriptId to enable polling.
     *
     * If any mutation fails the returned Promise is rejected.
     */
    const transcribeAudio = async (blob: Blob) => {
        const uploadData = await uploadAudio(blob);
        const transcriptData = await startTranscription(uploadData);
        setTranscriptId(transcriptData.id);
    };
  
    return {
      transcribeAudio,
      transcriptionData: pollQuery.data, // Contains job status, text (when available), etc.
      isTranscribing: pollQuery.isLoading,
      error: pollQuery.error,
    };
  };

export default useTranscriptionFlow;
