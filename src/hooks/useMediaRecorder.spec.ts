/* eslint @typescript-eslint/no-unused-vars: ["error", { "args": "none" }] */

import { renderHook, act } from '@testing-library/react-hooks';
import useMediaRecorder from './useMediaRecorder';

// Minimal FakeMediaStream that satisfies the MediaStream interface
class FakeMediaStream implements MediaStream {
    active: boolean = true;
    id: string = 'fake-id';
    onaddtrack: ((this: MediaStream, event: MediaStreamTrackEvent) => void) | null = null;
    onremovetrack: ((this: MediaStream, event: MediaStreamTrackEvent) => void) | null = null;
  
    // Minimal implementations for required methods
    getTracks(): MediaStreamTrack[] {
      return [];
    }
    getAudioTracks(): MediaStreamTrack[] {
      return [];
    }
    getVideoTracks(): MediaStreamTrack[] {
      return [];
    }
    addTrack(_track: MediaStreamTrack): void {}
    removeTrack(_track: MediaStreamTrack): void {}
    clone(): MediaStream {
        return new FakeMediaStream();
    }
    getTrackById(_trackId: string): MediaStreamTrack | null {
        throw new Error('Method not implemented.');
    }
    addEventListener(_type: unknown, _listener: unknown, _options?: unknown): void {
        throw new Error('Method not implemented.');
    }
    removeEventListener(_type: unknown, _listener: unknown, _options?: unknown): void {
        throw new Error('Method not implemented.');
    }
    dispatchEvent(_event: Event): boolean {
        throw new Error('Method not implemented.');
    }
}

// Define a fake MediaStream if it's not available.
if (typeof MediaStream === 'undefined') {
    // A minimal fake class. You can expand this if needed.
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    global.MediaStream = FakeMediaStream;
}

// A fake MediaRecorder to simulate the browser API.
class FakeMediaRecorder {
  state: string = 'inactive';
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;

  constructor(_stream: MediaStream) {}

  start() {
    this.state = 'recording';
  }

  pause() {
    this.state = 'paused';
  }

  resume() {
    this.state = 'recording';
  }

  stop() {
    this.state = 'stopped';
    // Simulate the event that provides recorded audio.
    if (this.ondataavailable) {
      const dummyBlob = new Blob(['dummy audio data'], { type: 'audio/webm' });
      this.ondataavailable({ data: dummyBlob });
    }
    if (this.onstop) {
      this.onstop();
    }
  }
}

// Set up the mocks before any tests run.
beforeAll(() => {
  // Mock getUserMedia to return a dummy stream.
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
    },
    writable: true,
  });

  // Override global MediaRecorder with our fake implementation.
  // @ts-expect-error - MediaRecorder is not writable.
  global.MediaRecorder = FakeMediaRecorder;
});

describe('useMediaRecorder hook', () => {
  it('should have initial state "inactive" and no audioBlob', () => {
    const { result } = renderHook(() => useMediaRecorder());
    expect(result.current.recordingState).toBe('inactive');
    expect(result.current.audioBlob).toBeNull();
  });

  it('should start recording and update state to "recording"', async () => {
    const { result } = renderHook(() => useMediaRecorder());
    await act(async () => {
      await result.current.startRecording();
    });
    expect(result.current.recordingState).toBe('recording');
  });

  it('should pause and resume recording correctly', async () => {
    const { result } = renderHook(() => useMediaRecorder());
    // Start recording first.
    await act(async () => {
      await result.current.startRecording();
    });
    expect(result.current.recordingState).toBe('recording');

    act(() => {
      result.current.pauseRecording();
    });
    expect(result.current.recordingState).toBe('paused');

    act(() => {
      result.current.resumeRecording();
    });
    expect(result.current.recordingState).toBe('recording');
  });

  it('should stop recording and produce an audio blob', async () => {
    const { result } = renderHook(() => useMediaRecorder());
    // Start recording.
    await act(async () => {
      await result.current.startRecording();
    });
    // Stop recording.
    act(() => {
      result.current.stopRecording();
    });
    expect(result.current.recordingState).toBe('stopped');
    expect(result.current.audioBlob).not.toBeNull();
    // Verify that the blob has the correct type.
    expect(result.current.audioBlob?.type).toBe('audio/webm');
  });
});
