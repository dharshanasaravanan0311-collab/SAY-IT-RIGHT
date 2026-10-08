// Client Application Logic for Say It Right - Multilingual Communication Mentor

let currentScenarios = [];
let selectedScenario = null;
let currentAnalysisResult = null;
let selectedTargetFormat = 'email'; // 'email' | 'whatsapp' | 'letter'
let selectedTone = 'Formal';
let speechRecognition = null;
let isRecording = false;

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    initSettings();
    initSpeechRecognition();
    await checkHealth();
    await loadScenarios();
    setupEventListeners();
});

// Initialize Speech Recognition (Web Speech API)
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        const micLabel = document.getElementById('mic-status-label');
        if (micLabel) micLabel.innerText = "Voice-to-Text not supported in this browser";
        return;
    }

    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;

    speechRecognition.onstart = () => {
        isRecording = true;
        updateMicUI(true);
    };

    speechRecognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        const textarea = document.getElementById('raw-draft-input');
        if (event.results[event.results.length - 1].isFinal) {
            textarea.value = (textarea.value ? textarea.value.trim() + ' ' : '') + transcript.trim();
        }
        updateCharCounter();
        detectInputLanguage(textarea.value);
    };

    speechRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
        showToast(`Voice error: ${event.error}`);
    };

    speechRecognition.onend = () => {
        isRecording = false;
        updateMicUI(false);
    };
}

function toggleRecording() {
    if (!speechRecognition) {
        showToast('Voice-to-Text requires Chrome, Edge, or a Web Speech compatible browser.');
        return;
    }

    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    const lang = document.getElementById('voice-lang-select').value || 'en-IN';
    speechRecognition.lang = lang;
    try {
        speechRecognition.start();
    } catch (err) {
        console.error('Failed to start speech:', err);
    }
}

function stopRecording() {
    if (speechRecognition && isRecording) {
        speechRecognition.stop();
    }
}

function updateMicUI(recording) {
    const micBtn = document.getElementById('mic-btn');
    const micLabel = document.getElementById('mic-status-label');
    if (recording) {
        micBtn.className = "w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center transition shadow-md animate-pulse";
        micLabel.innerText = "Listening... Speak now";
        micLabel.className = "text-rose-600 font-bold animate-pulse text-xs";
    } else {
        micBtn.className = "w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition shadow-sm";
        micLabel.innerText = "Click mic to speak";
        micLabel.className = "text-slate-600 font-medium text-xs";
    }
}

// Check Server Health
async function checkHealth() {
    try {
        const res = await fetch('/api/health');
        if (res.ok) {
            const data = await res.json();
            const statusDot = document.getElementById('engine-badge-dot');
            const statusText = document.getElementById('engine-status-text');

            const localKey = localStorage.getItem('say_it_right_api_key');
            if (data.gemini_configured || (localKey && localKey.trim())) {
                statusDot.className = "w-2 h-2 rounded-full bg-indigo-500 animate-pulse";
                statusText.innerText = "Gemini 2.5 Flash Ready";
            } else {
                statusDot.className = "w-2 h-2 rounded-full bg-emerald-500";
                statusText.innerText = "Mentor Heuristic Ready";
            }
        }
    } catch (err) {
        console.warn('Health check warning:', err);
    }
}

// Fetch Preloaded Scenarios
async function loadScenarios() {
    try {
        const res = await fetch('/api/scenarios');
        const data = await res.json();
        currentScenarios = data.scenarios || [];
        document.getElementById('scenario-count').innerText = currentScenarios.length;
        renderScenarioPills('all');
        if (currentScenarios.length > 0) {
            selectScenario(currentScenarios[0]);
        }
    } catch (err) {
        console.error('Failed to load scenarios:', err);
    }
}

function renderScenarioPills(category) {
    const container = document.getElementById('scenario-pills-container');
    container.innerHTML = '';

    const filtered = category === 'all' 
        ? currentScenarios 
        : currentScenarios.filter(s => s.category.toLowerCase() === category.toLowerCase());

    filtered.forEach(scenario => {
        const isSelected = selectedScenario && selectedScenario.id === scenario.id;
        const btn = document.createElement('button');
        btn.className = `flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
            isSelected 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`;
        
        let iconName = scenario.category_icon || 'message-square';
        btn.innerHTML = `<i data-lucide="${iconName}" class="w-3.5 h-3.5"></i><span>${scenario.title}</span>`;
        btn.onclick = () => selectScenario(scenario);
        container.appendChild(btn);
    });

    lucide.createIcons();
}

