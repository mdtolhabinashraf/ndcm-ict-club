// CameraLive.jsx
import { useEffect, useRef, useState } from 'react';

const CameraLive = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [hasAudio, setHasAudio] = useState(true);

    useEffect(() => {
        let localStream: MediaStream;
        const getCamera = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(localStream);
                setHasAudio(localStream.getAudioTracks().length > 0); // Check for audio
                if (videoRef.current) {
                    videoRef.current.srcObject = localStream;
                    videoRef.current.muted = false; // Ensure not muted
                    videoRef.current.volume = volume;
                    // Do not auto-play here; let user click Play for audio
                }
            } catch (err) {
                console.error('Camera/mic access denied:', err);
                setHasAudio(false);
            }
        };

        getCamera();

        return () => {
            localStream?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    // Keep video volume in sync with state
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const handlePause = async () => {
        if (!stream) return;
        if (isPaused) {
            stream.getTracks().forEach((track) => (track.enabled = true));
            await videoRef.current?.play();
        } else {
            stream.getTracks().forEach((track) => (track.enabled = false));
            videoRef.current?.pause();
        }
        setIsPaused(!isPaused);
    };

    const handleMute = () => {
        setIsMuted((prev) => !prev);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(e.target.value));
    };

    const handlePlay = async () => {
        if (!stream) return;
        // Enable only audio tracks for audio
        stream.getAudioTracks().forEach((track) => (track.enabled = true));
        stream.getVideoTracks().forEach((track) => (track.enabled = true));
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.volume = volume;
            await videoRef.current.play();
        }
        setIsPaused(false);
    };

    return (
        <div>
            <h2>Live Camera Feed</h2>
            <video ref={videoRef} autoPlay playsInline width="640" height="480" style={{ background: '#000' }} muted={false} />
            {!hasAudio && <p style={{ color: 'red' }}>No audio stream found. Please check your microphone permissions.</p>}
            <div style={{ marginTop: 10 }}>
                <button onClick={handlePlay} disabled={!isPaused}>
                    Play
                </button>
                <button onClick={handlePause}>{isPaused ? 'Resume' : 'Pause'}</button>
                <button onClick={handleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
                <label style={{ marginLeft: 10 }}>
                    Volume:
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{ verticalAlign: 'middle', marginLeft: 5 }}
                    />
                </label>
            </div>
            <p style={{ fontSize: '0.9em', color: '#888' }}>If you don't hear sound, please click "Play" to allow audio playback.</p>
        </div>
    );
};

export default CameraLive;
