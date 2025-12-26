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

    const playSequence = useCallback((indices: number[], durationSeconds: number = 30) => {
        if (!audioContextRef.current || indices.length === 0) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // Upbeat Composition Logic (120 BPM)
        // We will generate a sequence that fills the ENTIRE duration.
        const bpm = 120;
        const secondsPerBeat = 60 / bpm;
        const sixteenthNoteTime = secondsPerBeat / 4;

        // Calculate total 16th note steps for the full duration
        const totalSteps = Math.floor(durationSeconds / sixteenthNoteTime);

        // Grid-based composition using the available "indices" (history) as the note palette
        for (let step = 0; step < totalSteps; step++) {
            // Determine rhythm: Play on 8th notes (every 2 steps) to keep it driving but not chaotic
            // Add some syncopation: Skip some notes or play on 16ths occasionally?
            // Let's stick to a solid 8th note Arpeggio feel: 0, 2, 4, 6...
            if (step % 2 !== 0) continue;

            // Which note from history to play?
            // "The more minerals drawn, the richer the effect"
            // We cycle through the history indices. 
            // If history is short [A, B], it goes A, B, A, B...
            // If history is long [A...Z], it goes A...Z...
            // To add variety to the repetition, we can offset slightly or ping-pong if we wanted,
            // but a direct cycle ensures all "memories" are played in loop.

            // To make it feel "edited" and not just a simple loop, we can add a 'Melodic Walker' pattern
            // straightforward cycle for the main melody:
            const indexInHistory = (step / 2) % indices.length;
            const seedIndex = indices[indexInHistory];
            const seed = SOUND_SEEDS[Math.abs(seedIndex) % SOUND_SEEDS.length];

            const startTime = now + (step * sixteenthNoteTime);

            // Accent logic: Downbeats (every 4th step = every quarter note) are louder
            const isDownbeat = step % 4 === 0;
            // Bar start (every 16 steps = 4 beats) is strongest
            const isBarStart = step % 16 === 0;

            let volume = 0.04;
            if (isBarStart) volume = 0.1;
            else if (isDownbeat) volume = 0.06;

            triggerSound(ctx, seed, startTime, volume);

            // Harmonics / Richness Layer
            // If we have enough history, let's use other notes for harmony!
            // If indices.length > 3, we can add a bass layer or counter-melody.
            if (isDownbeat && indices.length > 3) {
                // Pick a note from further back in the history for harmony
                // E.g., the previous note, or 3 steps back
                const harmonyHistoryIndex = (indexInHistory + 2) % indices.length;
                const harmonySeedIndex = indices[harmonyHistoryIndex];
                const harmonySeed = SOUND_SEEDS[Math.abs(harmonySeedIndex) % SOUND_SEEDS.length];

                // Play harmony lower/softer
                triggerSound(ctx, harmonySeed, startTime, 0.03);
            }

            // "Sparkle" Layer for very rich histories (lots of minerals)
            // Occasional high bursts on random off-beats if we have lots of minerals
            if (indices.length > 8 && Math.random() > 0.8) {
                const sparkleIndex = indices[Math.floor(Math.random() * indices.length)];
                const sparkleSeed = SOUND_SEEDS[Math.abs(sparkleIndex) % SOUND_SEEDS.length];
                // Play very short/quiet
                triggerSound(ctx, sparkleSeed, startTime + (sixteenthNoteTime / 2), 0.02);
            }
        }
    }, []);

    const playRandomSound = () => playNote();

    return { playNote, playSequence, playRandomSound };
};
