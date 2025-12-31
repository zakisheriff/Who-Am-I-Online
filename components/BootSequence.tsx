'use client'

import React, { useEffect, useState } from 'react'
import { useSoundEngine } from './SoundEngine'

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([])
    const { play } = useSoundEngine()

    const bootText = [
        "[BOOT] KERNEL_INIT...",
        "[BOOT] LOADING_OSINT_MODULES...",
        "[BOOT] ESTABLISHING_SECURE_HANDSHAKE...",
        "[BOOT] SIGNAL_CORRELATION_ENGINE_ONLINE",
        "[SYS] READY_FOR_INPUT"
    ]

    useEffect(() => {
        let delay = 0
        bootText.forEach((line, index) => {
            delay += Math.random() * 500 + 400
            setTimeout(() => {
                setLines(prev => [...prev, line])
                play('type')
                if (index === bootText.length - 1) {
                    setTimeout(onComplete, 800)
                }
            }, delay)
        })
    }, [])

    return (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.5', color: 'var(--neon-green)' }}>
            {lines.map((line, i) => (
                <div key={i}>{line}</div>
            ))}
            <div className="cursor-blink">_</div>
        </div>
    )
}
