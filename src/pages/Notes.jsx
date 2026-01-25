import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { translations } from '../translations'
import axios from 'axios'

const API_URL = '/api'

const Notes = ({ lang }) => {
    const [notes, setNotes] = useState([])
    const [openNoteId, setOpenNoteId] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [noteToDelete, setNoteToDelete] = useState(null)
    const [isReady, setIsReady] = useState(false)
    const navigate = useNavigate()
    const t = translations[lang]

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem('voidToken')
                const response = await axios.get(`${API_URL}/notes`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setNotes(response.data)
                setIsReady(true)
            } catch (err) {
                console.error('Failed to fetch notes:', err)
                setIsReady(true)
            }
        }
        fetchNotes()
    }, [])

    const deleteNote = async () => {
        try {
            const token = localStorage.getItem('voidToken')
            await axios.delete(`${API_URL}/notes/${noteToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setNotes(notes.filter(n => n._id !== noteToDelete))
            setShowDeleteModal(false)
            setNoteToDelete(null)
        } catch (err) {
            console.error('Failed to delete note:', err)
        }
    }

    return (
        <div className="notes-page">

            <div className={`notes-container ${isReady ? 'show' : ''}`}>
                <div className="notes-content">
                    <h2>{t.notesTitle}</h2>
                    <div className="notes-list">
                        {notes.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: '40px' }}>
                                {t.notesPlaceholder}
                            </div>
                        ) : (
                            notes.map(note => (
                                <div key={note._id} className={`note-item ${openNoteId === note._id ? 'open' : ''}`} onClick={() => setOpenNoteId(openNoteId === note._id ? null : note._id)}>
                                    <div className="note-header">
                                        <div className="note-title">{note.title}</div>
                                        <div className="note-date">{note.date}</div>
                                        <button className="delete-note-btn" onClick={(e) => {
                                            e.stopPropagation()
                                            setNoteToDelete(note._id)
                                            setShowDeleteModal(true)
                                        }}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <i className="fas fa-chevron-down"></i>
                                    </div>
                                    <div className="note-body">
                                        {note.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className={`completion-modal ${showDeleteModal ? 'active' : ''}`}>
                <div className="modal-content" style={{ maxWidth: '400px' }}>
                    <h2>{t.deleteModalTitle}</h2>
                    <div className="modal-actions">
                        <button className="modal-btn secondary" onClick={() => setShowDeleteModal(false)}>{t.deleteBtnCancel}</button>
                        <button className="modal-btn primary" style={{ background: '#ff6b6b', color: 'white' }} onClick={deleteNote}>
                            {t.deleteBtnConfirm}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notes
