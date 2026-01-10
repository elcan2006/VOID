import { useState, useEffect } from 'react'
import { translations } from '../translations'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'

const API_URL = '/api'

const Auth = ({ onLogin, lang }) => {
    const [activeTab, setActiveTab] = useState('login')
    const [show, setShow] = useState(false)
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')
    const t = translations[lang]

    useEffect(() => {
        setTimeout(() => setShow(true), 100)
    }, [])

    const getErrorMessage = (errorMsg) => {
        switch (errorMsg) {
            case 'USER_EXISTS': return t.errUserExists
            case 'INVALID_CREDENTIALS': return t.errInvalidCreds
            case 'EMAIL_REQUIRED': return t.errEmailRequired
            default: return t.errAuthFailed
        }
    }

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await axios.post(`${API_URL}/auth/google`, {
                    accessToken: tokenResponse.access_token
                })
                const { token, username } = response.data
                localStorage.setItem('voidToken', token)
                localStorage.setItem('voidUser', username)
                onLogin()
            } catch (err) {
                console.error('Google login failed:', err)
                setError(getErrorMessage(err.response?.data?.message))
            }
        },
        onError: () => setError(t.errAuthFailed)
    })

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
                setError(t.errServerOffline)
            } else {
                setError(getErrorMessage(err.response.data.message))
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
                        <form onSubmit={handleSubmit} className="auth-form-layout">
                            <div className="auth-main-fields">
                                {activeTab === 'register' && (
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder={t.user}
                                        value={formData.username}
                                        onChange={handleChange}
                                        onInvalid={(e) => e.target.setCustomValidity(t.requiredField)}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                        required
                                    />
                                )}
                                <input
                                    type="email"
                                    name="email"
                                    placeholder={t.email}
                                    value={formData.email}
                                    onChange={handleChange}
                                    onInvalid={(e) => e.target.setCustomValidity(t.requiredField)}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder={t.pass}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onInvalid={(e) => e.target.setCustomValidity(t.requiredField)}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn">
                                {activeTab === 'login' ? t.loginBtn : t.regBtn}
                            </button>

                            <div className="divider">
                                <span>{t.or}</span>
                            </div>

                            <div className="social-login" style={{ justifyContent: 'center', marginTop: '10px' }}>
                                <button
                                    className="social-btn"
                                    type="button"
                                    onClick={() => login()}
                                >
                                    <i className="fab fa-google"></i>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Auth
