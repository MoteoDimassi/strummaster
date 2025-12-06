module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/store/slices/playerSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addMeasure",
    ()=>addMeasure,
    "applyToAllMeasures",
    ()=>applyToAllMeasures,
    "changeStepCount",
    ()=>changeStepCount,
    "default",
    ()=>__TURBOPACK__default__export__,
    "removeMeasure",
    ()=>removeMeasure,
    "reset",
    ()=>reset,
    "saveOnlyInThisMeasure",
    ()=>saveOnlyInThisMeasure,
    "setActiveMeasureIdx",
    ()=>setActiveMeasureIdx,
    "setBpm",
    ()=>setBpm,
    "setCurrentDisplayStepIdx",
    ()=>setCurrentDisplayStepIdx,
    "setIsPlaying",
    ()=>setIsPlaying,
    "updateChordForMeasure",
    ()=>updateChordForMeasure,
    "updateStep",
    ()=>updateStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const generateSteps = (count, chord = 'Am')=>{
    return Array.from({
        length: count
    }, (_, i)=>({
            id: `step-${Date.now()}-${i}`,
            direction: i % 2 === 0 ? 'down' : 'up',
            strumType: i === 0 || i === 2 || i === 4 || i === 6 ? 'strum' : 'ghost',
            chord: chord,
            lyrics: ''
        }));
};
const createMeasure = (id, chord = 'Am')=>({
        id: `measure-${Date.now()}-${id}`,
        steps: generateSteps(8, chord)
    });
