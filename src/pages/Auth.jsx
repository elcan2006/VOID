import { useState, useEffect } from 'react'
import { translations } from '../translations'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

const Auth = ({ onLogin, lang }) => {
    const [activeTab, setActiveTab] = useState('login')
    const [show, setShow] = useState(false)
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')
    const t = translations[lang]

    useEffect(() => {
        setTimeout(() => setShow(true), 100)
    }, [])

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(`${API_URL}/auth/google`, {
                idToken: credentialResponse.credential
            })
            const { token, username } = response.data
            localStorage.setItem('voidToken', token)
            localStorage.setItem('voidUser', username)
            onLogin()
        } catch (err) {
            console.error('Google login failed:', err)
            setError('Google login failed')
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const endpoint = activeTab === 'login' ? '/auth/login' : '/auth/register'
            const response = await axios.post(`${API_URL}${endpoint}`, formData, {
                headers: { 'Content-Type': 'application/json' }
            })

            const { token, username } = response.data
            localStorage.setItem('voidToken', token)
            localStorage.setItem('voidUser', username)
            onLogin()
        } catch (err) {
            console.error('Auth Error:', err)
            if (!err.response) {
                setError('Serverə bağlanmaq mümkün olmadı (Server is offline)')
            } else {
                setError(err.response.data.message || 'Authentication failed')
            }
        }
    }

    return (
        <div className={`auth-container ${show ? 'show' : ''}`}>

            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        {t.login}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        {t.registerTab}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="auth-content active"
                    >
                        <h2>{activeTab === 'login' ? t.login : t.registerTitle}</h2>
                        {error && <div className="timer-error" style={{ opacity: 1, marginBottom: '20px' }}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            {activeTab === 'register' && (
                                <input
                                    type="text"
                                    name="username"
                                    placeholder={t.user}
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            )}
                            <input
                                type="email"
                                name="email"
                                placeholder={t.email}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder={t.pass}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="submit-btn">
                                {activeTab === 'login' ? t.loginBtn : t.regBtn}
                            </button>

                            <div className="divider">
                                <span>{t.or}</span>
                            </div>

                            <div className="social-login" style={{ justifyContent: 'center', marginTop: '10px' }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google Login Failed')}
                                    useOneTap
                                    theme="outline"
                                    shape="pill"
                                    size="large"
                                    width="100%"
                                />
                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Auth
