import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { translations } from '../translations'
import { ArrowRight } from 'lucide-react'

const Landing = ({ lang }) => {
    const navigate = useNavigate()
    const t = translations[lang]
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleStart = () => {
        const token = localStorage.getItem('voidToken')
        if (token) {
            navigate('/app')
        } else {
            navigate('/auth')
        }
    }

    return (
        <div className="landing-container">
            <motion.div
                className="landing-content"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                <motion.h1
                    className="landing-title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                >
                    {t.landingTitle}
                </motion.h1>

                <motion.p
                    className="landing-slogan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    {t.landingSlogan}
                </motion.p>

                <motion.p
                    className="landing-desc"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 1, delay: 1.2 }}
                >
                    {t.landingDesc}
                </motion.p>

                <motion.button
                    className="landing-btn"
                    onClick={handleStart}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)", color: "#000" }}
                    whileTap={{ scale: 0.95 }}
                >
                    {t.landingEnterBtn}
                    <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                </motion.button>
            </motion.div>


            <div className="scroll-indicator">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
        </div>
    )
}

export default Landing
