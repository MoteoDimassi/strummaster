(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/hooks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppDispatch",
    ()=>useAppDispatch,
    "useAppSelector",
    ()=>useAppSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const useAppDispatch = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
};
_s(useAppDispatch, "jI3HA1r1Cumjdbu14H7G+TUj798=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"]
    ];
});
const useAppSelector = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/core/tuner/TunerCore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TunerCore",
    ()=>TunerCore
]);
class TunerCore {
    guitarNotes = [
        {
            note: "E",
            octave: 2,
            freq: 82.41
        },
        {
            note: "A",
            octave: 2,
            freq: 110.00
        },
        {
            note: "D",
            octave: 3,
            freq: 146.83
        },
        {
            note: "G",
            octave: 3,
            freq: 196.00
        },
        {
            note: "B",
            octave: 3,
            freq: 246.94
        },
        {
            note: "E",
            octave: 4,
            freq: 329.63
        }
    ];
    noteStrings = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B"
    ];
    /**
   * Анализирует частоту и возвращает результат тюнера
   * @param frequency - частота в Гц
   * @returns результат анализа частоты
   */ analyzeFrequency(frequency) {
        const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
        const note = Math.round(noteNum) + 69;
        const noteName = this.noteStrings[note % 12];
        const cents = Math.floor(1200 * Math.log(frequency / this.frequencyFromNoteNumber(note)) / Math.log(2));
        const isInTune = Math.abs(cents) < 5;
        return {
            note: noteName,
            frequency: Math.round(frequency),
            cents,
            isInTune
        };
    }
    /**
   * Анализирует частоту для гитарного строя
   * @param frequency - частота в Гц
   * @returns результат анализа частоты для гитары
   */ analyzeFrequencyForGuitar(frequency) {
        const closestGuitarNote = this.getClosestGuitarNote(frequency);
        const cents = Math.floor(1200 * Math.log(frequency / closestGuitarNote.freq) / Math.log(2));
        const isInTune = Math.abs(cents) < 5;
        return {
            note: closestGuitarNote.note,
            frequency: Math.round(frequency),
            cents,
            isInTune
        };
    }
    /**
   * Находит ближайшую ноту гитарного строя к заданной частоте
   * @param pitch - частота в Гц
   * @returns ближайшая нота гитарного строя
   */ getClosestGuitarNote(pitch) {
        let minDiff = Infinity;
        let closestNote = this.guitarNotes[0];
        this.guitarNotes.forEach((gNote)=>{
            const diff = Math.abs(pitch - gNote.freq);
            if (diff < minDiff) {
                minDiff = diff;
                closestNote = gNote;
            }
        });
        return closestNote;
    }
    /**
   * Получает все ноты гитарного строя
   * @returns массив нот гитарного строя
   */ getGuitarNotes() {
        return [
            ...this.guitarNotes
        ];
    }
    /**
   * Преобразует номер ноты в частоту
   * @param note - номер ноты
   * @returns частота в Гц
   */ frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    /**
   * Алгоритм автокорреляции для определения основной частоты
   * @param buf - буфер с аудио данными
   * @param sampleRate - частота дискретизации
   * @returns основная частота в Гц или -1, если частота не определена
   */ autoCorrelate(buf, sampleRate) {
        // ACF2+ algorithm implementation
        let SIZE = buf.length;
        let rms = 0;
        for(let i = 0; i < SIZE; i++){
            const val = buf[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01) return -1;
        let r1 = 0, r2 = SIZE - 1, thres = 0.2;
        for(let i = 0; i < SIZE / 2; i++)if (Math.abs(buf[i]) < thres) {
            r1 = i;
            break;
        }
        for(let i = 1; i < SIZE / 2; i++)if (Math.abs(buf[SIZE - i]) < thres) {
            r2 = SIZE - i;
            break;
        }
        buf = buf.slice(r1, r2);
        SIZE = buf.length;
        let c = new Array(SIZE).fill(0);
        for(let i = 0; i < SIZE; i++)for(let j = 0; j < SIZE - i; j++)c[i] = c[i] + buf[j] * buf[j + i];
        let d = 0;
        while(c[d] > c[d + 1])d++;
        let maxval = -1, maxpos = -1;
        for(let i = d; i < SIZE; i++){
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        let T0 = maxpos;
        let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
        let a = (x1 + x3 - 2 * x2) / 2;
        let b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);
        return sampleRate / T0;
    }
    /**
   * Анализирует аудио данные с использованием адаптера
   * @param audioAdapter - адаптер для получения аудио данных
   * @param buffer - буфер для хранения аудио данных
   * @returns результат анализа или null, если частота не определена
   */ analyzeAudioData(audioAdapter, buffer) {
        audioAdapter.getFloatTimeDomainData(buffer);
        const frequency = this.autoCorrelate(buffer, audioAdapter.getSampleRate());
        if (frequency !== -1) {
            return this.analyzeFrequency(frequency);
        }
        return null;
    }
    /**
   * Запускает непрерывный анализ с использованием адаптеров
   * @param audioAdapter - адаптер для получения аудио данных
   * @param animationAdapter - адаптер для анимации
   * @param buffer - буфер для хранения аудио данных
   * @param callback - функция обратного вызова для передачи результатов
   * @param isRunning - функция для проверки состояния работы
   */ startContinuousAnalysis(audioAdapter, animationAdapter, buffer, callback, isRunning) {
        let rafID = null;
        const analyze = ()=>{
            if (!isRunning()) {
                callback(null);
                return;
            }
            const result = this.analyzeAudioData(audioAdapter, buffer);
            callback(result);
            if (isRunning()) {
                rafID = animationAdapter.requestAnimationFrame(analyze);
            }
        };
        analyze();
        // Возвращаем функцию для остановки анализа
        return ()=>{
            if (rafID !== null) {
                animationAdapter.cancelAnimationFrame(rafID);
            }
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/core/adapters/BrowserApiAdapter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Адаптеры для инкапсуляции браузерных API
 * Это позволяет улучшить тестируемость кода и изолировать зависимости от браузера
 */ // Интерфейс для работы с таймерами
__turbopack_context__.s([
    "BrowserApiAdapterFactory",
    ()=>BrowserApiAdapterFactory,
    "WebAnimationApiAdapter",
    ()=>WebAnimationApiAdapter,
    "WebAudioApiAdapter",
    ()=>WebAudioApiAdapter,
    "WebTimerApiAdapter",
    ()=>WebTimerApiAdapter
]);
class WebTimerApiAdapter {
    setTimeout(callback, delay) {
        return window.setTimeout(callback, delay);
    }
    clearTimeout(timerId) {
        if (timerId !== null) {
            window.clearTimeout(timerId);
        }
    }
}
class WebAnimationApiAdapter {
    requestAnimationFrame(callback) {
        return window.requestAnimationFrame(callback);
    }
    cancelAnimationFrame(id) {
        window.cancelAnimationFrame(id);
    }
}
class WebAudioApiAdapter {
    createAudioContext() {
        console.log('[WebAudioApiAdapter] Создание AudioContext');
        return new AudioContext();
    }
    createAnalyser(context) {
        console.log('[WebAudioApiAdapter] Создание AnalyserNode');
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.8;
        return analyser;
    }
    async getUserMedia(constraints) {
        console.log('[WebAudioApiAdapter] Запрос доступа к микрофону');
        const defaultConstraints = constraints || {
            audio: {
                echoCancellation: false,
                autoGainControl: false
            }
        };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
            console.log('[WebAudioApiAdapter] Доступ к микрофону получен');
            return stream;
        } catch (error) {
            console.error('[WebAudioApiAdapter] Ошибка доступа к микрофону:', error);
            throw error;
        }
    }
    createMediaStreamSource(context, stream) {
        console.log('[WebAudioApiAdapter] Создание MediaStreamAudioSourceNode');
        return context.createMediaStreamSource(stream);
    }
}
class BrowserApiAdapterFactory {
    static createTimerAdapter() {
        return new WebTimerApiAdapter();
    }
    static createAnimationAdapter() {
        return new WebAnimationApiAdapter();
    }
    static createAudioAdapter() {
        return new WebAudioApiAdapter();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/core/adapters/TunerAdapter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TunerAdapter",
    ()=>TunerAdapter,
    "tunerAdapter",
    ()=>tunerAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$tuner$2f$TunerCore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/tuner/TunerCore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$BrowserApiAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/adapters/BrowserApiAdapter.ts [app-client] (ecmascript)");
;
;
// Адаптер для AudioData (AnalyserNode)
class WebAudioDataAdapter {
    analyser = null;
    audioContext = null;
    audioApiAdapter;
    stream = null;
    constructor(audioApiAdapter){
        this.audioApiAdapter = audioApiAdapter || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$BrowserApiAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BrowserApiAdapterFactory"].createAudioAdapter();
    }
    // Метод для установки анализатора из TunerService
    setAnalyser(analyser, audioContext) {
        this.analyser = analyser;
        this.audioContext = audioContext;
    }
    // Метод для создания анализатора, если он не был установлен извне
    ensureAnalyser() {
        if (!this.analyser || !this.audioContext) {
            console.log('[WebAudioDataAdapter] Создание AudioContext и AnalyserNode');
            this.audioContext = this.audioApiAdapter.createAudioContext();
            this.analyser = this.audioApiAdapter.createAnalyser(this.audioContext);
            console.log('[WebAudioDataAdapter] ВНИМАНИЕ: AnalyserNode создан, но не подключен к источнику аудио!');
        }
    }
    getFloatTimeDomainData(buffer) {
        if (this.analyser) {
            // Проверяем, подключен ли анализатор к какому-либо источнику
            const hasData = this.checkForAudioData();
            if (!hasData) {
                console.warn('[WebAudioDataAdapter] ОШИБКА: AnalyserNode не подключен к источнику аудио!');
            }
            this.analyser.getFloatTimeDomainData(buffer);
        }
    }
    // Вспомогательный метод для проверки наличия аудиоданных
    checkForAudioData() {
        if (!this.analyser) return false;
        // Проверяем, есть ли какие-либо данные в анализаторе
        const tempBuffer = new Float32Array(128);
        this.analyser.getFloatTimeDomainData(tempBuffer);
        // Проверяем, есть ли ненулевые значения
        let hasSignal = false;
        for(let i = 0; i < tempBuffer.length; i++){
            if (tempBuffer[i] !== 0) {
                hasSignal = true;
                break;
            }
        }
        return hasSignal;
    }
    getSampleRate() {
        return this.audioContext?.sampleRate || 44100;
    }
    async connectMicrophone() {
        this.ensureAnalyser();
        if (!this.audioContext || !this.analyser) {
            throw new Error('AudioContext or Analyser not initialized');
        }
        try {
            this.stream = await this.audioApiAdapter.getUserMedia();
            const source = this.audioApiAdapter.createMediaStreamSource(this.audioContext, this.stream);
            source.connect(this.analyser);
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            console.log('[WebAudioDataAdapter] Микрофон успешно подключен');
        } catch (error) {
            console.error('[WebAudioDataAdapter] Ошибка подключения микрофона:', error);
            throw error;
        }
    }
    disconnectMicrophone() {
        if (this.stream) {
            this.stream.getTracks().forEach((track)=>track.stop());
            this.stream = null;
            console.log('[WebAudioDataAdapter] Микрофон отключен');
        }
    }
}
// Адаптер для Animation на основе AnimationApiAdapter
class WebAnimationAdapter {
    animationApiAdapter;
    constructor(animationApiAdapter){
        this.animationApiAdapter = animationApiAdapter;
    }
    requestAnimationFrame(callback) {
        return this.animationApiAdapter.requestAnimationFrame(callback);
    }
    cancelAnimationFrame(id) {
        this.animationApiAdapter.cancelAnimationFrame(id);
    }
}
class TunerAdapter {
    tunerCore;
    audioDataAdapter;
    animationAdapter;
    buffer;
    stopContinuousAnalysis = null;
    isRunning = false;
    constructor(animationApiAdapter, audioApiAdapter){
        this.tunerCore = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$tuner$2f$TunerCore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TunerCore"]();
        this.audioDataAdapter = new WebAudioDataAdapter(audioApiAdapter);
        this.animationAdapter = new WebAnimationAdapter(animationApiAdapter || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$BrowserApiAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BrowserApiAdapterFactory"].createAnimationAdapter());
        this.buffer = new Float32Array(2048);
    }
    // Инициализация адаптера
    async initialize() {
        console.log('[TunerAdapter] Инициализация адаптера тюнера');
        // Убеждаемся, что у нас есть анализатор
        this.audioDataAdapter.ensureAnalyser();
        console.log('[TunerAdapter] Анализатор создан, но нет подключения к микрофону');
    }
    // Делегируем вызовы к TunerCore
    analyzeFrequency(frequency) {
        return this.tunerCore.analyzeFrequency(frequency);
    }
    analyzeFrequencyForGuitar(frequency) {
        return this.tunerCore.analyzeFrequencyForGuitar(frequency);
    }
    getClosestGuitarNote(pitch) {
        return this.tunerCore.getClosestGuitarNote(pitch);
    }
    getGuitarNotes() {
        return this.tunerCore.getGuitarNotes();
    }
    frequencyFromNoteNumber(note) {
        return this.tunerCore.frequencyFromNoteNumber(note);
    }
    autoCorrelate(buf, sampleRate) {
        return this.tunerCore.autoCorrelate(buf, sampleRate);
    }
    // Методы для работы с адаптером
    async start() {
        console.log('[TunerAdapter] Запуск тюнера');
        this.isRunning = true;
        await this.initialize();
        await this.audioDataAdapter.connectMicrophone();
    }
    stop() {
        console.log('[TunerAdapter] Остановка тюнера');
        this.isRunning = false;
        // Останавливаем непрерывный анализ, если он запущен
        if (this.stopContinuousAnalysis) {
            this.stopContinuousAnalysis();
            this.stopContinuousAnalysis = null;
        }
        this.audioDataAdapter.disconnectMicrophone();
    }
    async getPitch() {
        // Возвращаем null, так как анализ должен выполняться через непрерывный анализ
        return null;
    }
    startContinuousAnalysis(callback) {
        console.log('[TunerAdapter] Запуск непрерывного анализа');
        // Останавливаем предыдущий анализ, если он был запущен
        if (this.stopContinuousAnalysis) {
            this.stopContinuousAnalysis();
        }
        // Проверяем, есть ли анализатор
        if (!this.audioDataAdapter['analyser']) {
            console.error('[TunerAdapter] ОШИБКА: AnalyserNode не инициализирован!');
        }
        // Запускаем непрерывный анализ через TunerCore
        this.stopContinuousAnalysis = this.tunerCore.startContinuousAnalysis(this.audioDataAdapter, this.animationAdapter, this.buffer, (result)=>{
            // console.log('[TunerAdapter] Результат анализа:', result); // Слишком много логов
            callback(result);
        }, ()=>this.isRunning);
        console.log('[TunerAdapter] Анализ запущен');
    }
    // Метод оставлен для совместимости, но не выполняет функционал
    startTunerServiceAnalysis(callback) {
        console.warn('startTunerServiceAnalysis не поддерживается без прямой зависимости от TunerService');
    }
    // Дополнительные методы для доступа к TunerCore
    getTunerCore() {
        return this.tunerCore;
    }
    // Метод для получения состояния
    isAudioRunning() {
        return this.isRunning;
    }
    // Метод для переключения между режимами анализа
    useTunerCoreAnalysis(useCore) {
        // Здесь можно реализовать переключение между использованием
        // TunerCore и TunerService для анализа
        if (useCore) {
            console.log('Using TunerCore for analysis');
        } else {
            console.log('Using TunerService for analysis');
        }
    }
}
const tunerAdapter = new TunerAdapter();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/tuner/services/TunerService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TunerService",
    ()=>TunerService,
    "tunerService",
    ()=>tunerService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/adapters/TunerAdapter.ts [app-client] (ecmascript)");
;
class TunerService {
    isRunning = false;
    async start() {
        console.log('[TunerService] Запуск тюнера');
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].start();
        this.isRunning = true;
    }
    stop() {
        console.log('[TunerService] Остановка тюнера');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].stop();
        this.isRunning = false;
    }
    async getPitch() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].getPitch();
    }
    startContinuousAnalysis(callback) {
        console.log('[TunerService] Запуск непрерывного анализа');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].startContinuousAnalysis(callback);
    }
    // Методы для прямого использования TunerCore
    analyzeFrequency(frequency) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].analyzeFrequency(frequency);
    }
    analyzeFrequencyForGuitar(frequency) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].analyzeFrequencyForGuitar(frequency);
    }
    getClosestGuitarNote(pitch) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].getClosestGuitarNote(pitch);
    }
    getGuitarNotes() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].getGuitarNotes();
    }
    frequencyFromNoteNumber(note) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].frequencyFromNoteNumber(note);
    }
    autoCorrelate(buf, sampleRate) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].autoCorrelate(buf, sampleRate);
    }
    isAudioRunning() {
        return this.isRunning;
    }
    // Метод для переключения между режимами анализа
    useTunerCoreAnalysis(useCore) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].useTunerCoreAnalysis(useCore);
    }
    // Метод для прямого использования TunerService
    startTunerServiceAnalysis(callback) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$adapters$2f$TunerAdapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerAdapter"].startTunerServiceAnalysis(callback);
    }
}
const tunerService = new TunerService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/tuner/components/TunerDisplay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TunerDisplay",
    ()=>TunerDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const TunerDisplay = ({ currentNote, currentFrequency, currentDetune, pointerPosition, isInTune })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `text-6xl font-bold mb-2 transition-colors ${isInTune ? 'text-green-400' : 'text-white'}`,
                children: currentNote
            }, void 0, false, {
                fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-slate-400 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl",
                        children: currentFrequency
                    }, void 0, false, {
                        fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    " Hz"
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-5 bg-slate-700 rounded-full relative mb-2 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute top-0 w-1 h-full transition-all duration-100 ${isInTune ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-white'}`,
                    style: {
                        left: `${pointerPosition}%`,
                        transform: 'translateX(-50%)'
                    }
                }, void 0, false, {
                    fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between w-full px-2 mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-slate-500",
                        children: "-50"
                    }, void 0, false, {
                        fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-slate-500",
                        children: "0"
                    }, void 0, false, {
                        fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-slate-500",
                        children: "+50"
                    }, void 0, false, {
                        fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-slate-400 text-sm",
                children: [
                    currentDetune,
                    " cents"
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/tuner/components/TunerDisplay.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = TunerDisplay;
var _c;
__turbopack_context__.k.register(_c, "TunerDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/tuner/components/TunerControls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TunerControls",
    ()=>TunerControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const TunerControls = ({ isRunning, mode, onToggle, onModeChange })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggle,
                className: `w-full py-3 px-4 rounded-lg font-medium transition-colors ${isRunning ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`,
                children: isRunning ? 'Выключить микрофон' : 'Включить микрофон'
            }, void 0, false, {
                fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center gap-6 mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center cursor-pointer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                name: "mode",
                                value: "chromatic",
                                checked: mode === 'chromatic',
                                onChange: (e)=>onModeChange(e.target.value),
                                className: "mr-2 text-blue-600 focus:ring-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-slate-300",
                                children: "Хроматический"
                            }, void 0, false, {
                                fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center cursor-pointer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                name: "mode",
                                value: "guitar",
                                checked: mode === 'guitar',
                                onChange: (e)=>onModeChange(e.target.value),
                                className: "mr-2 text-blue-600 focus:ring-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-slate-300",
                                children: "Гитара (EADGBE)"
                            }, void 0, false, {
                                fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/tuner/components/TunerControls.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = TunerControls;
var _c;
__turbopack_context__.k.register(_c, "TunerControls");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/tuner/TunerClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TunerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$tunerSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/tunerSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$tuner$2f$services$2f$TunerService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/tuner/services/TunerService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$tuner$2f$components$2f$TunerDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/tuner/components/TunerDisplay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$tuner$2f$components$2f$TunerControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/tuner/components/TunerControls.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function TunerPage() {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const { isRunning, mode, error, currentNote, currentFrequency, currentDetune, pointerPosition, isInTune } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "TunerPage.useAppSelector": (state)=>state.tuner
    }["TunerPage.useAppSelector"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TunerPage.useEffect": ()=>{
            // Cleanup on unmount
            return ({
                "TunerPage.useEffect": ()=>{
                    if (isRunning) {
                        stopTunerService();
                    }
                }
            })["TunerPage.useEffect"];
        }
    }["TunerPage.useEffect"], [
        isRunning
    ]);
    const startTunerService = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$tuner$2f$services$2f$TunerService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerService"].start();
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$tunerSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startTuner"])());
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$tuner$2f$services$2f$TunerService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerService"].startContinuousAnalysis((result)=>{
                if (result) {
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$tunerSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateTunerResult"])(result));
                }
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to start tuner';
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$tunerSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTunerError"])(errorMessage));
        }
    };
    const stopTunerService = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$tuner$2f$services$2f$TunerService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tunerService"].stop();
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$tunerSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopTuner"])());
    };
    const handleModeChange = (newMode)=>{
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$tunerSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTunerMode"])(newMode));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-900 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-slate-800/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-white mb-6 text-center",
                    children: "Guitar Tuner"
                }, void 0, false, {
                    fileName: "[project]/src/app/tuner/TunerClient.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/tuner/TunerClient.tsx",
                    lineNumber: 61,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$tuner$2f$components$2f$TunerControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TunerControls"], {
                    isRunning: isRunning,
                    mode: mode,
                    onToggle: isRunning ? stopTunerService : startTunerService,
                    onModeChange: handleModeChange
                }, void 0, false, {
                    fileName: "[project]/src/app/tuner/TunerClient.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$tuner$2f$components$2f$TunerDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TunerDisplay"], {
                    currentNote: currentNote,
                    currentFrequency: currentFrequency,
                    currentDetune: currentDetune,
                    pointerPosition: pointerPosition,
                    isInTune: isInTune
                }, void 0, false, {
                    fileName: "[project]/src/app/tuner/TunerClient.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/tuner/TunerClient.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/tuner/TunerClient.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(TunerPage, "uD5QG/0dxp2HsjrZlWMsolxQWOU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c = TunerPage;
var _c;
__turbopack_context__.k.register(_c, "TunerPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_dade77c3._.js.map