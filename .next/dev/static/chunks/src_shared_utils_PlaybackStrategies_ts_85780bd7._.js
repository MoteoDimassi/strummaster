(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/shared/utils/PlaybackStrategies.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AggressiveStrumStrategy",
    ()=>AggressiveStrumStrategy,
    "BasicStrumStrategy",
    ()=>BasicStrumStrategy,
    "GentleStrumStrategy",
    ()=>GentleStrumStrategy,
    "MuteStrategy",
    ()=>MuteStrategy,
    "PlaybackStrategyFactory",
    ()=>PlaybackStrategyFactory
]);
class BasicStrumStrategy {
    staggerTime = 0.025;
    async play(samples, direction, type, audioContext, destination, time, sourceCallback) {
        if (type === 'ghost') return;
        const startTime = time || audioContext.currentTime;
        // Order samples based on strum direction
        const orderedSamples = direction === 'down' ? samples : [
            ...samples
        ].reverse();
        const playPromises = orderedSamples.map((sample, index)=>this.playSample(sample, startTime + index * this.staggerTime, audioContext, destination, sourceCallback));
        await Promise.all(playPromises);
    }
    async playSample(sample, time, audioContext, destination, sourceCallback) {
        if (!sample.buffer) {
            throw new Error(`Sample ${sample.id} not loaded`);
        }
        const source = audioContext.createBufferSource();
        source.buffer = sample.buffer;
        const gain = audioContext.createGain();
        gain.gain.value = 1.0;
        source.connect(gain);
        gain.connect(destination);
        // Регистрируем источник, если предоставлен колбэк
        if (sourceCallback) {
            sourceCallback(source);
        }
        source.start(time);
    }
}
class AggressiveStrumStrategy {
    staggerTime = 0.015;
    gainMultiplier = 1.2;
    async play(samples, direction, type, audioContext, destination, time, sourceCallback) {
        if (type === 'ghost') return;
        const startTime = time || audioContext.currentTime;
        const orderedSamples = direction === 'down' ? samples : [
            ...samples
        ].reverse();
        const playPromises = orderedSamples.map((sample, index)=>this.playSample(sample, startTime + index * this.staggerTime, audioContext, destination, this.gainMultiplier, sourceCallback));
        await Promise.all(playPromises);
    }
    async playSample(sample, time, audioContext, destination, gainMultiplier = 1.0, sourceCallback) {
        if (!sample.buffer) {
            throw new Error(`Sample ${sample.id} not loaded`);
        }
        const source = audioContext.createBufferSource();
        source.buffer = sample.buffer;
        const gain = audioContext.createGain();
        gain.gain.value = gainMultiplier;
        source.connect(gain);
        gain.connect(destination);
        // Регистрируем источник, если предоставлен колбэк
        if (sourceCallback) {
            sourceCallback(source);
        }
        source.start(time);
    }
}
class GentleStrumStrategy {
    staggerTime = 0.035;
    gainMultiplier = 0.8;
    async play(samples, direction, type, audioContext, destination, time, sourceCallback) {
        if (type === 'ghost') return;
        const startTime = time || audioContext.currentTime;
        const orderedSamples = direction === 'down' ? samples : [
            ...samples
        ].reverse();
        const playPromises = orderedSamples.map((sample, index)=>this.playSample(sample, startTime + index * this.staggerTime, audioContext, destination, this.gainMultiplier, sourceCallback));
        await Promise.all(playPromises);
    }
    async playSample(sample, time, audioContext, destination, gainMultiplier = 1.0, sourceCallback) {
        if (!sample.buffer) {
            throw new Error(`Sample ${sample.id} not loaded`);
        }
        const source = audioContext.createBufferSource();
        source.buffer = sample.buffer;
        const gain = audioContext.createGain();
        gain.gain.value = gainMultiplier;
        source.connect(gain);
        gain.connect(destination);
        // Регистрируем источник, если предоставлен колбэк
        if (sourceCallback) {
            sourceCallback(source);
        }
        source.start(time);
    }
}
class MuteStrategy {
    async play(samples, direction, type, audioContext, destination, time, sourceCallback) {
        if (type !== 'mute') return;
        const startTime = time || audioContext.currentTime;
        // Find mute sample (should be first in array for mute type)
        const muteSample = samples.find((s)=>s.id.includes('mute'));
        if (!muteSample || !muteSample.buffer) {
            throw new Error('Mute sample not loaded');
        }
        const source = audioContext.createBufferSource();
        source.buffer = muteSample.buffer;
        const gain = audioContext.createGain();
        gain.gain.value = 0.8;
        source.connect(gain);
        gain.connect(destination);
        // Регистрируем источник, если предоставлен колбэк
        if (sourceCallback) {
            sourceCallback(source);
        }
        source.start(startTime);
    }
}
class PlaybackStrategyFactory {
    static strategies = new Map();
    static{
        PlaybackStrategyFactory.strategies.set('basic', new BasicStrumStrategy());
        PlaybackStrategyFactory.strategies.set('aggressive', new AggressiveStrumStrategy());
        PlaybackStrategyFactory.strategies.set('gentle', new GentleStrumStrategy());
    }
    static getStrategy(type) {
        const strategy = this.strategies.get(type);
        if (!strategy) {
            throw new Error(`Unknown playback strategy: ${type}`);
        }
        return strategy;
    }
    static getMuteStrategy() {
        return new MuteStrategy();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_shared_utils_PlaybackStrategies_ts_85780bd7._.js.map