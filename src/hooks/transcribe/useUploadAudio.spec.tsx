import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUploadAudio } from './useUploadAudio';
import { ASSEMBLYAI_UPLOAD_ENDPOINT } from '../../constants';

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

describe('useUploadAudio hook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully upload audio and return upload_url', async () => {
    const fakeUploadUrl = 'https://uploaded-audio-url.com/audio';
    const fakeResponse = { upload_url: fakeUploadUrl };
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => fakeResponse,
      ok: true,
      status: 200,
    } as Response);

    const { result } = renderHook(() => useUploadAudio(), { wrapper: createWrapper() });
    const fakeBlob = new Blob(['test'], { type: 'text/plain' });

    let data;
    await act(async () => {
      data = await result.current.mutateAsync(fakeBlob);
    });

    expect(fetchSpy).toHaveBeenCalledWith(ASSEMBLYAI_UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: process.env.REACT_APP_ASSEMBLYAI_API_KEY,
      },
      body: fakeBlob,
    });
    expect(data).toEqual(fakeUploadUrl);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Network error';
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error(errorMessage));
  
    const { result } = renderHook(() => useUploadAudio(), { wrapper: createWrapper() });
    const fakeBlob = new Blob(['test'], { type: 'text/plain' });
  
    let error: Error | undefined = undefined;
    try {
      await act(async () => {
        await result.current.mutateAsync(fakeBlob);
      });
    } catch (err: unknown) {
      error = err instanceof Error ? err : new Error(String(err));
    }
    expect(error).toBeDefined();
    expect(error!.message).toEqual(errorMessage);
  });
});
