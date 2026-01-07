document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    renderNotes();
});

function renderNotes() {
    const list = document.getElementById('notesList');
    if (!list) return;

    const notes = JSON.parse(localStorage.getItem('voidNotes') || '[]');
    list.innerHTML = '';

    if (notes.length === 0) {
        list.innerHTML = '<div style="text-align:center; opacity:0.5; margin-top:50px;">No notes yet</div>';
        return;
    }

    notes.forEach((note, index) => {
        const item = document.createElement('div');
        item.className = 'note-item';
        // Toggle open
        item.onclick = function (e) {
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

let noteDeleteIndex = null;

window.deleteNote = function (index) {
    noteDeleteIndex = index;
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

window.closeDeleteModal = function () {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        noteDeleteIndex = null;
    }, 300);
}

// Attach event listener for confirm delete
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
