import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStartTranscription } from './useStartTranscription';
import { ASSEMBLYAI_TRANSCRIPT_ENDPOINT } from '../../constants';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  return QueryClientWrapper;
};

describe('useStartTranscription hook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully start transcription', async () => {
    const fakeResponse = { id: 'transcript-001', status: 'processing' };
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => fakeResponse,
      ok: true,
      status: 200,
    } as Response);

    const { result } = renderHook(() => useStartTranscription(), {
      wrapper: createWrapper(),
    });

    let data;
    await act(async () => {
      data = await result.current.mutateAsync('http://test-audio-url');
    });

    expect(fetchSpy).toHaveBeenCalledWith(ASSEMBLYAI_TRANSCRIPT_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: process.env.REACT_APP_ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audio_url: 'http://test-audio-url' }),
    });
    expect(data).toEqual(fakeResponse);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Network error';
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useStartTranscription(), {
      wrapper: createWrapper(),
    });

    let error: Error | undefined = undefined;
    try {
      await act(async () => {
        await result.current.mutateAsync('http://test-audio-url');
      });
    } catch (err: unknown) {
      const caughtError = err instanceof Error ? err : new Error(String(err));
      error = caughtError;
    }
    expect(error).toBeDefined();
    expect(error!.message).toEqual(errorMessage);
  });
});