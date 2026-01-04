// Sound effects hook
import { useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useGame } from '../context/GameContext';

type SoundType = 'click' | 'levelup' | 'heartbeat' | 'alarm' | 'complete';

// Sound file mapping - we'll use simple beep sounds for now
// In production, replace with actual audio files
const SOUND_CONFIG: Record<SoundType, { frequency: number; duration: number }> = {
    click: { frequency: 800, duration: 50 },
    levelup: { frequency: 1200, duration: 300 },
    heartbeat: { frequency: 60, duration: 800 },
    alarm: { frequency: 400, duration: 500 },
    complete: { frequency: 1000, duration: 150 },
};

export const useSound = () => {
    const { state } = useGame();
    const soundRef = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        // Configure audio mode
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
        });

        return () => {
            // Cleanup sound on unmount
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const playSound = useCallback(async (type: SoundType) => {
        if (!state.settings.soundEnabled) return;

        try {
            // For now, we'll skip actual sound playback since we don't have audio files
            // In production, load and play the actual sound files:
            // const { sound } = await Audio.Sound.createAsync(require(`../../assets/sounds/${type}.mp3`));
            // soundRef.current = sound;
            // await sound.playAsync();

            // Placeholder for sound feedback - could use haptics as alternative
            console.log(`[Sound] Playing: ${type}`);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }, [state.settings.soundEnabled]);

    const playClick = useCallback(() => playSound('click'), [playSound]);
    const playLevelUp = useCallback(() => playSound('levelup'), [playSound]);
    const playHeartbeat = useCallback(() => playSound('heartbeat'), [playSound]);
    const playAlarm = useCallback(() => playSound('alarm'), [playSound]);
    const playComplete = useCallback(() => playSound('complete'), [playSound]);

    return {
        playSound,
        playClick,
        playLevelUp,
        playHeartbeat,
        playAlarm,
        playComplete,
    };
};

export default useSound;
