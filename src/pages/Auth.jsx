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
                        </form>

                        <div className="divider">
                            <span>{t.or}</span>
                        </div>

                        <div className="social-login">
                            <button
                                className="google-submit-btn"
                                type="button"
                                onClick={() => login()}
                            >
                                <svg width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                <span>{t.googleBtn || 'Continue with Google'}</span>
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Auth
