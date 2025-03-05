import { useMutation } from '@tanstack/react-query';
import { ASSEMBLYAI_UPLOAD_ENDPOINT } from '../../constants';

const ASSEMBLYAI_API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY as string;

export const useUploadAudio = () =>
    useMutation({
      mutationFn: async (blob: Blob): Promise<string> => {
        const response = await fetch(ASSEMBLYAI_UPLOAD_ENDPOINT, {
          method: 'POST',
          headers: {
            authorization: ASSEMBLYAI_API_KEY,
          },
          body: blob,
        });
        const data = await response.json();
        return data.upload_url;
      },
    });