function selectScenario(scenario) {
    selectedScenario = scenario;
    renderScenarioPills(getCurrentActiveCategory());

    document.getElementById('brief-recipient-role').innerText = scenario.recipient_role;
    document.getElementById('brief-mindset-text').innerText = scenario.recipient_mindset;
    document.getElementById('brief-stakes-badge').innerText = `${scenario.stakes} Stakes`;

    const pitfallsContainer = document.getElementById('brief-pitfalls-container');
    pitfallsContainer.innerHTML = '';
    (scenario.common_pitfalls || []).forEach(pitfall => {
        const pill = document.createElement('span');
        pill.className = "px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 font-medium";
        pill.innerText = `⚠️ ${pitfall}`;
        pitfallsContainer.appendChild(pill);
    });

    document.getElementById('input-recipient').value = scenario.recipient_role;
    updateCharCounter();
    lucide.createIcons();
}

function getCurrentActiveCategory() {
    const activeBtn = document.querySelector('.category-filter-btn.bg-white');
    return activeBtn ? activeBtn.getAttribute('data-cat') : 'all';
}

// Event Listeners Setup
function setupEventListeners() {
    // Format Selection Buttons (Step 1 Guardrail)
    document.querySelectorAll('.format-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.format-choice-btn').forEach(b => {
                b.className = "format-choice-btn py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs flex flex-col items-center justify-center hover:border-indigo-300 hover:bg-slate-50 transition";
            });
            btn.className = "format-choice-btn py-2 px-3 rounded-xl border border-indigo-600 bg-indigo-50 text-indigo-700 font-bold text-xs flex flex-col items-center justify-center transition shadow-sm";
            selectedTargetFormat = btn.getAttribute('data-format');
        });
    });

    // Voice Mic Toggle
    document.getElementById('mic-btn').addEventListener('click', toggleRecording);

    // Category Tabs
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-filter-btn').forEach(b => {
                b.classList.remove('bg-white', 'shadow-sm', 'font-semibold', 'text-indigo-600');
                b.classList.add('text-slate-600');
            });
            btn.classList.add('bg-white', 'shadow-sm', 'font-semibold', 'text-indigo-600');
            btn.classList.remove('text-slate-600');
            renderScenarioPills(btn.getAttribute('data-cat'));
        });
    });

    // Preset Fill
    document.getElementById('load-preset-btn').addEventListener('click', () => {
        if (selectedScenario && selectedScenario.sample_raw_draft) {
            const textarea = document.getElementById('raw-draft-input');
            textarea.value = selectedScenario.sample_raw_draft;
            updateCharCounter();
            detectInputLanguage(textarea.value);
            textarea.focus();
        }
    });

    // Textarea input
    const textarea = document.getElementById('raw-draft-input');
    textarea.addEventListener('input', () => {
        updateCharCounter();
        detectInputLanguage(textarea.value);
    });

    // Clear
    document.getElementById('clear-input-btn').addEventListener('click', () => {
        document.getElementById('raw-draft-input').value = '';
        updateCharCounter();
        document.getElementById('detected-lang-pill').classList.add('hidden');
    });

    // Tone select
    document.getElementById('input-tone').addEventListener('change', (e) => {
        selectedTone = e.target.value;
    });

    // Target Output Language select: dynamically adapts existing results
    const targetLangSelect = document.getElementById('input-target-lang');
    if (targetLangSelect) {
        targetLangSelect.addEventListener('change', () => {
            const draft = document.getElementById('raw-draft-input').value.trim();
            if (draft && !document.getElementById('coach-results').classList.contains('hidden')) {
                showToast(`Adapting output to ${targetLangSelect.value}...`);
                handleAnalyze();
            }
        });
    }

    // Analyze CTA
    document.getElementById('analyze-btn').addEventListener('click', () => handleAnalyze());
}

function updateCharCounter() {
    const text = document.getElementById('raw-draft-input').value || '';
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('char-counter').innerText = `${wordCount} words (${charCount} chars)`;
}

