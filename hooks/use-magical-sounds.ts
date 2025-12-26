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

        // Filter envelope variation
        // Some notes can be "brighter" randomly
        if (Math.random() > 0.7) {
            filter.frequency.exponentialRampToValueAtTime(4000, startTime + 0.05);
        }

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

        // WALTZ MODE: "Tennessee Waltz" Style
        // Tempo: ~96 BPM (Moderate, swinging)
        // Time Signature: 3/4 (ONE - two - three)

        const bpm = 96;
        const secondsPerBeat = 60 / bpm;
        const sixteenthNoteTime = secondsPerBeat / 4;
        const totalSteps = Math.floor(durationSeconds / sixteenthNoteTime);

        // A bar of 3/4 has 3 beats = 12 sixteenth notes.
        const notesPerBar = 12;

        for (let step = 0; step < totalSteps; step++) {
            const startTime = now + (step * sixteenthNoteTime);

            // Determine position in the bar (0 to 11)
            const barStep = step % notesPerBar;

            // 1. THE FOUNDATION (Bass & Harmony - Boom-Ching-Ching)
            // Beat 1 (Step 0): Strong Bass Note
            if (barStep === 0) {
                // Root note from history (Lower octave)
                const bassIndex = indices[Math.floor(step / notesPerBar) % indices.length];
                const bassSeed = SOUND_SEEDS[Math.abs(bassIndex) % 10]; // Keep it low
                triggerSound(ctx, bassSeed, startTime, 0.12); // Stronger, warmer
            }

            // Beat 2 (Step 4) & Beat 3 (Step 8): Strummed Chords
            if (barStep === 4 || barStep === 8) {
                // Harmony note (Mid range)
                // We strum 2 notes slightly offset? Just one for now to keep it clean but distinctive
                const chordIndex = indices[(Math.floor(step / notesPerBar) + 1) % indices.length];
                const chordSeed = SOUND_SEEDS[(Math.abs(chordIndex) % 15) + 10]; // Mid range

                // Softer than bass
                triggerSound(ctx, chordSeed, startTime, 0.05);

                // Arpeggiate slightly? Add a tiny delay for a second note
                // const chordSeed2 = SOUND_SEEDS[(Math.abs(chordIndex) % 15) + 14]; // A third/fifth up
                // triggerSound(ctx, chordSeed2, startTime + 0.03, 0.04);
            }

            // 2. THE MELODY (Lyrical, Flowing)
            // In a waltz, melody often moves on beats or flows in 8th notes.
            // Let's create a flowing 8th note pattern (steps 0, 2, 4, 6, 8, 10)
            // But vary it so it's not robotic.

            const isEighthNote = step % 2 === 0;

            if (isEighthNote) {
                // Flowing probability: sine wave modulation
                const shouldPlay = (Math.sin(step * 0.5) > -0.5);

                if (shouldPlay) {
                    // Pick note based on step to create a melody that "travels"
                    const melodyHistoryIndex = (step + Math.floor(step / 12)) % indices.length;
                    const rawIndex = indices[melodyHistoryIndex];

                    // Transpose to a singing range (High)
                    // Add some sine wave motion to pitch to simulate phrasing arc
                    const pitchArch = Math.floor(Math.sin(step / 20) * 5);

                    let melodySeedIndex = (Math.abs(rawIndex) % 20) + 20 + pitchArch;

                    // Adjust to scale limits
                    if (melodySeedIndex >= SOUND_SEEDS.length) melodySeedIndex = SOUND_SEEDS.length - 1;
                    if (melodySeedIndex < 0) melodySeedIndex = 0;

                    const melodySeed = SOUND_SEEDS[melodySeedIndex];

                    // Dynamics: Beat 1 is loudest, others softer (phrasing)
                    let melVolume = 0.06;
                    if (barStep === 0) melVolume = 0.09;
                    if (barStep >= 10) melVolume = 0.04; // End of bar fade

                    triggerSound(ctx, melodySeed, startTime, melVolume);
                }
            }
        }
    }, []);

    const playRandomSound = () => playNote();

    return { playNote, playSequence, playRandomSound };
};
