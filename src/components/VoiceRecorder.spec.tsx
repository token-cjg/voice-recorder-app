import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import VoiceRecorder from './VoiceRecorder';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <VoiceRecorder/>
    </QueryClientProvider>
  );
};

const startRecordingMock = jest.fn();
const stopRecordingMock = jest.fn();
const transcribeAudioMock = jest.fn();
const transcriptionDataMock = jest.fn();

jest.mock('../hooks/useMediaRecorder', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../hooks/useTranscriptionFlow', () => ({
  __esModule: true,
  default: () => ({
    transcribeAudio: transcribeAudioMock,
    transcriptionData: transcriptionDataMock(),
    isTranscribing: false,
    error: null,
  }),
}));

describe('VoiceRecorder component', () => {
  describe('when not recording', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      const { default: useMediaRecorder } = await import('../hooks/useMediaRecorder');
      (useMediaRecorder as jest.Mock).mockImplementation(() => ({
        recordingState: 'inactive',
        startRecording: startRecordingMock,
        pauseRecording: jest.fn(),
        resumeRecording: jest.fn(),
        stopRecording: stopRecordingMock,
        audioBlob: null,
      }));
    });

    it('should render without errors', () => {
      renderComponent();
      expect(screen.getByText(/voice recorder/i)).toBeInTheDocument();
    });

    it('should display start recording buttons', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: /record/i })).toBeInTheDocument();
    });

    it('should call startRecording when "Record" is clicked', () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: /record/i }));
      expect(startRecordingMock).toHaveBeenCalled();
    });
  });

  describe('when recording', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      const { default: useMediaRecorder } = await import('../hooks/useMediaRecorder');
      (useMediaRecorder as jest.Mock).mockImplementation(() => ({
        recordingState: 'recording',
        startRecording: startRecordingMock,
        pauseRecording: jest.fn(),
        resumeRecording: jest.fn(),
        stopRecording: stopRecordingMock,
        audioBlob: null,
      }));
    });

    it('should call stopRecording when "Stop Recording" is clicked', () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: /stop/i }));
      expect(stopRecordingMock).toHaveBeenCalled();
    });
  });

  describe('when recording is stopped', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      const { default: useMediaRecorder } = await import('../hooks/useMediaRecorder');
      (useMediaRecorder as jest.Mock).mockImplementation(() => ({
        recordingState: 'stopped',
        startRecording: startRecordingMock,
        pauseRecording: jest.fn(),
        resumeRecording: jest.fn(),
        stopRecording: stopRecordingMock,
        audioBlob: new Blob(['test audio'], { type: 'audio/webm' }),
      }));
    });

    it('should call transcribeAudio with the audio blob', () => {
      renderComponent();
      expect(transcribeAudioMock).toHaveBeenCalledWith(expect.any(Blob));
    });
  });

  describe('when transcription is completed', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      const { default: useMediaRecorder } = await import('../hooks/useMediaRecorder');
      (useMediaRecorder as jest.Mock).mockImplementation(() => ({
        recordingState: 'stopped',
        startRecording: startRecordingMock,
        pauseRecording: jest.fn(),
        resumeRecording: jest.fn(),
        stopRecording: stopRecordingMock,
        audioBlob: new Blob(['test audio'], { type: 'audio/webm' }),
      }));
      transcriptionDataMock.mockReturnValue({ status: 'completed', text: 'Transcribed text' });
    });

    it('should display the transcript', () => {
      renderComponent();
      expect(screen.getByText(/Transcribed text/i)).toBeInTheDocument();
    });
  });
});
