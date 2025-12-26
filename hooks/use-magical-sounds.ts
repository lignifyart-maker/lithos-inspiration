import { useCallback, useEffect, useRef } from 'react';

// Chromatic Scale (12 semitones)
// C4 = 261.63 Hz
// We map octaves: Octave 4, 5, 6
const SCALE_FREQUENCIES = [
    // Octave 4: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
    261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88,
    // Octave 5
    523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77,
    // Octave 6
    1046.50, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760.00, 1864.66, 1975.53
];

const SOUND_SEEDS = Array.from({ length: 60 }, (_, i) => {
    // Map i to chromatic frequencies
    // Safe guard index
    const scaleIndex = i % SCALE_FREQUENCIES.length;
    const baseFreq = SCALE_FREQUENCIES[scaleIndex];

    // Minimal detune for warmth
    const detune = (Math.random() - 0.5) * 2;

    return {
        frequency: baseFreq + detune,
        type: (i % 3 === 0) ? 'triangle' : 'sine',
        duration: 0.8 + Math.random() * 0.5,
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

                const ctx = audioContextRef.current;
                compressorRef.current = ctx.createDynamicsCompressor();
                compressorRef.current.threshold.setValueAtTime(-24, ctx.currentTime);
                compressorRef.current.connect(ctx.destination);
            }
        }
    }, []);

    const triggerSound = (ctx: AudioContext, seed: typeof SOUND_SEEDS[0], startTime: number, volume = 0.05) => {
        const outputNode = compressorRef.current || ctx.destination;
        const masterGain = ctx.createGain();
        masterGain.connect(outputNode);

        masterGain.gain.setValueAtTime(0, startTime);
        masterGain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + seed.duration);

        const osc = ctx.createOscillator();
        osc.type = seed.type as OscillatorType;
        osc.frequency.setValueAtTime(seed.frequency, startTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, startTime);
        filter.frequency.exponentialRampToValueAtTime(3000, startTime + 0.05);
        filter.frequency.exponentialRampToValueAtTime(500, startTime + 0.3);

        osc.connect(filter);
        filter.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + seed.duration);
    };

    const playNote = useCallback((index?: number) => {
        if (!audioContextRef.current) return -1;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;

        // For random taps, prioritize Pentatonic/Diatonic notes to sound good
        // C Major Pentatonic indices in a Chromatic scale (0=C):
        // 0(C), 2(D), 4(E), 7(G), 9(A)
        const safeOffsets = [0, 2, 4, 7, 9];

        let seedIndex;
        if (index !== undefined) {
            // If specific index requested, assume it maps to our safe seeds
            seedIndex = Math.abs(index) % SOUND_SEEDS.length;
        } else {
            // Random tap: pick a safe offset + random octave
            const offset = safeOffsets[Math.floor(Math.random() * safeOffsets.length)];
            const octave = Math.floor(Math.random() * 3); // 0, 1, 2
            seedIndex = offset + (octave * 12);
        }

        const seed = SOUND_SEEDS[seedIndex];
        triggerSound(ctx, seed, ctx.currentTime, 0.1);
        return seedIndex;
    }, []);

    const playSequence = useCallback((indices: number[], durationSeconds: number = 30) => {
        if (!audioContextRef.current || indices.length === 0) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        const bpm = 130;
        const secondsPerBeat = 60 / bpm;
        const sixteenthNoteTime = secondsPerBeat / 4;
        const totalSteps = Math.floor(durationSeconds / sixteenthNoteTime);

        // --- 10 MELODY LIBRARY (Motifs) ---
        const SONGS = [
            {
                name: "My Grandfather's Clock",
                // G, C, B, C, D, E, F, E...
                notes: [7, 12, 11, 12, 14, 16, 17, 16, null, 12, 14, 12, 11, 7, 9, 7],
                speed: 2 // Play every 2 steps (8th notes)
            },
            {
                name: "Nada Sousou (Tears)",
                // C, E, F, G... A, G...
                notes: [0, 4, 5, 7, null, 7, 9, 7, null, 5, 4, 0, null, 2, 4, 2],
                speed: 2
            },
            {
                name: "La Marseillaise",
                // G, G, C, C, G...
                notes: [7, 7, 12, 12, 7, 16, 17, 19, 17, 16, 14, 19, 12],
                speed: 2
            },
            {
                name: "ROC Anthem (San Min Chu I)",
                // C, D, E, G, A...
                notes: [0, 2, 4, 7, 9, 7, 4, 2, 0, 2, 4, 2, 0],
                speed: 4
            },
            {
                name: "March of the Volunteers",
                // G, E, G, G...
                notes: [7, 4, 7, 7, 12, 7, 4, 0, 2, 7, 2, 0, 7, 0],
                speed: 2
            },
            {
                name: "The Star-Spangled Banner",
                // G, E, C, E, G, C...
                notes: [7, 4, 0, 4, 7, 12, 19, 16, 14, 16, 14, 12, -5, 4, 7],
                speed: 2
            },
            {
                name: "Moonlight March (Turkish March)",
                // B, A, G#, A, C...
                notes: [11, 9, 8, 9, 12, 9, 8, 9, 12, 14, 16, 14, 12, 11],
                speed: 1
            },
            {
                name: "Four Seasons (Spring)",
                // E, G#, G#, G#...
                notes: [4, 8, 8, 8, 4, 8, 8, 8, 4, 8, 11, 9, 8, 6, 4],
                speed: 2
            },
            {
                name: "Fur Elise",
                // E, D#, E, D#, E, B, D, C, A...
                notes: [16, 15, 16, 15, 16, 11, 14, 12, 9, null, 0, 4, 9, 11],
                speed: 1
            },
            {
                name: "Anna Magdalena (Minuet in G)",
                // D, G, A, B, C, D, G, G
                notes: [14, 7, 9, 11, 12, 14, 7, 7, null, 16, 17, 16, 14, 12, 11],
                speed: 2
            }
        ];

        // Randomly select one song
        const selectedSong = SONGS[Math.floor(Math.random() * SONGS.length)];

        for (let step = 0; step < totalSteps; step++) {
            const startTime = now + (step * sixteenthNoteTime);

            // --- 1. MELODY LAYER ---
            if (step % selectedSong.speed === 0) {
                const noteIndexInPattern = (step / selectedSong.speed) % selectedSong.notes.length;
                const noteInterval = selectedSong.notes[noteIndexInPattern];

                if (noteInterval !== null) {
                    let targetIndex = noteInterval + 12; // Center in middle octave
                    targetIndex = Math.max(0, Math.min(targetIndex, SOUND_SEEDS.length - 1));
                    const melodySeed = SOUND_SEEDS[targetIndex];
                    const vol = (noteIndexInPattern === 0) ? 0.1 : 0.07;
                    triggerSound(ctx, melodySeed, startTime, vol);
                }
            }

            // --- 2. BACKING LAYER (User History) ---
            if (step % 4 === 0) {
                const bassHistoryIndex = indices[Math.floor(step / 4) % indices.length];
                const safeBassOffsets = [0, 5, 7, 9]; // C, F, G, Am
                const bassOffset = safeBassOffsets[Math.abs(bassHistoryIndex) % safeBassOffsets.length];

                const bassSeed = SOUND_SEEDS[bassOffset];
                triggerSound(ctx, bassSeed, startTime, 0.1);
            }

            // Texture / Sparkle
            if (Math.random() > 0.9) {
                const sparkleIndex = indices[Math.floor(Math.random() * indices.length)];
                const sparkleSeed = SOUND_SEEDS[(Math.abs(sparkleIndex) % 12) + 24];
                triggerSound(ctx, sparkleSeed, startTime, 0.02);
            }
        }
    }, []);

    const playRandomSound = () => playNote();

    return { playNote, playSequence, playRandomSound };
};
