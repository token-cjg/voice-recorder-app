import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  ASSEMBLYAI_POLLING_INTERVAL,
  ASSEMBLYAI_TRANSCRIPT_ENDPOINT,
} from '../../constants';

const ASSEMBLYAI_API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY as string;

export const usePollTranscription = (transcriptId: string | null, enabled: boolean) => {
  const [pollingEnabled, setPollingEnabled] = useState(enabled);

  useEffect(() => {
    if (transcriptId !== null) {
      setPollingEnabled(true);
    }
  }, [transcriptId]);

  const query = useQuery({
    queryKey: ['transcription', transcriptId],
    queryFn: async () => {
      const response = await fetch(`${ASSEMBLYAI_TRANSCRIPT_ENDPOINT}/${transcriptId}`, {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      });
      return response.json();
    },
    enabled: pollingEnabled && transcriptId !== null,
    refetchInterval: ASSEMBLYAI_POLLING_INTERVAL,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (query.data?.status === 'completed' || query.data?.status === 'error') {
      setPollingEnabled(false);
    }
  }, [query.data]);

  return query;
};
