import { useRef, useEffect } from 'react'

const Background = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animationFrameId
        let width, height, stars = []

        const init = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height

            stars = []
            const starCount = width < 600 ? 50 : 150
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3
                })
            }
        }

        const animate = () => {
            if (document.hidden) {
                animationFrameId = requestAnimationFrame(animate)
                return
            }

            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = '#fff'
            ctx.beginPath()

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i]
                ctx.moveTo(star.x, star.y)
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)

                star.x += star.speedX
                star.y += star.speedY

                if (star.x < 0) star.x = width
                if (star.x > width) star.x = 0
                if (star.y < 0) star.y = height
                if (star.y > height) star.y = 0
            }

            ctx.fill()
            animationFrameId = requestAnimationFrame(animate)
        }

        let resizeTimeout
        const handleResize = () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(init, 100)
        }

        init()
        animate()

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            id="stars"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    )
}

export default Background
