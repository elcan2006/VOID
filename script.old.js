// Star effect
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

let width, height, stars = [];
let animationFrameId;

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    stars = [];
    const starCount = width < 600 ? 50 : 150; // Reduced count for performance
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.3, // Slower for smoother feel
            speedY: (Math.random() - 0.5) * 0.3
        });
    }
}

function animate() {
    // Stop animation if tab is hidden or modals are open to save GPU
    if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); // Batch drawing

    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.moveTo(star.x, star.y);
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
    }

    ctx.fill(); // Single fill call
    animationFrameId = requestAnimationFrame(animate);
}

// Debounce resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(init, 100);
});

init();
animate();

// Tab switching logic
function switchTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginContent = document.getElementById('loginContent');
    const registerContent = document.getElementById('registerContent');

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginContent.classList.add('active');
        registerContent.classList.remove('active');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerContent.classList.add('active');
        loginContent.classList.remove('active');
    }
}

// Language switching
const translations = {
    az: { lang: 'AZ', login: 'Giriş', registerTab: 'Daxil ol', registerTitle: 'Qeydiyyat', email: 'E-poçt', pass: 'Şifrə', user: 'İstifadəçi adı', loginBtn: 'Daxil ol', regBtn: 'Hesab yarat', or: 'və ya', m: 'd', h: 's', startTimer: 'Sakitliyə başla', stopTimer: 'Bitir', navMain: 'Əsas', navNotes: 'Qeydlər', notesTitle: 'Qeydlər', notesPlaceholder: 'Buraya yazın...', timerError: 'Zəhmət olmasa vaxtı düzgün qeyd edin.', modalTitle: 'Necə keçdi?', modalPlaceholder: 'Düşüncələrinizi qeyd edin...', modalBtn: 'Tamam', deleteModalTitle: 'Bu qeydi silmək istəyirsiniz?', deleteBtnCancel: 'Ləğv et', deleteBtnConfirm: 'Sil', modalTitlePlaceholder: 'Başlıq' },
    tr: {
        lang: 'TR',

        login: 'Giriş', registerTab: 'Kayıt Ol', registerTitle: 'Kayıt Ol', email: 'E-posta', pass: 'Şifre', user: 'Kullanıcı adı', loginBtn: 'Giriş yap', regBtn: 'Hesap oluştur', or: 'veya', m: 'd', h: 'sa', startTimer: 'Huzura başla', stopTimer: 'Bitir', navMain: 'Ana', navNotes: 'Notlar', notesTitle: 'Notlar', notesPlaceholder: 'Buraya yazın...', timerError: 'Lütfen zamanı doğru girin.', modalTitle: 'Nasıl geçti?', modalPlaceholder: 'Düşüncelerinizi not edin...', modalBtn: 'Tamam', deleteModalTitle: 'Bu notu silmek istiyor musunuz?', deleteBtnCancel: 'İptal', deleteBtnConfirm: 'Sil', modalTitlePlaceholder: 'Başlık'
    },
    en: { lang: 'EN', login: 'Login', registerTab: 'Sign Up', registerTitle: 'Registration', email: 'Email', pass: 'Password', user: 'Username', loginBtn: 'Login', regBtn: 'Create Account', or: 'or', m: 'm', h: 'h', startTimer: 'Begin Silence', stopTimer: 'Finish', navMain: 'Main', navNotes: 'Notes', notesTitle: 'Notes', notesPlaceholder: 'Type here...', timerError: 'Please enter a valid time.', modalTitle: 'How was it?', modalPlaceholder: 'Record your thoughts...', modalBtn: 'Done', deleteModalTitle: 'Delete this note?', deleteBtnCancel: 'Cancel', deleteBtnConfirm: 'Delete', modalTitlePlaceholder: 'Title' }
};

let currentLanguage = 'az';

