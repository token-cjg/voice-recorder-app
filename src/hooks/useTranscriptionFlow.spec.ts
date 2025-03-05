/* eslint @typescript-eslint/no-unused-vars: ["error", { "args": "none" }] */

import { renderHook, act } from '@testing-library/react-hooks';
import { useTranscriptionFlow } from './useTranscriptionFlow';
import { useUploadAudio } from './transcribe/useUploadAudio';
import { useStartTranscription } from './transcribe/useStartTranscription';
import { usePollTranscription } from './transcribe/usePollTranscription';

// Mock dependent hooks.
jest.mock('./transcribe/useUploadAudio');
jest.mock('./transcribe/useStartTranscription');
jest.mock('./transcribe/usePollTranscription');

describe('useTranscriptionFlow hook', () => {
  let uploadMutationMock: jest.Mock;
  let startTranscriptionMutationMock: jest.Mock;
  let pollQueryMock: { data: unknown; isLoading: boolean; error: unknown };

  beforeEach(() => {
    uploadMutationMock = jest.fn();
    startTranscriptionMutationMock = jest.fn();
    pollQueryMock = { data: null, isLoading: false, error: null };

    (useUploadAudio as jest.Mock).mockReturnValue({ mutate: uploadMutationMock });
    (useStartTranscription as jest.Mock).mockReturnValue({ mutate: startTranscriptionMutationMock });
    (usePollTranscription as jest.Mock).mockReturnValue(pollQueryMock);
  });

  it('returns initial transcription state', () => {
    const { result } = renderHook(() => useTranscriptionFlow());
    expect(result.current.transcriptionData).toBeNull();
    expect(result.current.isTranscribing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls upload and start transcription mutations when transcribeAudio is called', async () => {
    const { result } = renderHook(() => useTranscriptionFlow());
    const blob = new Blob(['test audio'], { type: 'audio/webm' });

    // Simulate a successful upload.
    uploadMutationMock.mockImplementation((uploadedBlob, { onSuccess, onError }) => {
      onSuccess({ id: 'transcript-123', someField: 'dummy' });
    });
    // Simulate a successful startTranscription.
    startTranscriptionMutationMock.mockImplementation((data, { onSuccess, onError }) => {
      onSuccess({ id: 'transcript-123', text: 'Transcribed text' });
    });

    await act(async () => {
      await result.current.transcribeAudio(blob);
    });

    expect(uploadMutationMock).toHaveBeenCalledWith(blob, expect.any(Object));
    expect(startTranscriptionMutationMock).toHaveBeenCalledWith(
      { id: 'transcript-123', someField: 'dummy' },
      expect.any(Object)
    );
  });

  it('logs error when upload fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useTranscriptionFlow());
    const blob = new Blob(['test audio'], { type: 'audio/webm' });

    uploadMutationMock.mockImplementation((uploadedBlob, { onError }) => {
      onError('upload error');
    });

    await act(async () => {
      await result.current.transcribeAudio(blob);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading audio:', 'upload error');
    consoleErrorSpy.mockRestore();
  });

  it('logs error when starting transcription fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useTranscriptionFlow());
    const blob = new Blob(['test audio'], { type: 'audio/webm' });

    uploadMutationMock.mockImplementation((uploadedBlob, { onSuccess }) => {
      onSuccess({ id: 'transcript-123', someField: 'dummy' });
    });
    startTranscriptionMutationMock.mockImplementation((data, { onError }) => {
      onError('transcription error');
    });

    await act(async () => {
      await result.current.transcribeAudio(blob);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error starting transcription:', 'transcription error');
    consoleErrorSpy.mockRestore();
  });
});
