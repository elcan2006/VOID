import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { translations } from '../translations'

const TopNav = ({ lang, onLogout }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const t = translations[lang]

    const navItems = [
        { path: '/app', label: t.navMain },
        { path: '/notes', label: t.navNotes },
        { path: '/stats', label: t.navStats },
    ]

    return (
        <nav className="top-nav">
            {navItems.map((item) => (
                <button
                    key={item.path}
                    className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    )
}

export default TopNav
