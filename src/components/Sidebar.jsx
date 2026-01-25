import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { translations } from '../translations'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose, lang, onLogout }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const t = translations[lang]

    const menuItems = [
        { path: '/app', label: t.navMain, icon: 'fas fa-stopwatch' },
        { path: '/notes', label: t.navNotes, icon: 'fas fa-sticky-note' },
        { path: '/stats', label: t.navStats, icon: 'fas fa-chart-bar' },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="sidebar-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="sidebar-menu"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="sidebar-header">
                            <h2 className="sidebar-title">VOID</h2>
                            {/* Close button is handled by overlay click mostly, but can add explicit one */}
                        </div>

                        <div className="sidebar-links">
                            {menuItems.map((item) => (
                                <button
                                    key={item.path}
                                    className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                                    onClick={() => {
                                        navigate(item.path)
                                        onClose()
                                    }}
                                >
                                    <div className="icon-container">
                                        <i className={item.icon}></i>
                                    </div>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="sidebar-footer">
                            <button className="sidebar-item logout" onClick={() => {
                                onClose()
                                onLogout()
                            }}>
                                <div className="icon-container">
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                                <span>{t.logout || 'Logout'}</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Sidebar