const initialState = {
    bpm: 90,
    isPlaying: false,
    measures: [
        createMeasure(0, 'Am')
    ],
    activeMeasureIdx: 0,
    currentDisplayStepIdx: null,
    globalStrumPattern: [],
    hasUnsavedChanges: false
};
const playerSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'player',
    initialState,
    reducers: {
        setBpm: (state, action)=>{
            state.bpm = action.payload;
        },
        setIsPlaying: (state, action)=>{
            state.isPlaying = action.payload;
        },
        setActiveMeasureIdx: (state, action)=>{
            state.activeMeasureIdx = action.payload;
        },
        setCurrentDisplayStepIdx: (state, action)=>{
            state.currentDisplayStepIdx = action.payload;
        },
        addMeasure: (state)=>{
            const currentMeasure = state.measures[state.activeMeasureIdx];
            const newMeasure = {
                id: `measure-${Date.now()}-${state.measures.length}`,
                steps: currentMeasure.steps.map((step)=>({
                        ...step,
                        id: `step-${Date.now()}-${Math.random()}`
                    }))
            };
            state.measures.splice(state.activeMeasureIdx + 1, 0, newMeasure);
            state.activeMeasureIdx += 1;
        },
        removeMeasure: (state)=>{
            if (state.measures.length <= 1) return;
            state.measures = state.measures.filter((_, i)=>i !== state.activeMeasureIdx);
            state.activeMeasureIdx = Math.max(0, state.activeMeasureIdx - 1);
        },
        updateChordForMeasure: (state, action)=>{
            const chord = action.payload;
            state.measures = state.measures.map((m, i)=>{
                if (i === state.activeMeasureIdx) {
                    return {
                        ...m,
                        steps: m.steps.map((s)=>({
                                ...s,
                                chord
                            }))
                    };
                }
                return m;
            });
        },
        updateStep: (state, action)=>{
            const { measureIdx, stepIdx, updates } = action.payload;
            state.measures = state.measures.map((m, i)=>{
                if (i === measureIdx) {
                    const newSteps = [
                        ...m.steps
                    ];
                    newSteps[stepIdx] = {
                        ...newSteps[stepIdx],
                        ...updates
                    };
                    return {
                        ...m,
                        steps: newSteps
                    };
                }
                return m;
            });
            if (measureIdx === state.activeMeasureIdx) {
                state.hasUnsavedChanges = true;
            }
        },
        applyToAllMeasures: (state)=>{
            const currentMeasure = state.measures[state.activeMeasureIdx];
            if (!currentMeasure) return;
            state.globalStrumPattern = [
                ...currentMeasure.steps
            ];
            state.measures = state.measures.map((m)=>{
                const currentChord = m.steps[0]?.chord || 'Am';
                let newSteps = [];
                if (currentMeasure.steps.length > m.steps.length) {
                    newSteps = [
                        ...m.steps
                    ];
                    const stepsToAdd = currentMeasure.steps.length - m.steps.length;
                    for(let i = 0; i < stepsToAdd; i++){
                        newSteps.push({
                            id: `step-added-${Date.now()}-${i}`,
                            direction: (m.steps.length + i) % 2 === 0 ? 'down' : 'up',
                            strumType: 'ghost',
                            chord: currentChord,
                            lyrics: ''
                        });
                    }
                } else {
                    newSteps = m.steps.slice(0, currentMeasure.steps.length);
                }
                newSteps = newSteps.map((step, idx)=>({
                        ...step,
                        strumType: currentMeasure.steps[idx].strumType
                    }));
                return {
                    ...m,
                    steps: newSteps
                };
            });
            state.hasUnsavedChanges = false;
        },
        saveOnlyInThisMeasure: (state)=>{
            state.hasUnsavedChanges = false;
        },
        changeStepCount: (state, action)=>{
            const delta = action.payload;
            state.measures = state.measures.map((m, i)=>{
                if (i === state.activeMeasureIdx) {
                    const currentLen = m.steps.length;
                    const newLen = Math.max(4, Math.min(16, currentLen + delta));
                    const currentChord = m.steps[0]?.chord || 'Am';
                    if (newLen === currentLen) return m;
                    let newSteps = [
                        ...m.steps
                    ];
                    if (newLen > currentLen) {
                        const added = Array.from({
                            length: newLen - currentLen
                        }, (_, k)=>({
                                id: `step-added-${Date.now()}-${k}`,
                                direction: (currentLen + k) % 2 === 0 ? 'down' : 'up',
                                strumType: 'ghost',
                                chord: currentChord,
                                lyrics: ''
                            }));
                        newSteps = [
                            ...newSteps,
                            ...added
                        ];
                    } else {
                        newSteps = newSteps.slice(0, newLen);
                    }
                    state.hasUnsavedChanges = true;
                    return {
                        ...m,
                        steps: newSteps
                    };
                }
                return m;
            });
        },
        reset: (state)=>{
            state.isPlaying = false;
            state.currentDisplayStepIdx = null;
        }
    }
});
const { setBpm, setIsPlaying, setActiveMeasureIdx, setCurrentDisplayStepIdx, addMeasure, removeMeasure, updateChordForMeasure, updateStep, applyToAllMeasures, saveOnlyInThisMeasure, changeStepCount, reset } = playerSlice.actions;
const __TURBOPACK__default__export__ = playerSlice.reducer;
}),
"[project]/src/store/slices/tunerSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTunerError",
    ()=>clearTunerError,
    "closeTuner",
    ()=>closeTuner,
    "default",
    ()=>__TURBOPACK__default__export__,
    "openTuner",
    ()=>openTuner,
    "setTunerError",
    ()=>setTunerError,
    "setTunerMode",
    ()=>setTunerMode,
    "startTuner",
    ()=>startTuner,
    "stopTuner",
    ()=>stopTuner,
    "updateTunerResult",
    ()=>updateTunerResult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    isOpen: false,
    isRunning: false,
    currentNote: "-",
    currentFrequency: 0,
    currentDetune: 0,
    pointerPosition: 50,
    isInTune: false,
    mode: 'chromatic',
    error: null
};
const tunerSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'tuner',
    initialState,
    reducers: {
        openTuner: (state)=>{
            state.isOpen = true;
            state.error = null;
        },
        closeTuner: (state)=>{
            state.isOpen = false;
            state.isRunning = false;
        },
        setTunerMode: (state, action)=>{
            state.mode = action.payload;
            // Reset UI when mode changes
            state.currentNote = "-";
            state.isInTune = false;
            state.currentFrequency = 0;
            state.currentDetune = 0;
            state.pointerPosition = 50;
        },
        startTuner: (state)=>{
            state.isRunning = true;
            state.error = null;
        },
        stopTuner: (state)=>{
            state.isRunning = false;
            // Reset UI when stopping
            state.currentNote = "-";
            state.isInTune = false;
            state.currentFrequency = 0;
            state.currentDetune = 0;
            state.pointerPosition = 50;
        },
        updateTunerResult: (state, action)=>{
            const { note, frequency, cents, isInTune } = action.payload;
            state.currentNote = note;
            state.currentFrequency = frequency;
            state.currentDetune = cents;
            state.isInTune = isInTune;
            // Convert cents (-50 to +50) to percentage (0% to 100%)
            let percent = 50 + cents;
            // Clamp values
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            state.pointerPosition = percent;
        },
        setTunerError: (state, action)=>{
            state.error = action.payload;
            state.isRunning = false;
        },
        clearTunerError: (state)=>{
            state.error = null;
        }
    }
});
const { openTuner, closeTuner, setTunerMode, startTuner, stopTuner, updateTunerResult, setTunerError, clearTunerError } = tunerSlice.actions;
const __TURBOPACK__default__export__ = tunerSlice.reducer;
}),
"[project]/src/entities/measure/model/slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addMeasure",
    ()=>addMeasure,
    "applyToAllMeasures",
    ()=>applyToAllMeasures,
    "changeStepCount",
    ()=>changeStepCount,
    "default",
    ()=>__TURBOPACK__default__export__,
    "measureSlice",
    ()=>measureSlice,
    "removeMeasure",
    ()=>removeMeasure,
    "saveOnlyInThisMeasure",
    ()=>saveOnlyInThisMeasure,
    "setActiveMeasureIdx",
    ()=>setActiveMeasureIdx,
    "updateChordForMeasure",
    ()=>updateChordForMeasure,
    "updateStep",
    ()=>updateStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const generateSteps = (count, chord = 'Am')=>{
    return Array.from({
        length: count
    }, (_, i)=>({
            id: `step-${Date.now()}-${i}`,
            direction: i % 2 === 0 ? 'down' : 'up',
            strumType: i === 0 || i === 2 || i === 4 || i === 6 ? 'strum' : 'ghost',
            chord: chord,
            lyrics: ''
        }));
};
const createMeasure = (id, chord = 'Am')=>({
        id: `measure-${Date.now()}-${id}`,
        steps: generateSteps(8, chord)
    });
