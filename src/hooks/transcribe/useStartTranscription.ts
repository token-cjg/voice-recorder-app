import { useMutation } from '@tanstack/react-query';
import { ASSEMBLYAI_TRANSCRIPT_ENDPOINT } from '../../constants';

const ASSEMBLYAI_API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY as string;

export const useStartTranscription = () =>
    useMutation({
      mutationFn: async (audioUrl: string): Promise<{ id: string; status: string }> => {
        const response = await fetch(ASSEMBLYAI_TRANSCRIPT_ENDPOINT, {
          method: 'POST',
          headers: {
            authorization: ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio_url: audioUrl }),
        });
        return response.json();
      },
    });
