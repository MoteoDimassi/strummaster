module.exports = [
"[project]/src/features/audio/services/AudioEngineService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioEngineService",
    ()=>AudioEngineService,
    "audioEngineService",
    ()=>audioEngineService
]);
// Chord Shapes (Fret positions: 6E, 5A, 4D, 3G, 2B, 1e)
const CHORD_FRETS = {
    'Am': [
        null,
        0,
        2,
        2,
        1,
        0
    ],
    'A': [
        null,
        0,
        2,
        2,
        2,
        0
    ],
    'C': [
        null,
        3,
        2,
        0,
        1,
        0
    ],
    'D': [
        null,
        null,
        0,
        2,
        3,
        2
    ],
    'Dm': [
        null,
        null,
        0,
        2,
        3,
        1
    ],
    'E': [
        0,
        2,
        2,
        1,
        0,
        0
    ],
    'Em': [
        0,
        2,
        2,
        0,
        0,
        0
    ],
    'G': [
        3,
        2,
        0,
        0,
        0,
        3
    ],
    'F': [
        null,
        null,
        3,
        2,
        1,
        1
    ]
};
const STRINGS = [
    '6E',
    '5A',
    '4D',
    '3G',
    '2B',
    '1e'
];
class AudioEngineService {
    playbackStrategy = 'basic';
    audioContext = null;
    masterGainNode = null;
    isInitialized = false;
    getAudioContext() {
        if (!this.audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error('Web Audio API не поддерживается в этом браузере');
            }
            this.audioContext = new AudioContextClass();
        }
        return this.audioContext;
    }
    getMasterGainNode() {
        if (!this.masterGainNode) {
            const context = this.getAudioContext();
            this.masterGainNode = context.createGain();
            this.masterGainNode.connect(context.destination);
            this.masterGainNode.gain.value = 0.5;
        }
        return this.masterGainNode;
    }
    init() {
        if (!this.isInitialized) {
            this.getAudioContext();
            this.getMasterGainNode();
            this.isInitialized = true;
        }
    }
    get currentTime() {
        this.init();
        return this.getAudioContext().currentTime;
    }
    async resume() {
        this.init();
        await this.getAudioContext().resume();
    }
    setVolume(val) {
        this.init();
        this.getMasterGainNode().gain.value = val;
    }
    setPlaybackStrategy(strategy) {
        this.playbackStrategy = strategy;
    }
    async preloadChord(chordName) {
        this.init();
        // Используем AudioSampleFactory для предварительной загрузки
        const { audioSampleFactory } = await __turbopack_context__.A("[project]/src/shared/utils/AudioSampleFactory.ts [app-ssr] (ecmascript, async loader)");
        const frets = CHORD_FRETS[chordName];
        if (frets) {
            await audioSampleFactory.loadChordSamples(chordName, frets);
        }
    }
    async strum(direction, chordName, type, time) {
        this.init();
        // Импортируем зависимости динамически, чтобы избежать циклических зависимостей
        const { audioSampleFactory } = await __turbopack_context__.A("[project]/src/shared/utils/AudioSampleFactory.ts [app-ssr] (ecmascript, async loader)");
        const { PlaybackStrategyFactory } = await __turbopack_context__.A("[project]/src/shared/utils/PlaybackStrategies.ts [app-ssr] (ecmascript, async loader)");
        // Ghost notes are silent
        if (type === 'ghost') {
            return;
        }
        const startTime = time || this.getAudioContext().currentTime;
        try {
            // Handle Mute Strum
            if (type === 'mute') {
                const muteSample = await audioSampleFactory.preloadMuteSample();
                const strategy = PlaybackStrategyFactory.getMuteStrategy();
                await strategy.play([
                    muteSample
                ], direction, type, this.getAudioContext(), this.getMasterGainNode(), startTime);
                return;
            }
            // Handle Normal Strum
            const frets = CHORD_FRETS[chordName];
            if (!frets) {
                console.error(`Unknown chord: ${chordName}`);
                return;
            }
            const chordSample = await audioSampleFactory.loadChordSamples(chordName, frets);
            const strategy = PlaybackStrategyFactory.getStrategy(this.playbackStrategy);
            await strategy.play(chordSample.samples, direction, type, this.getAudioContext(), this.getMasterGainNode(), startTime);
        } catch (error) {
            console.error(`Failed to play strum:`, error);
        }
    }
    async playNote(stringName, fret, time) {
        this.init();
        // Импортируем зависимости динамически, чтобы избежать циклических зависимостей
        const { audioSampleFactory } = await __turbopack_context__.A("[project]/src/shared/utils/AudioSampleFactory.ts [app-ssr] (ecmascript, async loader)");
        const { PlaybackStrategyFactory } = await __turbopack_context__.A("[project]/src/shared/utils/PlaybackStrategies.ts [app-ssr] (ecmascript, async loader)");
        const startTime = time || this.getAudioContext().currentTime;
        try {
            const sample = await audioSampleFactory.loadSample({
                stringName,
                fret
            });
            if (!sample.buffer) {
                throw new Error(`Sample not loaded: ${stringName}-${fret}`);
            }
            const strategy = PlaybackStrategyFactory.getStrategy(this.playbackStrategy);
            await strategy.play([
                sample
            ], 'down', 'strum', this.getAudioContext(), this.getMasterGainNode(), startTime);
        } catch (error) {
            console.error(`Failed to play note:`, error);
        }
    }
    registerActiveSource(source) {
    // Пустая реализация для совместимости
    }
    stopAllSounds() {
        this.init();
        this.getMasterGainNode().gain.value = 0;
    }
    stop() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
            this.masterGainNode = null;
            this.isInitialized = false;
        }
    }
    getAvailableChords() {
        return [
            'Am',
            'A',
            'C',
            'D',
            'Dm',
            'E',
            'Em',
            'G',
            'F'
        ];
    }
    getPlaybackStrategy() {
        return this.playbackStrategy;
    }
    isAudioInitialized() {
        return this.isInitialized;
    }
}
const audioEngineService = new AudioEngineService();
}),
];

//# sourceMappingURL=src_features_audio_services_AudioEngineService_ts_5fe1982a._.js.map