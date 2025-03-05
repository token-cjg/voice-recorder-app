import { useState } from 'react';
import { useUploadAudio } from './transcribe/useUploadAudio';
import { useStartTranscription } from './transcribe/useStartTranscription';
import { usePollTranscription } from './transcribe/usePollTranscription';

const useTranscriptionFlow = () => {
    const [transcriptId, setTranscriptId] = useState<string | null>(null);
  
    const { mutate: uploadMutation } = useUploadAudio();
    const { mutate: startTranscriptionMutation } = useStartTranscription();
    const pollQuery = usePollTranscription(transcriptId, transcriptId !== null);
  
    /**
     * Runs the full transcription flow:
     * 1. Uploads the blob.
     * 2. Starts the transcription.
     * 3. Sets the transcriptId to enable polling.
     */
    const transcribeAudio = async (blob: Blob) => {
        uploadMutation(blob, {
            onSuccess: async (data) => {
                startTranscriptionMutation(data, {
                    onSuccess: (transcriptData) => {
                        setTranscriptId(transcriptData.id);
                    },
                    onError: (error) => {
                        console.error('Error starting transcription:', error);
                    },
                });
            },
            onError: (error) => {
                console.error('Error uploading audio:', error);
            },
        });
    };
  
    return {
      transcribeAudio,
      transcriptionData: pollQuery.data, // Contains job status, text (when available), etc.
      isTranscribing: pollQuery.isLoading,
      error: pollQuery.error,
    };
  };

export default useTranscriptionFlow;
