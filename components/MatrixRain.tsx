'use client'

import React, { useEffect, useRef } from 'react'

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = canvas.width = window.innerWidth
        let height = canvas.height = window.innerHeight

        const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEF'
        const charArray = chars.split('')

        const fontSize = 14
        const columns = width / fontSize

        // An array of drops - one per column
        const drops: number[] = []
        // x below is the x coordinate
        // 1 = y co-ordinate of the drop(same for every drop initially)
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * -100 // randomize start
        }

        const draw = () => {
            // Black BG for the canvas
            // Translucent BG to show trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0, 0, width, height)

            ctx.fillStyle = '#0F0' // Green text
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)]

                // Randomly brighter characters for "sparkle"
                if (Math.random() > 0.95) {
                    ctx.fillStyle = '#FFF' // White tip
                } else {
                    ctx.fillStyle = '#00FF41' // Matrix Green
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                // Reset to green if we drew white
                ctx.fillStyle = '#00FF41'

                // sending the drop back to the top randomly after it has crossed the screen
                // adding a randomness to the reset to make the drops scattered on the Y axis
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0
                }

                // Incrementing Y coordinate
                drops[i]++
            }
        }

        const interval = setInterval(draw, 33)

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0, // Behind everything but visible
                opacity: 0.25, // Subtle background
                pointerEvents: 'none'
            }}
        />
    )
}
