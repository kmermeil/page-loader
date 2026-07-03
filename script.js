// –––––– Progress & Status Logic ––––––
let value = 0;
const fill = document.getElementById('progressFill');
const percentDisplay = document.getElementById('percentDisplay');
const etaDisplay = document.getElementById('eta');
const statusText = document.getElementById('statusText');
const stateValue = document.getElementById('stateValue');

const totalSteps = 100;
const stepMs = 30; // 3 seconds total
const startTime = performance.now();

const statusMessages = [
    'Initializing TPM module',
    'Performing handshake TLS 1.3',
    'Verifying code signature',
    'Loading secure enclave',
    'Synchronizing modules',
    'Finalizing integrity check'
];
let msgIndex = 0;
let lastMsgChange = startTime;

function updateStatus() {
    const now = performance.now();
    if (now - lastMsgChange > 1500 && value < totalSteps) {
        msgIndex = (msgIndex + 1) % statusMessages.length;
        statusText.innerHTML = statusMessages[msgIndex] + '<span class="cursor"></span>';
        const states = ['handshake', 'verify', 'auth', 'loading', 'sync', 'ready'];
        stateValue.textContent = states[msgIndex % states.length];
        lastMsgChange = now;
    }
}

function updateEta() {
    const elapsed = performance.now() - startTime;
    const progress = value / totalSteps;
    if (progress > 0.01) {
        const remaining = Math.max(0, ((1 - progress) * elapsed / progress) / 1000);
        etaDisplay.textContent = remaining.toFixed(1);
    } else {
        etaDisplay.textContent = (totalSteps * stepMs / 1000).toFixed(1);
    }
}

const timer = setInterval(() => {
    value++;
    const pct = Math.min(value, totalSteps);
    fill.style.width = pct + '%';
    percentDisplay.textContent = pct + '%';
    updateEta();
    updateStatus();

    if (value >= totalSteps) {
        clearInterval(timer);
        percentDisplay.textContent = '100%';
        etaDisplay.textContent = '0.0';
        statusText.innerHTML = '✓ Script.sec verified · ready<span class="cursor"></span>';
        stateValue.textContent = 'online';
        window.location.href = 'https://cloudmhax.com/kangerri/';
    }
}, stepMs);