// Simple Client-side Language Detection for immediate visual feedback
function detectInputLanguage(text) {
    const pill = document.getElementById('detected-lang-pill');
    if (!text.trim()) {
        pill.classList.add('hidden');
        return;
    }

    const hinglishRegex = /\b(bhai|sir|aap|tum|mera|meri|mujhe|kal|urgent|kaam|ho gaya|nahi hua|kar do|kar dijiye|dhanyawad|namaste|vanakkam)\b/i;
    const devanagariRegex = /[\u0900-\u097F]/;
    const tamilRegex = /[\u0B80-\u0BFF]/;
    const teluguRegex = /[\u0C00-\u0C7F]/;
    const bengaliRegex = /[\u0980-\u09FF]/;

    if (devanagariRegex.test(text)) {
        pill.innerText = "🇮🇳 Hindi (हिन्दी) Detected";
        pill.classList.remove('hidden');
    } else if (tamilRegex.test(text)) {
        pill.innerText = "🇮🇳 Tamil (தமிழ்) Detected";
        pill.classList.remove('hidden');
    } else if (teluguRegex.test(text)) {
        pill.innerText = "🇮🇳 Telugu (తెలుగు) Detected";
        pill.classList.remove('hidden');
    } else if (bengaliRegex.test(text)) {
        pill.innerText = "🇮🇳 Bengali (বাংলা) Detected";
        pill.classList.remove('hidden');
    } else if (hinglishRegex.test(text)) {
        pill.innerText = "🇮🇳 Hinglish Detected";
        pill.classList.remove('hidden');
    } else {
        pill.innerText = "English (Ready)";
        pill.classList.remove('hidden');
    }
}

// Analyze Handler
async function handleAnalyze(overrideTone) {
    const rawDraft = document.getElementById('raw-draft-input').value.trim();
    if (!rawDraft) {
        showToast('Please speak or type your rough message first!');
        document.getElementById('raw-draft-input').focus();
        return;
    }

    const recipientRole = document.getElementById('input-recipient').value.trim() || 'Authority Figure';
    const activeTone = overrideTone || document.getElementById('input-tone').value;
    const targetLanguage = document.getElementById('input-target-lang') ? document.getElementById('input-target-lang').value : 'English';
    const customApiKey = localStorage.getItem('say_it_right_api_key');

    const payload = {
        raw_draft: rawDraft,
        context: {
            scenario_id: selectedScenario ? selectedScenario.id : 'custom',
            scenario_title: selectedScenario ? selectedScenario.title : 'High-Stakes Message',
            recipient_role: recipientRole,
            target_format: selectedTargetFormat,
            target_tone: activeTone,
            target_language: targetLanguage,
            goal: selectedScenario ? selectedScenario.subtitle : 'Communication Request'
        },
        api_key: customApiKey
    };

    document.getElementById('coach-placeholder').classList.add('hidden');
    document.getElementById('coach-results').classList.add('hidden');
    document.getElementById('coach-loading').classList.remove('hidden');

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Server error');
        }

        const data = await response.json();
        currentAnalysisResult = data;
        renderAnalysisResults(data);
    } catch (err) {
        console.error('Analysis failed:', err);
        showToast(`Error: ${err.message}`);
        document.getElementById('coach-placeholder').classList.remove('hidden');
    } finally {
        document.getElementById('coach-loading').classList.add('hidden');
    }
}

