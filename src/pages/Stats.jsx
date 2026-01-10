import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { translations } from '../translations'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

const Stats = ({ lang }) => {
    const [stats, setStats] = useState({ totalDuration: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] })
    const [isReady, setIsReady] = useState(false)
    const navigate = useNavigate()
    const t = translations[lang]

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('voidToken')
                const response = await axios.get(`${API_URL}/notes/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                setStats(response.data)
                setIsReady(true)
            } catch (err) {
                console.error('Failed to fetch stats:', err)
                setIsReady(true)
            }
        }
        fetchStats()
    }, [])

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        if (h > 0) return `${h} ${t.focusHours} ${m} ${t.focusMinutes}`
        return `${m} ${t.focusMinutes}`
    }

    const maxWeekly = Math.max(...stats.weeklyData, 1)

    return (
        <div className="stats-page">
            <nav className="top-nav">
                <button className="nav-btn" onClick={() => navigate('/app')}>{t.navMain}</button>
                <button className="nav-btn" onClick={() => navigate('/notes')}>{t.navNotes}</button>
                <button className="nav-btn active">{t.navStats}</button>
            </nav>

            <div className={`stats-container ${isReady ? 'show' : ''}`}>
                <div className="stats-content">
                    <h2>{t.statsTitle}</h2>

                    <div className="stats-grid">
                        <div className="stat-card main">
                            <label>{t.totalFocusTime}</label>
                            <div className="stat-value">{formatDuration(stats.totalDuration)}</div>
                        </div>

                        <div className="stat-card">
                            <label>{t.dailyAverage}</label>
                            <div className="stat-value small">
                                {formatDuration(Math.floor(stats.weeklyData.reduce((a, b) => a + b, 0) / 7))}
                            </div>
                        </div>
                    </div>

                    <div className="weekly-chart-container">
                        <h3>{t.weeklyActivity}</h3>
                        <div className="chart-bars">
                            {stats.weeklyData.map((val, i) => (
                                <div key={i} className="chart-column">
                                    <div className="bar-wrapper">
                                        <div
                                            className="bar"
                                            style={{ height: `${(val / maxWeekly) * 100}%` }}
                                        >
                                            <div className="bar-tooltip">{formatDuration(val)}</div>
                                        </div>
                                    </div>
                                    <span className="day-label">{t.days[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stats
