import { useCallback, useEffect, useRef } from 'react';

// Pre-defined set of 50 distinct "magical/soft" musical seeds.
// Combinations of Pentatonic scales and soft intervals to ensure pleasantness.
const SOUND_SEEDS = Array.from({ length: 50 }, (_, i) => {
    // Generate frequencies based on a soft pentatonic scale spread across octaves
    // Base C4 = 261.63 Hz. We'll vary slightly to create 50 distinct "bells"
    const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
    const base = baseFreqs[i % baseFreqs.length];
    const octave = 1 + Math.floor(i / baseFreqs.length) * 0.5; // Slight pitch shift up
    const detune = (Math.random() - 0.5) * 10; // Subtle detune for organic feel

    return {
        frequency: base * octave + detune,
        type: i % 2 === 0 ? 'sine' : 'triangle', // Soft wave shapes only
        duration: 1.5 + Math.random(), // 1.5s to 2.5s decay
        delay: Math.random() * 0.1 // Slight strums
    };
});

export const useMagicalSounds = () => {
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext only on client
        if (typeof window !== 'undefined' && !audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();
            }
        }
    }, []);

    const playRandomSound = useCallback(() => {
        if (!audioContextRef.current) return;

        // Resume context if suspended (browser restriction)
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        const ctx = audioContextRef.current;
        const seedIndex = Math.floor(Math.random() * SOUND_SEEDS.length);
        const seed = SOUND_SEEDS[seedIndex];

        // Create a master gain for this sound instance to control volume
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
        masterGain.gain.setValueAtTime(0.05, ctx.currentTime); // Keep it very soft (5% volume)
        masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + seed.duration);

        // Create oscillator
        const osc = ctx.createOscillator();
        osc.type = seed.type as OscillatorType;
        osc.frequency.setValueAtTime(seed.frequency, ctx.currentTime);

        // Add some "shimmer" harmonics for a magical feel
        const harmonicOsc = ctx.createOscillator();
        harmonicOsc.type = 'sine';
        harmonicOsc.frequency.setValueAtTime(seed.frequency * 2.01, ctx.currentTime); // Octave + detune
        const harmonicGain = ctx.createGain();
        harmonicGain.gain.setValueAtTime(0.02, ctx.currentTime);
        harmonicGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + seed.duration * 0.8);

        harmonicOsc.connect(harmonicGain);
        harmonicGain.connect(ctx.destination);

        // Filter to soften the attack (Low pass)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(400, ctx.currentTime + seed.duration);

        osc.connect(filter);
        filter.connect(masterGain);

        // Start tone
        const now = ctx.currentTime;
        osc.start(now);
        harmonicOsc.start(now + 0.05); // Slight delay for second voice

        // Stop tone
        osc.stop(now + seed.duration);
        harmonicOsc.stop(now + seed.duration);

    }, []);

    return { playRandomSound };
};