// Render Results
function renderAnalysisResults(data) {
    const diag = data.diagnostic || {};
    const playbook = data.follow_up_playbook || {};

    // Language badge
    const langBadge = document.getElementById('output-lang-badge');
    const outLang = data.target_language || (document.getElementById('input-target-lang') ? document.getElementById('input-target-lang').value : 'English');
    if (data.detected_language) {
        langBadge.innerText = `🌐 Ingested: ${data.detected_language} ➔ Output: ${outLang}`;
    }

    // Readiness score
    const readiness = diag.readiness_score || 55;
    const readinessEl = document.getElementById('metric-readiness');
    const labelEl = document.getElementById('metric-readiness-label');
    readinessEl.innerText = readiness;

    if (readiness >= 75) {
        readinessEl.className = "text-4xl font-extrabold text-emerald-600";
        labelEl.innerText = "High Impact & Ready";
        labelEl.className = "mt-1 text-xs font-semibold text-emerald-600";
    } else if (readiness >= 50) {
        readinessEl.className = "text-4xl font-extrabold text-indigo-600";
        labelEl.innerText = "Polished & Calibrated";
        labelEl.className = "mt-1 text-xs font-semibold text-indigo-600";
    } else {
        readinessEl.className = "text-4xl font-extrabold text-rose-600";
        labelEl.innerText = "High Misinterpretation Risk";
        labelEl.className = "mt-1 text-xs font-semibold text-rose-600";
    }

    // Tone Metrics
    const metrics = diag.tone_metrics || { clarity: 4, warmth: 3, assertiveness: 3, deference: 4 };
    renderMetricBar('clarity', metrics.clarity || 4);
    renderMetricBar('warmth', metrics.warmth || 3);
    renderMetricBar('assertiveness', metrics.assertiveness || 3);
    renderMetricBar('deference', metrics.deference || 4);

    // Anti-Patterns
    const antiContainer = document.getElementById('anti-patterns-container');
    antiContainer.innerHTML = '';
    (diag.anti_patterns || []).forEach(ap => {
        const item = document.createElement('div');
        item.className = "p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs space-y-1";
        item.innerHTML = `
            <div class="flex items-center space-x-1.5 font-bold text-amber-900">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-600"></i>
                <span>Anti-Pattern: ${ap.name}</span>
            </div>
            ${ap.snippet ? `<div class="italic text-slate-500 font-mono text-[11px]">"${ap.snippet}"</div>` : ''}
            <div class="text-amber-800/90 leading-relaxed font-normal">${ap.why_it_hurts}</div>
        `;
        antiContainer.appendChild(item);
    });

    // Render Current Platform Format
    switchResultFormat(selectedTargetFormat);

    // Playbook
    document.getElementById('playbook-nudge').innerText = playbook.if_no_response || 'Hi, gently following up on my previous message. Thank you!';
    document.getElementById('playbook-rejected').innerText = playbook.if_rejected || 'Thank you for letting me know. I completely understand and appreciate your response.';

    document.getElementById('coach-results').classList.remove('hidden');
    lucide.createIcons();

    if (window.innerWidth < 1024) {
        document.getElementById('coach-results').scrollIntoView({ behavior: 'smooth' });
    }
}

function renderMetricBar(id, value) {
    const percent = Math.min(100, Math.max(10, (value / 5) * 100));
    document.getElementById(`bar-${id}`).style.width = `${percent}%`;
    document.getElementById(`label-${id}`).innerText = `${value} / 5`;
}