function changeLang(lang) {
    currentLanguage = lang; // Store global
    const t = translations[lang];
    if (!t) return;

    // Clear error to avoid stale language
    const errorEl = document.getElementById('timerError');
    if (errorEl) {
        errorEl.style.opacity = '0';
        errorEl.innerText = '';
    }

    document.getElementById('langSelected').querySelector('span').innerText = t.lang;

    // Update buttons
    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) startBtn.innerText = t.startTimer;

    const stopBtn = document.getElementById('timerStopBtn');
    if (stopBtn) stopBtn.innerText = t.stopTimer;

    // Update preset buttons
    document.getElementById('preset1m').innerText = `1${t.m}`;
    document.getElementById('preset5m').innerText = `5${t.m}`;
    document.getElementById('preset10m').innerText = `10${t.m}`;
    document.getElementById('preset30m').innerText = `30${t.m}`;
    document.getElementById('preset1h').innerText = `1${t.h}`;

    // Update labels
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const authTitle = document.getElementById('authTitle');
    const registerTitle = document.getElementById('registerTitle');

    if (loginTab) loginTab.innerText = t.login;
    if (registerTab) registerTab.innerText = t.registerTab;
    if (authTitle) authTitle.innerText = t.login;
    if (registerTitle) registerTitle.innerText = t.registerTitle;

    // Update dividers
    document.querySelectorAll('.divider span').forEach(d => d.innerText = t.or);

    // Update buttons
    const buttons = document.querySelectorAll('.submit-btn');
    if (buttons[0]) buttons[0].innerText = t.loginBtn;
    if (buttons[1]) buttons[1].innerText = t.regBtn;

    // Update placeholders
    const loginEmail = document.querySelector('#loginContent input[type="email"]');
    const loginPass = document.querySelector('#loginContent input[type="password"]');
    const regUser = document.querySelector('#registerContent input[type="text"]');
    const regEmail = document.querySelector('#registerContent input[type="email"]');
    const regPass = document.querySelector('#registerContent input[type="password"]');

    if (loginEmail) loginEmail.placeholder = t.email;
    if (loginPass) loginPass.placeholder = t.pass;
    if (regUser) regUser.placeholder = t.user;
    if (regEmail) regEmail.placeholder = t.email;
    if (regPass) regPass.placeholder = t.pass;

    // Update Nav and Notes
    document.getElementById('navMain').innerText = t.navMain;
    document.getElementById('navNotes').innerText = t.navNotes;
    document.querySelector('.notes-content h2').innerText = t.notesTitle;
    document.getElementById('modalTitle').innerText = t.modalTitle;
    document.getElementById('modalNote').placeholder = t.modalPlaceholder;
    document.getElementById('modalNoteTitle').placeholder = t.modalTitlePlaceholder;
    document.querySelector('.modal-btn.primary').innerText = t.modalBtn;

    // Delete Modal
    document.getElementById('deleteModalTitle').innerText = t.deleteModalTitle;
    document.querySelector('#deleteModal .secondary').innerText = t.deleteBtnCancel;
    document.querySelector('#deleteModal .primary').innerText = t.deleteBtnConfirm;
}

function switchPage(page) {
    const stopwatchContainer = document.getElementById('stopwatchContainer');
    const notesContainer = document.getElementById('notesContainer');
    const navMain = document.getElementById('navMain');
    const navNotes = document.getElementById('navNotes');

    if (page === 'main') {
        stopwatchContainer.style.display = 'block';
        notesContainer.style.display = 'none';
        setTimeout(() => {
            stopwatchContainer.style.opacity = '1';
            notesContainer.style.opacity = '0';
        }, 10);
        navMain.classList.add('active');
        navNotes.classList.remove('active');
    } else {
        stopwatchContainer.style.display = 'none';
        stopwatchContainer.style.opacity = '0';
        notesContainer.style.display = 'block';
        setTimeout(() => {
            notesContainer.style.opacity = '1';
        }, 10);
        navMain.classList.remove('active');
        navNotes.classList.add('active');
    }
}

// Session Management
function checkSession() {
    const mainContainer = document.querySelector('.main-container');
    const stopwatchContainer = document.getElementById('stopwatchContainer');
    const topNav = document.getElementById('topNav');

    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Show Timer and Nav
        mainContainer.style.display = 'none';
        stopwatchContainer.style.display = 'block';
        topNav.style.display = 'flex';
        setTimeout(() => {
            stopwatchContainer.style.opacity = '1';
        }, 50);
        document.getElementById('timerPicker').style.display = 'flex';
        renderNotes(); // Load notes
        history.replaceState({ page: 'main' }, 'Main', '#main');
    } else {
        // Show Auth
        stopwatchContainer.style.display = 'none';
        topNav.style.display = 'none';
        mainContainer.style.display = 'block';
        setTimeout(() => {
            mainContainer.style.opacity = '1';
        }, 50);
    }
}

