module.exports = [
"[project]/src/shared/utils/AudioSampleFactory.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "audioSampleFactory",
    ()=>audioSampleFactory
]);
class AudioSampleFactory {
    static instance;
    audioContext = null;
    cache = new Map();
    loadingPromises = new Map();
    constructor(){}
    static getInstance() {
        if (!AudioSampleFactory.instance) {
            AudioSampleFactory.instance = new AudioSampleFactory();
        }
        return AudioSampleFactory.instance;
    }
    setAudioContext(context) {
        this.audioContext = context;
    }
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
    getSampleUrl(stringName, fret) {
        if (stringName === 'mute') {
            return `/samples/Mute.mp3`;
        }
        return `/samples/${stringName}/fret${fret}.mp3`;
    }
    getSampleKey(config) {
        return `${config.stringName}-${config.fret}${config.chord ? `-${config.chord}` : ''}`;
    }
    async loadSample(config) {
        const key = this.getSampleKey(config);
        console.log(`Loading sample with key: ${key}`);
        // Return from cache if already loaded
        if (this.cache.has(key)) {
            console.log(`Sample ${key} found in cache`);
            return this.cache.get(key);
        }
        // Return existing promise if already loading
        if (this.loadingPromises.has(key)) {
            console.log(`Sample ${key} already loading, waiting...`);
            const buffer = await this.loadingPromises.get(key);
            return this.cache.get(key);
        }
        // Create new sample entry
        const url = this.getSampleUrl(config.stringName, config.fret);
        console.log(`Loading sample from URL: ${url}`);
        const sample = {
            id: key,
            url: url,
            isLoading: true
        };
        this.cache.set(key, sample);
        // Load the audio buffer
        const loadPromise = this.loadAudioBuffer(sample.url);
        this.loadingPromises.set(key, loadPromise);
        try {
            const buffer = await loadPromise;
            sample.buffer = buffer;
            sample.isLoading = false;
            this.loadingPromises.delete(key);
            console.log(`Sample ${key} loaded successfully`);
            return sample;
        } catch (error) {
            console.error(`Failed to load sample ${key}:`, error);
            sample.error = error instanceof Error ? error.message : 'Unknown error';
            sample.isLoading = false;
            this.loadingPromises.delete(key);
            throw error;
        }
    }
    async loadAudioBuffer(url) {
        const audioContext = this.getAudioContext();
        console.log(`Fetching audio from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }
        console.log(`Audio fetched successfully, decoding...`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log(`Audio decoded successfully`);
        return audioBuffer;
    }
    async loadChordSamples(chordName, chordFrets) {
        const strings = [
            '6E',
            '5A',
            '4D',
            '3G',
            '2B',
            '1e'
        ];
        const samples = [];
        const loadPromises = chordFrets.map(async (fret, index)=>{
            if (fret !== null) {
                try {
                    const sample = await this.loadSample({
                        stringName: strings[index],
                        fret,
                        chord: chordName
                    });
                    return {
                        index,
                        sample
                    };
                } catch (error) {
                    console.error(`Failed to load sample for ${strings[index]} fret ${fret}:`, error);
                    return null;
                }
            }
            return null;
        });
        const results = await Promise.all(loadPromises);
        // Sort by string index to maintain order
        results.filter((result)=>result !== null).sort((a, b)=>a.index - b.index).forEach(({ sample })=>samples.push(sample));
        return {
            chord: chordName,
            samples
        };
    }
    preloadMuteSample() {
        console.log('Preloading mute sample...');
        return this.loadSample({
            stringName: 'mute',
            fret: 0
        });
    }
    getSample(config) {
        const key = this.getSampleKey(config);
        return this.cache.get(key);
    }
    clearCache() {
        this.cache.clear();
        this.loadingPromises.clear();
    }
    getCacheSize() {
        return this.cache.size;
    }
    getLoadingSamplesCount() {
        return this.loadingPromises.size;
    }
}
const audioSampleFactory = AudioSampleFactory.getInstance();
}),
];

//# sourceMappingURL=src_shared_utils_AudioSampleFactory_ts_cbf990d5._.js.map