'use client'

import React, { useState } from 'react'
import { useSoundEngine } from './SoundEngine'

interface TerminalInputProps {
    onSubmit: (data: any) => void
    disabled?: boolean
}

export default function TerminalInput({ onSubmit, disabled }: TerminalInputProps) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        phone: ''
    })
    const { play } = useSoundEngine()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        play('type')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        play('boot')
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
            <div className="input-group">
                <label className="terminal-label">TARGET_USERNAME</label>
                <input
                    type="text"
                    name="username"
                    className="terminal-input"
                    placeholder="e.g. ne0"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={disabled}
                    autoComplete="off"
                />
            </div>

            <div className="input-group">
                <label className="terminal-label">TARGET_EMAIL</label>
                <input
                    type="email"
                    name="email"
                    className="terminal-input"
                    placeholder="e.g. neo@matrix.net"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={disabled}
                    autoComplete="off"
                />
            </div>

            <div className="input-group">
                <label className="terminal-label">TARGET_FULLNAME (OPTIONAL)</label>
                <input
                    type="text"
                    name="fullName"
                    className="terminal-input"
                    placeholder="e.g. Thomas A. Anderson"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={disabled}
                    autoComplete="off"
                />
            </div>

            <button
                type="submit"
                className={`terminal-button ${disabled ? 'disabled' : ''}`}
                disabled={disabled}
                onMouseEnter={() => play('hover')}
            >
                {disabled ? 'SYSTEM_BUSY' : 'INITIATE_ANALYSIS'}
            </button>

            <style jsx>{`
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .terminal-label {
          color: var(--muted-green);
          font-size: 0.8rem;
          letter-spacing: 2px;
        }
        .terminal-input {
          background: transparent;
          border: 1px solid var(--muted-green);
          border-left: 2px solid var(--muted-green);
          color: var(--neon-green);
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }
        .terminal-input:focus {
          border-color: var(--neon-green);
          border-left-width: 6px;
          box-shadow: -5px 0 10px -5px var(--neon-green);
        }
        .terminal-button {
          margin-top: 1rem;
          background: rgba(0, 255, 156, 0.1);
          color: var(--neon-green);
          border: 1px solid var(--neon-green);
          padding: 1rem;
          font-family: var(--font-mono);
          cursor: pointer;
          letter-spacing: 4px;
          transition: all 0.2s;
          text-transform: uppercase;
          font-weight: bold;
        }
        .terminal-button:hover:not(:disabled) {
          background: var(--neon-green);
          color: var(--bg-dark);
          box-shadow: 0 0 15px var(--neon-green);
        }
        .terminal-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: var(--muted-green);
        }
      `}</style>
        </form>
    )
}
