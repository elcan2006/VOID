document.addEventListener('DOMContentLoaded', () => {
    requireAuth(); // Ensure logged in

    // Input handling
    ['inputHours', 'inputMinutes', 'inputSeconds'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') setAndStartTimer();
            });
            input.addEventListener('wheel', function (e) {
                e.preventDefault();
                let val = parseInt(this.value) || 0;
                const min = parseInt(this.min) || 0;
                const max = parseInt(this.max) || 59;
                if (e.deltaY < 0) val = val + 1 > max ? max : val + 1;
                else val = val - 1 < min ? min : val - 1;
                this.value = val.toString().padStart(2, '0');
            }, { passive: false });
            input.addEventListener('input', function () {
                if (this.value.length > 2) this.value = this.value.slice(0, 2);
            });
        }
    });
});

let timerInterval;
let timeLeft = 0;

window.setQuickTimer = function (minutes) {
    if (typeof timerInterval !== 'undefined') clearInterval(timerInterval);
    const errorEl = document.getElementById('timerError');
    if (errorEl) errorEl.style.opacity = '0';

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    document.getElementById('inputHours').value = h.toString().padStart(2, '0');
    document.getElementById('inputMinutes').value = m.toString().padStart(2, '0');
    document.getElementById('inputSeconds').value = '00';
}

window.setAndStartTimer = function () {
    const h = parseInt(document.getElementById('inputHours').value) || 0;
    const m = parseInt(document.getElementById('inputMinutes').value) || 0;
    const s = parseInt(document.getElementById('inputSeconds').value) || 0;

    timeLeft = (h * 3600) + (m * 60) + s;

    if (timeLeft <= 0) {
        const errorEl = document.getElementById('timerError');
        const t = translations[currentLanguage];
        errorEl.innerText = t.timerError;
        errorEl.style.opacity = '1';
        return;
    }

    const errorEl = document.getElementById('timerError');
    if (errorEl) {
        errorEl.style.opacity = '0';
        errorEl.innerText = '';
    }

    const countdownContainer = document.getElementById('countdownContainer');
    countdownContainer.style.display = 'flex';
    document.body.classList.add('timer-active');

    requestAnimationFrame(() => {
        countdownContainer.classList.add('active');
    });

    updateCountdownDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateCountdownDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishTimerAndShowNotes();
        }
    }, 1000);
}

function updateCountdownDisplay() {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    document.getElementById('countdown').innerText =
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function finishTimerAndShowNotes() {
    clearInterval(timerInterval);

    document.getElementById('inputHours').value = '';
    document.getElementById('inputMinutes').value = '';
    document.getElementById('inputSeconds').value = '';

    document.body.classList.remove('timer-active');
    const countdownContainer = document.getElementById('countdownContainer');
    countdownContainer.classList.remove('active');

    // REDUCED DELAY: 200ms instead of 2000ms
    setTimeout(() => {
        countdownContainer.style.display = 'none';
        const modal = document.getElementById('completionModal');
        modal.style.display = 'flex';
        modal.offsetHeight; // Force reflow
        modal.classList.add('active');
        document.getElementById('modalNote').focus();
    }, 200);
}

window.resetToPicker = function (skipClear = false) {
    if (!skipClear) clearInterval(timerInterval);
    document.body.classList.remove('timer-active');
    const countdownContainer = document.getElementById('countdownContainer');
    countdownContainer.classList.remove('active');
    countdownContainer.style.display = 'none';

    // Ensure picker is visible
    const pickerContainer = document.getElementById('stopwatchContainer');
    pickerContainer.style.opacity = '1';
}

window.saveAndCloseModal = function () {
    const noteText = document.getElementById('modalNote').value.trim();
    const noteTitle = document.getElementById('modalNoteTitle').value.trim();

    if (noteText) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('az-AZ');

        let displayTitle = noteTitle;
        if (!displayTitle) {
            const t = translations[currentLanguage];
            // Fallback if translations not loaded, though they should be
            displayTitle = currentLanguage === 'az' ? 'Adsız Qeyd' : (currentLanguage === 'tr' ? 'Adsız Not' : 'Untitled Note');
        }

        let notes = JSON.parse(localStorage.getItem('voidNotes') || '[]');
        notes.unshift({
            title: displayTitle,
            date: dateStr,
            content: noteText,
            timestamp: now.getTime()
        });
        localStorage.setItem('voidNotes', JSON.stringify(notes));
    }

    document.getElementById('modalNote').value = '';
    document.getElementById('modalNoteTitle').value = '';

    const modal = document.getElementById('completionModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        resetToPicker(true);
    }, 300);
}
