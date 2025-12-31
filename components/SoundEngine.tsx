'use client'

import { useEffect, useRef, useCallback } from 'react'

export type SoundType = 'type' | 'boot' | 'beep' | 'scan' | 'found' | 'alert' | 'hover'

export function useSoundEngine() {
    const audioCtx = useRef<AudioContext | null>(null)
    const masterGain = useRef<GainNode | null>(null)

    useEffect(() => {
        // Init Audio Context on first interaction usually, but we prep it here
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
            audioCtx.current = new AudioContextClass()
            masterGain.current = audioCtx.current.createGain()
            masterGain.current.gain.value = 0.1 // Low volume default
            masterGain.current.connect(audioCtx.current.destination)
        }
    }, [])

    const play = useCallback((type: SoundType) => {
        if (!audioCtx.current || !masterGain.current) return
        if (audioCtx.current.state === 'suspended') audioCtx.current.resume()

        const ctx = audioCtx.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(masterGain.current!)

        const now = ctx.currentTime

        switch (type) {
            case 'type':
                // Soft click
                osc.frequency.setValueAtTime(800, now)
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05)
                gain.gain.setValueAtTime(0.5, now)
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
                osc.start(now)
                osc.stop(now + 0.05)
                break

            case 'boot':
                // Power up
                osc.type = 'square'
                osc.frequency.setValueAtTime(110, now)
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.5)
                gain.gain.setValueAtTime(0.3, now)
                gain.gain.linearRampToValueAtTime(0, now + 0.5)
                osc.start(now)
                osc.stop(now + 0.5)
                break

            case 'found':
                // Success chime
                osc.type = 'sine'
                osc.frequency.setValueAtTime(440, now)
                osc.frequency.setValueAtTime(554, now + 0.1) // C#
                osc.frequency.setValueAtTime(659, now + 0.2) // E
                gain.gain.setValueAtTime(0.3, now)
                gain.gain.linearRampToValueAtTime(0, now + 0.6)
                osc.start(now)
                osc.stop(now + 0.6)
                break

            case 'alert':
                // Error buzz
                osc.type = 'sawtooth'
                osc.frequency.setValueAtTime(150, now)
                osc.frequency.linearRampToValueAtTime(100, now + 0.3)
                gain.gain.setValueAtTime(0.5, now)
                gain.gain.linearRampToValueAtTime(0, now + 0.3)
                osc.start(now)
                osc.stop(now + 0.3)
                break

            case 'hover':
                // High blip
                osc.frequency.setValueAtTime(2000, now)
                gain.gain.setValueAtTime(0.05, now)
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
                osc.start(now)
                osc.stop(now + 0.02)
                break
        }
    }, [])

    return { play }
}
