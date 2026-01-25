import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Notes from './pages/Notes'
import Stats from './pages/Stats'
import Background from './components/Background'
import LanguageSelector from './components/LanguageSelector'
import { translations } from './translations'
import logoMain from './assets/logoMain.png'
import { GoogleOAuthProvider } from '@react-oauth/google'

import Landing from './pages/Landing'

import TopNav from './components/TopNav'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('voidToken'))
    const [lang, setLang] = useState(localStorage.getItem('voidLang') || 'en')
    const [showLogo, setShowLogo] = useState(false)

    useEffect(() => {
        // Exact synchronization with VOID_mvp loading transition
        const timer = setTimeout(() => {
            document.getElementById('root')?.classList.add('ready')
            setShowLogo(true)
        }, 100)

        localStorage.setItem('voidLang', lang)
        return () => clearTimeout(timer)
    }, [lang])

    const handleLogin = () => {
        setIsLoggedIn(true)
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        localStorage.removeItem('voidToken')
        localStorage.removeItem('voidUser')
    }

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "DUMMY_ID"}>
            <Router>
                <Background />
                <img
                    src={logoMain}
                    alt="Void Logo"
                    className={`main-logo ${showLogo ? 'show' : ''}`}
                    onClick={() => { }}
                    style={{ cursor: 'default' }}
                />
                <LanguageSelector lang={lang} setLang={setLang} isTransparent={false} />

                {isLoggedIn && <TopNav lang={lang} />}

                {isLoggedIn && (
                    <button
                        className="floating-logout-btn"
                        onClick={handleLogout}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>{translations[lang].logout}</span>
                    </button>
                )}

                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/auth" />}
                    />
                    <Route
                        path="/auth"
                        element={isLoggedIn ? <Navigate to="/welcome" /> : <Auth onLogin={handleLogin} lang={lang} />}
                    />
                    <Route
                        path="/welcome"
                        element={isLoggedIn ? <Landing lang={lang} /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/app"
                        element={isLoggedIn ? <Home onLogout={handleLogout} lang={lang} /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/notes"
                        element={isLoggedIn ? <Notes lang={lang} /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/stats"
                        element={isLoggedIn ? <Stats lang={lang} /> : <Navigate to="/auth" />}
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    )
}

export default App
