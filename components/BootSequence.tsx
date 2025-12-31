'use client'

import React, { useEffect, useState } from 'react'
import { useSoundEngine } from './SoundEngine'

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([])
    const { play } = useSoundEngine()

    const bootMessages = [
        "[BOOT] KERNEL_INIT...",
        "[BOOT] LOADING_OSINT_MODULES...",
        "[BOOT] ESTABLISHING_SECURE_HANDSHAKE...",
        "[BOOT] BYPASSING_PROXY_CHAINS...",
        "[BOOT] SIGNAL_CORRELATION_ENGINE_ONLINE",
        "[SYS] MOUNTING_VIRTUAL_VOLUMES...",
        "[SYS] DECRYPTING_CONFIG...",
        "[NET] PING_MASK_ACTIVE...",
        "[SYS] MEMORY_INTEGRITY_VERIFIED...",
        "[SYS] READY_FOR_INPUT"
    ]

    useEffect(() => {
        let delay = 0
        // Randomize boot sequence slightly each time
        const selectedMessages = bootMessages.filter(() => Math.random() > 0.3)
        if (selectedMessages.length < 5) {
            // Ensure at least some messages show
            selectedMessages.push(...bootMessages.slice(0, 5))
        }
        // Always end with READY
        if (!selectedMessages.includes("[SYS] READY_FOR_INPUT")) selectedMessages.push("[SYS] READY_FOR_INPUT")


        selectedMessages.forEach((line, index) => {
            // Varied delay
            const stepDelay = Math.random() * 600 + 200
            delay += stepDelay

            setTimeout(() => {
                setLines(prev => [...prev, line])
                play('type')
                if (index === selectedMessages.length - 1) {
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
