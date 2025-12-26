import { useCallback, useEffect, useRef } from 'react';

// Upbeat, harmonic musical seeds.
// Using a Major Pentatonic scale (C, D, E, G, A) across multiple octaves for guaranteed harmony.
// Base C4 = 261.63 Hz.
// Frequencies are pre-calculated to ensure they sound good together.
const SCALE_FREQUENCIES = [
    261.63, 293.66, 329.63, 392.00, 440.00, // Octave 4
    523.25, 587.33, 659.25, 783.99, 880.00, // Octave 5
    1046.50, 1174.66, 1318.51, 1567.98, 1760.00 // Octave 6
];

const SOUND_SEEDS = Array.from({ length: 50 }, (_, i) => {
    // Map 0-49 to our scale frequencies.
    // We cycle through the scale, adding slight variations.
    const scaleIndex = i % SCALE_FREQUENCIES.length;
    const baseFreq = SCALE_FREQUENCIES[scaleIndex];

    // Minimal detune for warmth, not dissonance.
    const detune = (Math.random() - 0.5) * 2;

    return {
        frequency: baseFreq + detune,
        type: (i % 3 === 0) ? 'triangle' : 'sine', // Mostly sine for clarity, some triangle for color
        duration: 0.8 + Math.random() * 0.5, // Brisk decay: 0.8s to 1.3s
    };
});

export const useMagicalSounds = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const compressorRef = useRef<DynamicsCompressorNode | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && !audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();

                // Add a master compressor to glue sounds together and prevent clipping
                const ctx = audioContextRef.current;
                compressorRef.current = ctx.createDynamicsCompressor();
                compressorRef.current.threshold.setValueAtTime(-24, ctx.currentTime);
                compressorRef.current.knee.setValueAtTime(30, ctx.currentTime);
                compressorRef.current.ratio.setValueAtTime(12, ctx.currentTime);
                compressorRef.current.attack.setValueAtTime(0.003, ctx.currentTime);
                compressorRef.current.release.setValueAtTime(0.25, ctx.currentTime);
                compressorRef.current.connect(ctx.destination);
            }
        }
    }, []);

    const triggerSound = (ctx: AudioContext, seed: typeof SOUND_SEEDS[0], startTime: number, volume = 0.05) => {
        const outputNode = compressorRef.current || ctx.destination;

        // Master Gain for this note
        const masterGain = ctx.createGain();
        masterGain.connect(outputNode);

        // Envelope: Fast attack, exponential decay for percussive/plucked feel
        masterGain.gain.setValueAtTime(0, startTime);
        masterGain.gain.linearRampToValueAtTime(volume, startTime + 0.01); // Quick attack
        masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + seed.duration);

        // Main Oscillator
        const osc = ctx.createOscillator();
        osc.type = seed.type as OscillatorType;
        osc.frequency.setValueAtTime(seed.frequency, startTime);

        // Filter for brightness
        // Lowpass filter that opens up briefly at the start (pluck effect)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, startTime);
        filter.frequency.exponentialRampToValueAtTime(3000, startTime + 0.05); // Open up
        filter.frequency.exponentialRampToValueAtTime(500, startTime + 0.3); // Close down

        osc.connect(filter);
        filter.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + seed.duration);
    };

    const playNote = useCallback((index?: number) => {
        if (!audioContextRef.current) return -1;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const seedIndex = index !== undefined
            ? Math.abs(index) % SOUND_SEEDS.length
            : Math.floor(Math.random() * SOUND_SEEDS.length);
        const seed = SOUND_SEEDS[seedIndex];
        triggerSound(ctx, seed, ctx.currentTime, 0.1);
        return seedIndex;
    }, []);

    const playSequence = useCallback((indices: number[], durationSeconds: number = 10) => {
        if (!audioContextRef.current || indices.length === 0) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // Upbeat Composition Logic
        // We will use a 16th note grid at a brisk tempo (e.g., 120 BPM)
        // 120 BPM = 2 beats per second = 8 sixteenth notes per second.
        // We'll fit the sequence into the requested duration, but quantization is key for rhythm.

        const bpm = 120; // Brisk tempo
        const secondsPerBeat = 60 / bpm;
        const sixteenthNoteTime = secondsPerBeat / 4;

        // Quantize steps to musical grid
        indices.forEach((seedIndex, i) => {
            const seed = SOUND_SEEDS[Math.abs(seedIndex) % SOUND_SEEDS.length];

            // Rhythmic Pattern Logic:
            // Instead of playing every note on a straight beat, we create patterns.
            // Simple Arpeggiator pattern: 
            // 1. Root (on beat)
            // 2. + Fifth (off beat)
            // 3. + Octave

            // We'll map the linear list of indices to a rhythmic grid.
            // We ensure "on beat" (quarter notes) are emphasized.

            let gridPosition = i * 2; // Default to eighth notes for speed

            // Add some syncopation? 
            // If index is odd, maybe shift it slightly off the strict grid for "groove"
            // But user asked for "Harmonic, not random". So stick to a tight grid.

            const startTime = now + (gridPosition * sixteenthNoteTime);

            // Accent logic: First note of every 4 (Downbeat) is louder
            const isDownbeat = i % 4 === 0;
            const volume = isDownbeat ? 0.08 : 0.04;

            triggerSound(ctx, seed, startTime, volume);

            // Harmonic accompaniment (The "Arrangement")
            // on Downbeats, play a harmonious chord tone below
            if (isDownbeat) {
                // Find a note a 3rd or 5th down in the scale
                // We can approximate by shifting index in our sorted scale array
                const harmonyIndex = (seedIndex + 2) % SOUND_SEEDS.length;
                const harmonySeed = SOUND_SEEDS[harmonyIndex];

                // Play harmony slightly quieter
                triggerSound(ctx, harmonySeed, startTime, 0.04);
            }
        });
    }, []);

    const playRandomSound = () => playNote();

    return { playNote, playSequence, playRandomSound };
};
