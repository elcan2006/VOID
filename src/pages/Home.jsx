import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { translations } from '../translations'
import axios from 'axios'

const API_URL = '/api'

const Home = ({ lang }) => {
    const [timeLeft, setTimeLeft] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [initialDuration, setInitialDuration] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [noteTitle, setNoteTitle] = useState('')
    const [noteContent, setNoteContent] = useState('')
    const [inputs, setInputs] = useState({ h: '', m: '', s: '' })
    const [error, setError] = useState('')
    const [isReady, setIsReady] = useState(false)
    const navigate = useNavigate()
    const t = translations[lang]
    const timerRef = useRef(null)

    useEffect(() => {
        setTimeout(() => setIsReady(true), 100)
    }, [])

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            clearInterval(timerRef.current)
            setIsActive(false)
            setShowModal(true)
        }
        return () => clearInterval(timerRef.current)
    }, [isActive, timeLeft])

    useEffect(() => {
        if (isActive) {
            document.body.classList.add('timer-running')
        } else {
            document.body.classList.remove('timer-running')
        }
    }, [isActive])

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const startTimer = () => {
        const totalSeconds = (parseInt(inputs.h || 0) * 3600) + (parseInt(inputs.m || 0) * 60) + parseInt(inputs.s || 0)
        if (totalSeconds > 0) {
            setTimeLeft(totalSeconds)
            setInitialDuration(totalSeconds)
            setIsActive(true)
            setError('')
        } else {
            setError(t.timerError)
        }
    }

    const setQuickTimer = (mins) => {
        setInputs({
            h: Math.floor(mins / 60).toString().padStart(2, '0'),
            m: (mins % 60).toString().padStart(2, '0'),
            s: '00'
        })
        setError('')
    }

    const handleWheel = (e, key, max) => {
        e.preventDefault()
        let val = parseInt(inputs[key]) || 0
        if (e.deltaY < 0) val = val + 1 > max ? max : val + 1
        else val = val - 1 < 0 ? 0 : val - 1
        setInputs({ ...inputs, [key]: val.toString().padStart(2, '0') })
    }

    const handleInputChange = (key, value) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 2)
        setInputs({ ...inputs, [key]: cleaned })
    }

    const saveNote = async () => {
        try {
            const token = localStorage.getItem('voidToken')
            await axios.post(`${API_URL}/notes`, {
                title: noteTitle || t.untitledNote,
                content: noteContent.trim() || t.defaultNoteContent,
                date: new Date().toLocaleDateString(lang === 'az' ? 'az-AZ' : lang === 'tr' ? 'tr-TR' : 'en-US'),
                timestamp: Date.now(),
                duration: initialDuration - timeLeft
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setShowModal(false)
            setNoteTitle('')
            setNoteContent('')
            setInputs({ h: '', m: '', s: '' })
            setTimeLeft(0)
        } catch (err) {
            console.error('Failed to save note:', err)
            setError('Failed to save note to server')
        }
    }

    return (
        <div className="home-page">


            <div className={`stopwatch-container ${isReady && !isActive ? 'show' : ''}`}>
                <div className="timer-presets">
                    <button onClick={() => setQuickTimer(1)}>1{t.m}</button>
                    <button onClick={() => setQuickTimer(5)}>5{t.m}</button>
                    <button onClick={() => setQuickTimer(10)}>10{t.m}</button>
                    <button onClick={() => setQuickTimer(30)}>30{t.m}</button>
                    <button onClick={() => setQuickTimer(60)}>1{t.h}</button>
                </div>
                <div className="timer-inputs">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="00"
                        value={inputs.h}
                        onChange={e => handleInputChange('h', e.target.value)}
                        onWheel={e => handleWheel(e, 'h', 9)}
                    />
                    <span>:</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="00"
                        value={inputs.m}
                        onChange={e => handleInputChange('m', e.target.value)}
                        onWheel={e => handleWheel(e, 'm', 59)}
                    />
                    <span>:</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="00"
                        value={inputs.s}
                        onChange={e => handleInputChange('s', e.target.value)}
                        onWheel={e => handleWheel(e, 's', 59)}
                    />
                </div>
                <div className="timer-error" style={{ opacity: error ? 1 : 0 }}>{error}</div>
                <button className="timer-start-btn" onClick={startTimer}>{t.startTimer}</button>
            </div>

            <div className={`countdown-container ${isActive ? 'active' : ''}`}>
                <div className="stopwatch-display">{formatTime(timeLeft)}</div>
                <button className="timer-stop-btn" onClick={() => setShowConfirmModal(true)}>{t.stopTimer}</button>
            </div>

            <div className={`completion-modal ${showModal ? 'active' : ''}`}>
                <div className="modal-content">
                    <h2>{t.modalTitle}</h2>
                    <input
                        type="text"
                        className="modal-input"
                        placeholder={t.modalTitlePlaceholder}
                        value={noteTitle}
                        onChange={e => setNoteTitle(e.target.value)}
                    />
                    <textarea
                        placeholder={t.modalPlaceholder}
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                    />
                    {error && <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
                    <div className="modal-actions">
                        <button className="modal-btn secondary" onClick={() => setShowModal(false)}>{t.deleteBtnCancel}</button>
                        <button className="modal-btn primary" onClick={saveNote}>{t.modalBtn}</button>
                    </div>
                </div>
            </div>

            <div className={`completion-modal ${showConfirmModal ? 'active' : ''}`}>
                <div className="modal-content" style={{ maxWidth: '400px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{t.confirmStopTitle}</h2>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '15px' }}>
                        {t.confirmStopWarning}
                    </p>
                    <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '10px' }}>
                        <button className="modal-btn secondary" onClick={() => setShowConfirmModal(false)}>{t.noBtn}</button>
                        <button className="modal-btn primary" onClick={() => {
                            setShowConfirmModal(false);
                            setIsActive(false);
                            setTimeLeft(0);
                        }}>{t.yesBtn}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