// History API support for browser back button
window.onpopstate = function (event) {
    if (event.state && event.state.page === 'auth' || !event.state) {
        logout(false);
    }
};

history.replaceState({ page: 'auth' }, 'Auth', '');

// Google Login Implementation
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    localStorage.setItem('isLoggedIn', 'true');
    goToMain();
}

window.onload = function () {
    checkSession();

    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    // Add enter key and scrolling listeners for timer inputs
    ['inputHours', 'inputMinutes', 'inputSeconds'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            // Enter key to start
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') setAndStartTimer();
            });

            // Wheel scroll to change value
            input.addEventListener('wheel', function (e) {
                e.preventDefault();
                let val = parseInt(this.value) || 0;
                const min = parseInt(this.min) || 0;
                const max = parseInt(this.max) || 59;

                if (e.deltaY < 0) {
                    val = val + 1 > max ? max : val + 1;
                } else {
                    val = val - 1 < min ? min : val - 1;
                }

                this.value = val.toString().padStart(2, '0');
            }, { passive: false });

            // Max 2 digits constraint
            input.addEventListener('input', function () {
                if (this.value.length > 2) {
                    this.value = this.value.slice(0, 2);
                }
            });
        }
    });
}

function startGoogleLogin() {
    google.accounts.id.prompt();
    google.accounts.id.requestCode();
}

function handleLogin(event) {
    event.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    goToMain();
}

function handleRegister(event) {
    event.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    goToMain();
}

function setQuickTimer(minutes) {
    if (typeof timerInterval !== 'undefined') clearInterval(timerInterval);

    // Clear error
    const errorEl = document.getElementById('timerError');
    if (errorEl) errorEl.style.opacity = '0';

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    document.getElementById('inputHours').value = h.toString().padStart(2, '0');
    document.getElementById('inputMinutes').value = m.toString().padStart(2, '0');
    document.getElementById('inputSeconds').value = '00';
}


// Timer Logic
let timerInterval;
let timeLeft = 0;

function setAndStartTimer() {
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

    // Clear error if exists
    const errorEl = document.getElementById('timerError');
    if (errorEl) {
        errorEl.style.opacity = '0';
        errorEl.innerText = '';
    }

    const countdownContainer = document.getElementById('countdownContainer');
    countdownContainer.style.display = 'flex';
    document.body.classList.add('timer-active');

    // Numbers appear quickly, transitions handle the ghosting
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

function finishTimerAndShowNotes() {
    clearInterval(timerInterval);

    // 1. Switch state to notes behind the scenes
    // switchPage('notes'); // Removed to prevent overlapping pages

    // 2. Clear inputs for next time
    document.getElementById('inputHours').value = '';
    document.getElementById('inputMinutes').value = '';
    document.getElementById('inputSeconds').value = '';

    // 3. Fade out timer / Fade in UI
    document.body.classList.remove('timer-active');
    const countdownContainer = document.getElementById('countdownContainer');
    countdownContainer.classList.remove('active');

    // 4. Show completion modal after transition
    setTimeout(() => {
        countdownContainer.style.display = 'none';
        const modal = document.getElementById('completionModal');
        modal.style.display = 'flex';
        // Force reflow
        modal.offsetHeight;
        modal.classList.add('active');
        document.getElementById('modalNote').focus();
    }, 2000);
}

function closeCompletionModal() {
    const modal = document.getElementById('completionModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        // Return to main setup
        resetToPicker(true);
    }, 500);
}

function saveAndCloseModal() {
    const noteText = document.getElementById('modalNote').value.trim();
    const noteTitle = document.getElementById('modalNoteTitle').value.trim();

    if (noteText) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('az-AZ'); // Format: DD.MM.YYYY

        // Basic title fallback
        const displayTitle = noteTitle || (currentLanguage === 'az' ? 'Adsız Qeyd' : (currentLanguage === 'tr' ? 'Adsız Not' : 'Untitled Note'));

        let notes = JSON.parse(localStorage.getItem('voidNotes') || '[]');
        notes.unshift({
            title: displayTitle,
            date: dateStr,
            content: noteText,
            timestamp: now.getTime()
        });
        localStorage.setItem('voidNotes', JSON.stringify(notes));
        renderNotes();
    }

    document.getElementById('modalNote').value = '';
    document.getElementById('modalNoteTitle').value = '';

    // Close modal and ensure we are on main page
    const modal = document.getElementById('completionModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        resetToPicker(true);
        switchPage('main'); // Explicitly go to main
    }, 500);
}