const initialState = {
    measures: [
        createMeasure(0, 'Am')
    ],
    activeMeasureIdx: 0,
    globalStrumPattern: [],
    hasUnsavedChanges: false
};
const measureSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'measure',
    initialState,
    reducers: {
        setActiveMeasureIdx: (state, action)=>{
            state.activeMeasureIdx = action.payload;
        },
        addMeasure: (state)=>{
            const currentMeasure = state.measures[state.activeMeasureIdx];
            const newMeasure = {
                id: `measure-${Date.now()}-${state.measures.length}`,
                steps: currentMeasure.steps.map((step)=>({
                        ...step,
                        id: `step-${Date.now()}-${Math.random()}`
                    }))
            };
            state.measures.splice(state.activeMeasureIdx + 1, 0, newMeasure);
            state.activeMeasureIdx += 1;
        },
        removeMeasure: (state)=>{
            if (state.measures.length <= 1) return;
            state.measures = state.measures.filter((_, i)=>i !== state.activeMeasureIdx);
            state.activeMeasureIdx = Math.max(0, state.activeMeasureIdx - 1);
        },
        updateChordForMeasure: (state, action)=>{
            const chord = action.payload;
            state.measures = state.measures.map((m, i)=>{
                if (i === state.activeMeasureIdx) {
                    return {
                        ...m,
                        steps: m.steps.map((s)=>({
                                ...s,
                                chord
                            }))
                    };
                }
                return m;
            });
        },
        updateStep: (state, action)=>{
            const { measureIdx, stepIdx, updates } = action.payload;
            state.measures = state.measures.map((m, i)=>{
                if (i === measureIdx) {
                    const newSteps = [
                        ...m.steps
                    ];
                    newSteps[stepIdx] = {
                        ...newSteps[stepIdx],
                        ...updates
                    };
                    return {
                        ...m,
                        steps: newSteps
                    };
                }
                return m;
            });
            if (measureIdx === state.activeMeasureIdx) {
                state.hasUnsavedChanges = true;
            }
        },
        applyToAllMeasures: (state)=>{
            const currentMeasure = state.measures[state.activeMeasureIdx];
            if (!currentMeasure) return;
            state.globalStrumPattern = [
                ...currentMeasure.steps
            ];
            state.measures = state.measures.map((m)=>{
                const currentChord = m.steps[0]?.chord || 'Am';
                let newSteps = [];
                if (currentMeasure.steps.length > m.steps.length) {
                    newSteps = [
                        ...m.steps
                    ];
                    const stepsToAdd = currentMeasure.steps.length - m.steps.length;
                    for(let i = 0; i < stepsToAdd; i++){
                        newSteps.push({
                            id: `step-added-${Date.now()}-${i}`,
                            direction: (m.steps.length + i) % 2 === 0 ? 'down' : 'up',
                            strumType: 'ghost',
                            chord: currentChord,
                            lyrics: ''
                        });
                    }
                } else {
                    newSteps = m.steps.slice(0, currentMeasure.steps.length);
                }
                newSteps = newSteps.map((step, idx)=>({
                        ...step,
                        strumType: currentMeasure.steps[idx].strumType
                    }));
                return {
                    ...m,
                    steps: newSteps
                };
            });
            state.hasUnsavedChanges = false;
        },
        saveOnlyInThisMeasure: (state)=>{
            state.hasUnsavedChanges = false;
        },
        changeStepCount: (state, action)=>{
            const delta = action.payload;
            state.measures = state.measures.map((m, i)=>{
                if (i === state.activeMeasureIdx) {
                    const currentLen = m.steps.length;
                    const newLen = Math.max(4, Math.min(16, currentLen + delta));
                    const currentChord = m.steps[0]?.chord || 'Am';
                    if (newLen === currentLen) return m;
                    let newSteps = [
                        ...m.steps
                    ];
                    if (newLen > currentLen) {
                        const added = Array.from({
                            length: newLen - currentLen
                        }, (_, k)=>({
                                id: `step-added-${Date.now()}-${k}`,
                                direction: (currentLen + k) % 2 === 0 ? 'down' : 'up',
                                strumType: 'ghost',
                                chord: currentChord,
                                lyrics: ''
                            }));
                        newSteps = [
                            ...newSteps,
                            ...added
                        ];
                    } else {
                        newSteps = newSteps.slice(0, newLen);
                    }
                    state.hasUnsavedChanges = true;
                    return {
                        ...m,
                        steps: newSteps
                    };
                }
                return m;
            });
        }
    }
});
const { setActiveMeasureIdx, addMeasure, removeMeasure, updateChordForMeasure, updateStep, applyToAllMeasures, saveOnlyInThisMeasure, changeStepCount } = measureSlice.actions;
const __TURBOPACK__default__export__ = measureSlice.reducer;
}),
"[project]/src/entities/instrument/model/slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "instrumentSlice",
    ()=>instrumentSlice,
    "reset",
    ()=>reset,
    "setBpm",
    ()=>setBpm,
    "setCurrentDisplayStepIdx",
    ()=>setCurrentDisplayStepIdx,
    "setIsPlaying",
    ()=>setIsPlaying
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    bpm: 90,
    isPlaying: false,
    currentDisplayStepIdx: null
};
const instrumentSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'instrument',
    initialState,
    reducers: {
        setBpm: (state, action)=>{
            state.bpm = action.payload;
        },
        setIsPlaying: (state, action)=>{
            state.isPlaying = action.payload;
        },
        setCurrentDisplayStepIdx: (state, action)=>{
            state.currentDisplayStepIdx = action.payload;
        },
        reset: (state)=>{
            state.isPlaying = false;
            state.currentDisplayStepIdx = null;
        }
    }
});
const { setBpm, setIsPlaying, setCurrentDisplayStepIdx, reset } = instrumentSlice.actions;
const __TURBOPACK__default__export__ = instrumentSlice.reducer;
}),
"[project]/src/entities/tuner/model/slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTunerError",
    ()=>clearTunerError,
    "closeTuner",
    ()=>closeTuner,
    "default",
    ()=>__TURBOPACK__default__export__,
    "openTuner",
    ()=>openTuner,
    "setTunerError",
    ()=>setTunerError,
    "setTunerMode",
    ()=>setTunerMode,
    "startTuner",
    ()=>startTuner,
    "stopTuner",
    ()=>stopTuner,
    "tunerSlice",
    ()=>tunerSlice,
    "updateTunerResult",
    ()=>updateTunerResult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    isOpen: false,
    isRunning: false,
    currentNote: "-",
    currentFrequency: 0,
    currentDetune: 0,
    pointerPosition: 50,
    isInTune: false,
    mode: 'chromatic',
    error: null
};
const tunerSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'tuner',
    initialState,
    reducers: {
        openTuner: (state)=>{
            state.isOpen = true;
            state.error = null;
        },
        closeTuner: (state)=>{
            state.isOpen = false;
            state.isRunning = false;
        },
        setTunerMode: (state, action)=>{
            state.mode = action.payload;
            // Reset UI when mode changes
            state.currentNote = "-";
            state.isInTune = false;
            state.currentFrequency = 0;
            state.currentDetune = 0;
            state.pointerPosition = 50;
        },
        startTuner: (state)=>{
            state.isRunning = true;
            state.error = null;
        },
        stopTuner: (state)=>{
            state.isRunning = false;
            // Reset UI when stopping
            state.currentNote = "-";
            state.isInTune = false;
            state.currentFrequency = 0;
            state.currentDetune = 0;
            state.pointerPosition = 50;
        },
        updateTunerResult: (state, action)=>{
            const { note, frequency, cents, isInTune } = action.payload;
            state.currentNote = note;
            state.currentFrequency = frequency;
            state.currentDetune = cents;
            state.isInTune = isInTune;
            // Convert cents (-50 to +50) to percentage (0% to 100%)
            let percent = 50 + cents;
            // Clamp values
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            state.pointerPosition = percent;
        },
        setTunerError: (state, action)=>{
            state.error = action.payload;
            state.isRunning = false;
        },
        clearTunerError: (state)=>{
            state.error = null;
        }
    }
});
const { openTuner, closeTuner, setTunerMode, startTuner, stopTuner, updateTunerResult, setTunerError, clearTunerError } = tunerSlice.actions;
const __TURBOPACK__default__export__ = tunerSlice.reducer;
}),
"[project]/src/store/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$playerSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/playerSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$tunerSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/tunerSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$measure$2f$model$2f$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/entities/measure/model/slice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$instrument$2f$model$2f$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/entities/instrument/model/slice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$tuner$2f$model$2f$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/entities/tuner/model/slice.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        player: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$playerSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
        tuner: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$tunerSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
        // New slices
        measure: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$measure$2f$model$2f$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
        instrument: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$instrument$2f$model$2f$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
        newTuner: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$tuner$2f$model$2f$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
            serializableCheck: {
            }
        })
});
}),
"[project]/src/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["store"],
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11d1dda8._.js.map