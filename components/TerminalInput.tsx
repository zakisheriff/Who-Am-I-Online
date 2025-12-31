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
    phoneNumber: '',
    countryCode: '+1'
  })
  const { play } = useSoundEngine()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    play('type')
  }

  const isFormValid = formData.username.trim() !== '' || formData.email.trim() !== '' || formData.fullName.trim() !== '' || formData.phoneNumber.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return // Prevent empty submission
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

      <div className="input-group">
        <label className="terminal-label">TARGET_PHONE_NUMBER (OPTIONAL)</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="terminal-input"
            style={{ width: '80px', fontFamily: 'monospace' }}
            onFocus={() => play('hover')}
            disabled={disabled}
          >
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+91">+91 (IN)</option>
            <option value="+971">+971 (UAE)</option>
            <option value="+61">+61 (AU)</option>
            <option value="+86">+86 (CN)</option>
            <option value="+81">+81 (JP)</option>
            <option value="+49">+49 (DE)</option>
            <option value="+33">+33 (FR)</option>
          </select>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="9876543210"
            className="terminal-input"
            autoComplete="off"
            onFocus={() => play('hover')}
            style={{ flex: 1 }}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="status-line">
        STATUS: {disabled ? 'PROCESSING...' : 'READY_FOR_INJECTION'}
      </div>

      <button
        type="submit"
        className={`terminal-button ${disabled || !isFormValid ? 'disabled' : ''}`}
        disabled={disabled || !isFormValid}
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
          background: rgba(0, 20, 0, 0.6);
          border: 1px solid var(--muted-green);
          border-left: 2px solid var(--muted-green);
          color: #fff;
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 1.1rem;
          outline: none;
          transition: all 0.2s;
          text-shadow: 0 0 2px var(--neon-green);
        }
        .terminal-input::placeholder {
          color: rgba(0, 255, 65, 0.4);
        }
        .terminal-input:focus {
          border-color: var(--neon-green);
          background: rgba(0, 40, 0, 0.8);
          border-left-width: 6px;
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
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
