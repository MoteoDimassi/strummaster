const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Standard Guitar Tuning (E2, A2, D3, G3, B3, E4)
const guitarNotes = [
    { note: "E", octave: 2, freq: 82.41 },
    { note: "A", octave: 2, freq: 110.00 },
    { note: "D", octave: 3, freq: 146.83 },
    { note: "G", octave: 3, freq: 196.00 },
    { note: "B", octave: 3, freq: 246.94 },
    { note: "E", octave: 4, freq: 329.63 }
];

let audioContext = null;
let analyser = null;
let mediaStreamSource = null;
let isRunning = false;
let rafID = null;
let buflen = 2048;
let buf = new Float32Array(buflen);
let currentMode = 'chromatic'; // 'chromatic' or 'guitar'

// UI Elements
const startBtn = document.getElementById('startBtn');
const noteDisplay = document.getElementById('note');
const freqDisplay = document.getElementById('frequency');
const detuneDisplay = document.getElementById('detune');
const pointer = document.getElementById('pointer');
const modeRadios = document.getElementsByName('mode');

// Event Listeners
startBtn.addEventListener('click', toggleTuner);

modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentMode = e.target.value;
        resetUI();
    });
});

function resetUI() {
    noteDisplay.innerText = "-";
    noteDisplay.classList.remove('in-tune');
    freqDisplay.innerText = "0";
    detuneDisplay.innerText = "0 cents";
    pointer.style.left = "50%";
    pointer.classList.remove('in-tune');
}

async function toggleTuner() {
    if (isRunning) {
        stopTuner();
    } else {
        await startTuner();
    }
}

async function startTuner() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        mediaStreamSource = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        mediaStreamSource.connect(analyser);
        
        isRunning = true;
        startBtn.innerText = "Выключить микрофон";
        updatePitch();
    } catch (err) {
        console.error("Error accessing microphone", err);
        alert("Не удалось получить доступ к микрофону. Пожалуйста, проверьте разрешения.");
    }
}

function stopTuner() {
    isRunning = false;
    if (rafID) cancelAnimationFrame(rafID);
    if (audioContext) audioContext.close();
    audioContext = null;
    startBtn.innerText = "Включить микрофон";
    resetUI();
}

function autoCorrelate(buf, sampleRate) {
    // Implements the ACF2+ algorithm
    let SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
        const val = buf[i];
        rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    if (rms < 0.01) // not enough signal
        return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++)
        if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++)
        if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
        for (let j = 0; j < SIZE - i; j++)
            c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
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

function updatePitch() {
    analyser.getFloatTimeDomainData(buf);
    const ac = autoCorrelate(buf, audioContext.sampleRate);

    if (ac !== -1) {
        const pitch = ac;
        freqDisplay.innerText = Math.round(pitch);

        let noteName, cents, isExactMatch = false;

        if (currentMode === 'chromatic') {
            const note = noteFromPitch(pitch);
            noteName = noteStrings[note % 12];
            const detune = centsOffFromPitch(pitch, note);
            cents = detune;
        } else {
            // Guitar Mode
            const result = getClosestGuitarNote(pitch);
            noteName = result.note;
            cents = result.cents;
        }

        updateUI(noteName, cents);
    }

    if (isRunning) {
        rafID = window.requestAnimationFrame(updatePitch);
    }
}

function noteFromPitch(frequency) {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
}

function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

function centsOffFromPitch(frequency, note) {
    return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

function getClosestGuitarNote(pitch) {
    let minDiff = Infinity;
    let closestNote = null;

    guitarNotes.forEach(gNote => {
        const diff = Math.abs(pitch - gNote.freq);
        if (diff < minDiff) {
            minDiff = diff;
            closestNote = gNote;
        }
    });

    // Calculate cents off from the target guitar note
    // Formula: 1200 * log2(measured_freq / target_freq)
    const cents = Math.floor(1200 * Math.log(pitch / closestNote.freq) / Math.log(2));

    return {
        note: closestNote.note, // + closestNote.octave, // Optional: show octave
        cents: cents
    };
}

function updateUI(noteName, cents) {
    noteDisplay.innerText = noteName;
    detuneDisplay.innerText = cents + " cents";

    // Map cents (-50 to +50) to percentage (0% to 100%)
    // 0 cents = 50%
    // -50 cents = 0%
    // +50 cents = 100%
    let percent = 50 + (cents);
    
    // Clamp values
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    pointer.style.left = percent + "%";

    if (Math.abs(cents) < 5) {
        noteDisplay.classList.add('in-tune');
        pointer.classList.add('in-tune');
    } else {
        noteDisplay.classList.remove('in-tune');
        pointer.classList.remove('in-tune');
    }
}