function renderNotes() {
    const list = document.getElementById('notesList');
    if (!list) return;

    const notes = JSON.parse(localStorage.getItem('voidNotes') || '[]');
    list.innerHTML = '';

    if (notes.length === 0) {
        // Optional: Show empty state
        return;
    }

    notes.forEach((note, index) => {
        const item = document.createElement('div');
        item.className = 'note-item';

        // Header click toggles open
        item.onclick = function (e) {
            // Don't toggle if delete button was clicked
            if (e.target.closest('.delete-note-btn')) return;
            this.classList.toggle('open');
        };

        item.innerHTML = `
            <div class="note-header">
                <span class="note-title">${note.title || 'Note'}</span>
                <span class="note-date">${note.date}</span>
                <button class="delete-note-btn" onclick="deleteNote(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="note-body">${note.content}</div>
        `;
        list.appendChild(item);
    });
}

// Global to store index of note to delete
let noteDeleteIndex = null;

function deleteNote(index) {
    noteDeleteIndex = index;
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'flex';
    // Force reflow
    modal.offsetHeight;
    modal.classList.add('active');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        noteDeleteIndex = null;
    }, 500);
}

// Bind this to the delete confirm button in HTML or setup here
document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            if (noteDeleteIndex !== null) {
                let notes = JSON.parse(localStorage.getItem('voidNotes') || '[]');
                notes.splice(noteDeleteIndex, 1);
                localStorage.setItem('voidNotes', JSON.stringify(notes));
                renderNotes();
                closeDeleteModal();
            }
        };
    }
});

function resetToPicker(skipClear = false) {
    if (!skipClear) clearInterval(timerInterval); // Cleanup if manual stop

    document.body.classList.remove('timer-active');
    const countdownContainer = document.getElementById('countdownContainer');
    countdownContainer.classList.remove('active');
    countdownContainer.style.display = 'none';

    // Show timer picker and nav
    const pickerContainer = document.getElementById('stopwatchContainer');
    const topNav = document.getElementById('topNav');
    pickerContainer.style.display = 'block';
    topNav.style.display = 'flex';
    document.getElementById('timerPicker').style.display = 'flex';

    setTimeout(() => {
        pickerContainer.style.opacity = '1';
    }, 100);
}



function updateCountdownDisplay() {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;

    document.getElementById('countdown').innerText =
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function goToMain() {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        localStorage.setItem('isLoggedIn', 'true');
        mainContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        mainContainer.style.opacity = '0';
        mainContainer.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            mainContainer.style.display = 'none';
            const container = document.getElementById('stopwatchContainer');
            const topNav = document.getElementById('topNav');
            container.style.display = 'block';
            topNav.style.display = 'flex';
            document.getElementById('timerPicker').style.display = 'flex';
            setTimeout(() => {
                container.style.opacity = '1';
                container.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100);
            history.pushState({ page: 'main' }, 'Main', '#main');
        }, 800);
    }
}

function logout(pushState = true) {
    clearInterval(timerInterval);
    localStorage.removeItem('isLoggedIn');
    const mainContainer = document.querySelector('.main-container');
    const container = document.getElementById('stopwatchContainer');
    const topNav = document.getElementById('topNav');

    if (!container || container.style.display === 'none') return; // Might need to check nav

    // Quick hack if we are on notes page
    document.getElementById('notesContainer').style.display = 'none';

    container.style.opacity = '0';
    topNav.style.display = 'none'; // Hide nav on logout

    setTimeout(() => {
        container.style.display = 'none';
        mainContainer.style.display = 'block';
        setTimeout(() => {
            mainContainer.style.opacity = '1';
            mainContainer.style.transform = 'translateY(0)';
            if (pushState) history.pushState({ page: 'auth' }, 'Auth', '');
        }, 50);
    }, 800);
}
