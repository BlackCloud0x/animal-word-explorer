import { useCallback, useEffect, useRef, useState } from 'react';

const stopStream = (stream) => {
  stream?.getTracks().forEach((track) => track.stop());
};

export const useVoiceRecorder = () => {
  const [status, setStatus] = useState('idle');
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioUrlRef = useRef('');

  const replaceAudioUrl = useCallback((nextUrl) => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }

    audioUrlRef.current = nextUrl;
    setAudioUrl(nextUrl);
  }, []);

  const resetRecording = useCallback(() => {
    replaceAudioUrl('');
    setError('');
    setStatus('idle');
  }, [replaceAudioUrl]);

  const startRecording = useCallback(async () => {
    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof window.MediaRecorder === 'undefined'
    ) {
      setError('Voice recording is not available in this browser.');
      setStatus('unsupported');
      return false;
    }

    replaceAudioUrl('');
    setError('');
    setStatus('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const recorder = new window.MediaRecorder(stream);

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = ({ data }) => {
        if (data?.size) {
          chunksRef.current.push(data);
        }
      };
      recorder.onerror = () => {
        stopStream(stream);
        setError('The recording stopped unexpectedly. Please try again.');
        setStatus('error');
      };
      recorder.onstop = () => {
        stopStream(stream);
        streamRef.current = null;
        recorderRef.current = null;

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        if (!blob.size) {
          setError('No voice was recorded. Please try again.');
          setStatus('error');
          return;
        }

        replaceAudioUrl(URL.createObjectURL(blob));
        setStatus('recorded');
      };

      recorder.start();
      setStatus('recording');
      return true;
    } catch (recordingError) {
      stopStream(streamRef.current);
      streamRef.current = null;
      recorderRef.current = null;
      setError(
        recordingError?.name === 'NotAllowedError'
          ? 'Microphone permission was not granted. You can still practise aloud.'
          : 'The microphone could not start. You can still practise aloud.',
      );
      setStatus('error');
      return false;
    }
  }, [replaceAudioUrl]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      setStatus('processing');
      recorderRef.current.stop();
    }
  }, []);

  useEffect(
    () => () => {
      const recorder = recorderRef.current;

      if (recorder?.state === 'recording') {
        recorder.onstop = null;
        recorder.stop();
      }

      stopStream(streamRef.current);
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    },
    [],
  );

  return {
    audioUrl,
    error,
    resetRecording,
    startRecording,
    status,
    stopRecording,
  };
};
