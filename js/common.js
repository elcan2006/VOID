// Translations
const translations = {
    az: { lang: 'AZ', login: 'Giriş', registerTab: 'Daxil ol', registerTitle: 'Qeydiyyat', email: 'E-poçt', pass: 'Şifrə', user: 'İstifadəçi adı', loginBtn: 'Daxil ol', regBtn: 'Hesab yarat', or: 'və ya', m: 'd', h: 's', startTimer: 'Sakitliyə başla', stopTimer: 'Bitir', navMain: 'Əsas', navNotes: 'Qeydlər', notesTitle: 'Qeydlər', notesPlaceholder: 'Buraya yazın...', timerError: 'Zəhmət olmasa vaxtı düzgün qeyd edin.', modalTitle: 'Necə keçdi?', modalPlaceholder: 'Düşüncələrinizi qeyd edin...', modalBtn: 'Tamam', deleteModalTitle: 'Bu qeydi silmək istəyirsiniz?', deleteBtnCancel: 'Ləğv et', deleteBtnConfirm: 'Sil', modalTitlePlaceholder: 'Başlıq' },
    tr: {
        lang: 'TR',
        login: 'Giriş', registerTab: 'Kayıt Ol', registerTitle: 'Kayıt Ol', email: 'E-posta', pass: 'Şifre', user: 'Kullanıcı adı', loginBtn: 'Giriş yap', regBtn: 'Hesap oluştur', or: 'veya', m: 'd', h: 'sa', startTimer: 'Huzura başla', stopTimer: 'Bitir', navMain: 'Ana', navNotes: 'Notlar', notesTitle: 'Notlar', notesPlaceholder: 'Buraya yazın...', timerError: 'Lütfen zamanı doğru girin.', modalTitle: 'Nasıl geçti?', modalPlaceholder: 'Düşüncelerinizi not edin...', modalBtn: 'Tamam', deleteModalTitle: 'Bu notu silmek istiyor musunuz?', deleteBtnCancel: 'İptal', deleteBtnConfirm: 'Sil', modalTitlePlaceholder: 'Başlık'
    },
    en: { lang: 'EN', login: 'Login', registerTab: 'Sign Up', registerTitle: 'Registration', email: 'Email', pass: 'Password', user: 'Username', loginBtn: 'Login', regBtn: 'Create Account', or: 'or', m: 'm', h: 'h', startTimer: 'Begin Silence', stopTimer: 'Finish', navMain: 'Main', navNotes: 'Notes', notesTitle: 'Notes', notesPlaceholder: 'Type here...', timerError: 'Please enter a valid time.', modalTitle: 'How was it?', modalPlaceholder: 'Record your thoughts...', modalBtn: 'Done', deleteModalTitle: 'Delete this note?', deleteBtnCancel: 'Cancel', deleteBtnConfirm: 'Delete', modalTitlePlaceholder: 'Title' }
};

let currentLanguage = localStorage.getItem('voidLang') || 'az';

function changeLang(lang) {
    currentLanguage = lang;
    localStorage.setItem('voidLang', lang);
    const t = translations[lang];
    if (!t) return;

    // Helper to safely update text
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    const setPlaceholder = (selector, text) => {
        const el = document.querySelector(selector);
        if (el) el.placeholder = text;
    };

    // Global
    const langBtn = document.getElementById('langSelected');
    if (langBtn) langBtn.querySelector('span').innerText = t.lang;

    // Auth Page
    setText('loginTab', t.login);
    setText('registerTab', t.registerTab);
    setText('authTitle', t.login);
    setText('registerTitle', t.registerTitle);

    document.querySelectorAll('.divider span').forEach(d => d.innerText = t.or);

    const btns = document.querySelectorAll('.submit-btn');
    if (btns[0]) btns[0].innerText = t.loginBtn;
    if (btns[1]) btns[1].innerText = t.regBtn;

    setPlaceholder('#loginContent input[type="email"]', t.email);
    setPlaceholder('#loginContent input[type="password"]', t.pass);
    setPlaceholder('#registerContent input[type="text"]', t.user);
    setPlaceholder('#registerContent input[type="email"]', t.email);
    setPlaceholder('#registerContent input[type="password"]', t.pass);

    // Timer / App Page
    setText('timerStartBtn', t.startTimer);
    setText('timerStopBtn', t.stopTimer);

    // Presets
    if (document.getElementById('preset1m')) {
        document.getElementById('preset1m').innerText = `1${t.m}`;
        document.getElementById('preset5m').innerText = `5${t.m}`;
        document.getElementById('preset10m').innerText = `10${t.m}`;
        document.getElementById('preset30m').innerText = `30${t.m}`;
        document.getElementById('preset1h').innerText = `1${t.h}`;
    }

    setText('modalTitle', t.modalTitle);
    setPlaceholder('#modalNote', t.modalPlaceholder);
    setPlaceholder('#modalNoteTitle', t.modalTitlePlaceholder);
    const modalBtn = document.querySelector('.modal-btn.primary');
    if (modalBtn) modalBtn.innerText = t.modalBtn;

    // Nav
    setText('navMain', t.navMain);
    setText('navNotes', t.navNotes);

    // Notes Page
    setText('deleteModalTitle', t.deleteModalTitle);
    const delSec = document.querySelector('#deleteModal .secondary');
    if (delSec) delSec.innerText = t.deleteBtnCancel;
    const delPrim = document.querySelector('#deleteModal .primary');
    if (delPrim) delPrim.innerText = t.deleteBtnConfirm;

    const notesTitle = document.querySelector('.notes-content h2');
    if (notesTitle) notesTitle.innerText = t.notesTitle;
}

// Simple Session Check
function requireAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }
}

function requireGuest() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'app.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    changeLang(currentLanguage);
});
