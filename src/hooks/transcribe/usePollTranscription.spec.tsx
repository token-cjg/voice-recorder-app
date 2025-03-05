/* eslint @typescript-eslint/no-unused-vars: ["error", { "args": "none" }] */
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePollTranscription } from './usePollTranscription';
import { ASSEMBLYAI_TRANSCRIPT_ENDPOINT } from '../../constants';

// Create a wrapper that provides react-query context.
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  QueryClientWrapper.displayName = 'QueryClientWrapper';
  
  return QueryClientWrapper;
};

describe('usePollTranscription hook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not run query when transcriptId is null', async () => {
    const { result } = renderHook(() => usePollTranscription(null, false), {
      wrapper: createWrapper(),
    });
    // The query should be disabled so no fetching occurs.
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should fetch transcript data when transcriptId is provided and enabled', async () => {
    const transcriptId = 'transcript-123';
    const fakeData = { status: 'processing', text: '' };

    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({
        json: async () => fakeData,
        ok: true,
        status: 200,
      } as Response);

    const { result } = renderHook(() => usePollTranscription(transcriptId, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  
    expect(fetchSpy).toHaveBeenCalledWith(
      `${ASSEMBLYAI_TRANSCRIPT_ENDPOINT}/${transcriptId}`,
      { headers: { authorization: process.env.REACT_APP_ASSEMBLYAI_API_KEY } }
    );
    expect(result.current.data).toEqual(fakeData);
  });

  it('should disable polling when transcription status is "completed"', async () => {
    const transcriptId = 'transcript-456';
    const fakeData = { status: 'completed', text: 'Some transcript' };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => fakeData,
      ok: true,
      status: 200,
    } as Response);

    const { result } = renderHook(() => usePollTranscription(transcriptId, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  
    expect(result.current.data).toEqual(fakeData);

    // When status is "completed", polling should stop (i.e. isFetching becomes false).
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
  });

  it('should disable polling when transcription status is "error"', async () => {
    const transcriptId = 'transcript-789';
    const fakeData = { status: 'error', text: '' };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => fakeData,
      ok: true,
      status: 200,
    } as Response);

    const { result } = renderHook(() => usePollTranscription(transcriptId, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(fakeData);

    // Check polling stops after error.
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
  });
});