// Switch Result Platform Format
function switchResultFormat(formatName) {
    selectedTargetFormat = formatName;
    ['email', 'whatsapp', 'letter'].forEach(f => {
        const tab = document.getElementById(`tab-format-${f}`);
        if (f === formatName) {
            tab.className = "px-2.5 py-1 rounded-md bg-white shadow-sm font-semibold text-indigo-600 transition";
        } else {
            tab.className = "px-2.5 py-1 rounded-md hover:text-indigo-600 transition text-slate-600";
        }
    });

    if (!currentAnalysisResult || !currentAnalysisResult.calibrated_rewrites) return;
    const rewrites = currentAnalysisResult.calibrated_rewrites;
    let matching = rewrites.find(r => r.format === formatName) || rewrites[0];

    const iconEl = document.getElementById('active-format-title-icon');
    const titleEl = document.getElementById('active-format-title');
    const subtitleEl = document.getElementById('active-format-subtitle');
    const subjectBox = document.getElementById('subject-line-box');

    if (formatName === 'email') {
        iconEl.innerText = '📨';
        titleEl.innerText = 'Email Format';
        subtitleEl.innerText = 'Structured with Subject line, greeting, and signature';
        subjectBox.classList.remove('hidden');
        document.getElementById('calibrated-subject').innerText = matching.subject_line || 'Request for Extension';
    } else if (formatName === 'whatsapp') {
        iconEl.innerText = '💬';
        titleEl.innerText = 'WhatsApp Message Format';
        subtitleEl.innerText = 'Compact, engaging spacing, bullet points, and minimal professional emojis';
        subjectBox.classList.add('hidden');
    } else {
        iconEl.innerText = '📝';
        titleEl.innerText = 'Formal Letter Format';
        subtitleEl.innerText = 'Traditional formal layout for physical print or official PDF';
        subjectBox.classList.remove('hidden');
        document.getElementById('calibrated-subject').innerText = matching.subject_line || 'Formal Request Documentation';
    }

    document.getElementById('calibrated-body').innerText = matching.message;

    // Pedagogical Diffs
    const diffsContainer = document.getElementById('diffs-container');
    diffsContainer.innerHTML = '';
    (matching.pedagogical_diffs || []).forEach(diff => {
        const card = document.createElement('div');
        card.className = "diff-card p-3 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs";
        card.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div class="bg-rose-50/60 p-2 rounded-lg border border-rose-100 text-rose-900">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-0.5">Original / Raw:</span>
                    <span class="line-through opacity-80 italic">"${diff.original}"</span>
                </div>
                <div class="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 text-emerald-950 font-medium">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">Polished Phrasing:</span>
                    <span>"${diff.replacement}"</span>
                </div>
            </div>
            <div class="bg-indigo-50/60 p-2 rounded-lg border border-indigo-100/70 space-y-0.5">
                <div class="font-bold text-indigo-900 flex items-center space-x-1">
                    <i data-lucide="book-open" class="w-3 h-3 text-indigo-600"></i>
                    <span>Rule: ${diff.rule_of_thumb}</span>
                </div>
                <p class="text-indigo-950/80 leading-relaxed">${diff.psychology}</p>
            </div>
        `;
        diffsContainer.appendChild(card);
    });

    lucide.createIcons();
}

// STEP 3 GUARDRAIL: Fast Tone Refinement
function refineWithTone(tone) {
    showToast(`Refining output to ${tone} tone...`);
    document.getElementById('input-tone').value = tone;
    handleAnalyze(tone);
}

// Copy to Clipboard
function copyToClipboard(elementId, successMsg) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const textToCopy = el.innerText || el.textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(successMsg || 'Copied to clipboard!');
    }).catch(err => {
        console.error('Clipboard copy failed:', err);
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// Settings Modal
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const savedKey = localStorage.getItem('say_it_right_api_key') || '';
    document.getElementById('api-key-input').value = savedKey;
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function saveApiKeySettings() {
    const key = document.getElementById('api-key-input').value.trim();
    if (key) {
        localStorage.setItem('say_it_right_api_key', key);
        showToast('Gemini API key saved! Live AI activated.');
    } else {
        localStorage.removeItem('say_it_right_api_key');
        showToast('Using Built-in Pedagogical Heuristic Engine.');
    }
    closeSettingsModal();
    checkHealth();
}

function initSettings() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSettingsModal();
            closeWebTour();
        }
    });
}

// Interactive Web Tour Module
let currentTourStep = 1;
const tourSteps = [
    {
        num: 1,
        icon: "🎙️",
        title: "Step 1: The Input Panel",
        desc: "Click the microphone icon to speak in English or any Indian language, or simply type your raw thoughts in the text box."
    },
    {
        num: 2,
        icon: "🌐",
        title: "Step 2: Language Selection",
        desc: "By default, I translate everything into clean English. However, you can explicitly ask me to output in Hindi, Tamil, Spanish, or any language of your choice."
    },
    {
        num: 3,
        icon: "📋",
        title: "Step 3: Format Layouts",
        desc: "Choose your delivery channel: Email 📨, WhatsApp 💬, or Formal Letter 📝. I automatically re-structure the design to fit that platform perfectly."
    },
    {
        num: 4,
        icon: "🔄",
        title: "Step 4: Tone Refinement",
        desc: "After I generate the draft, you can dynamically change its tone (e.g., make it more formal, casual, or urgent) until it is exactly what you need."
    }
];

function startWebTour() {
    const modal = document.getElementById('tour-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    goToTourStep(1);
    lucide.createIcons();
}

function closeWebTour() {
    const modal = document.getElementById('tour-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function goToTourStep(stepNum) {
    currentTourStep = Math.max(1, Math.min(4, stepNum));
    const step = tourSteps[currentTourStep - 1];

    document.getElementById('tour-step-num').innerText = currentTourStep;
    document.getElementById('tour-icon').innerText = step.icon;
    document.getElementById('tour-title').innerText = step.title;
    document.getElementById('tour-description').innerText = step.desc;

    // Update progress dots
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`tour-dot-${i}`);
        if (i === currentTourStep) {
            dot.className = "w-5 h-2.5 rounded-full bg-indigo-600 transition-all";
        } else {
            dot.className = "w-2.5 h-2.5 rounded-full bg-slate-200 transition-all";
        }
    }

    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');

    prevBtn.disabled = currentTourStep === 1;

    if (currentTourStep === 4) {
        nextBtn.innerHTML = "Start Now! 🚀";
        nextBtn.onclick = () => {
            closeWebTour();
            document.getElementById('raw-draft-input').focus();
            showToast('Ready! Speak or type your draft.');
        };
    } else {
        nextBtn.innerHTML = "Next Step →";
        nextBtn.onclick = nextTourStep;
    }
}

function nextTourStep() {
    if (currentTourStep < 4) {
        goToTourStep(currentTourStep + 1);
    }
}

function prevTourStep() {
    if (currentTourStep > 1) {
        goToTourStep(currentTourStep - 1);
    }
}
