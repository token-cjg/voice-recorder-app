/* eslint @typescript-eslint/no-unused-vars: ["error", { "args": "none" }] */

import { renderHook, act } from '@testing-library/react-hooks';
import useTranscriptionFlow from './useTranscriptionFlow';
import { useUploadAudio } from './transcribe/useUploadAudio';
import { useStartTranscription } from './transcribe/useStartTranscription';
import { usePollTranscription } from './transcribe/usePollTranscription';

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

    (useUploadAudio as jest.Mock).mockReturnValue({ mutateAsync: uploadMutationMock });
    (useStartTranscription as jest.Mock).mockReturnValue({ mutateAsync: startTranscriptionMutationMock });
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

    uploadMutationMock.mockResolvedValue({ id: 'transcript-123', someField: 'dummy' });
    startTranscriptionMutationMock.mockResolvedValue({ id: 'transcript-123', text: 'Transcribed text' });

    await act(async () => {
      await result.current.transcribeAudio(blob);
    });

    expect(uploadMutationMock).toHaveBeenCalledWith(blob);
    expect(startTranscriptionMutationMock).toHaveBeenCalledWith({ id: 'transcript-123', someField: 'dummy' });
  });

  it('rejects when upload fails', async () => {
    const { result } = renderHook(() => useTranscriptionFlow());
    const blob = new Blob(['test audio'], { type: 'audio/webm' });

    uploadMutationMock.mockRejectedValue('upload error');

    await expect(result.current.transcribeAudio(blob)).rejects.toEqual('upload error');
  });

  it('rejects when starting transcription fails', async () => {
    const { result } = renderHook(() => useTranscriptionFlow());
    const blob = new Blob(['test audio'], { type: 'audio/webm' });

    uploadMutationMock.mockResolvedValue({ id: 'transcript-123', someField: 'dummy' });
    startTranscriptionMutationMock.mockRejectedValue('transcription error');

    await expect(result.current.transcribeAudio(blob)).rejects.toEqual('transcription error');
  });
});
