'use client'

import React, { useEffect, useState, useRef } from 'react'

interface ScrambleProps {
    text: string
    className?: string
    speed?: number
}

export default function ScrambleText({ text, className, speed = 40 }: ScrambleProps) {
    const [display, setDisplay] = useState('')
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
    const iterations = useRef(0)

    useEffect(() => {
        let interval: NodeJS.Timeout

        const startScramble = () => {
            interval = setInterval(() => {
                const scrambled = text
                    .split('')
                    .map((char, index) => {
                        if (index < iterations.current) {
                            return text[index]
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join('')

                setDisplay(scrambled)

                if (iterations.current >= text.length) {
                    clearInterval(interval)
                }

                iterations.current += 1 / 3 // Slow down the reveal
            }, speed)
        }

        startScramble()

        return () => clearInterval(interval)
    }, [text, speed])

    return <h1 className={className}>{display}</h1>
}
