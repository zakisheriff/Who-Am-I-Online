'use client'

import React, { useState } from 'react'
import TerminalInput from '@/components/TerminalInput'
import BootSequence from '@/components/BootSequence'
import AnalysisFeed from '@/components/AnalysisFeed'
import ResultPanel from '@/components/ResultPanel'
import { performAnalysis } from '@/app/analyze/action'
import { AnalysisResult } from '@/osint/types'
import { useSoundEngine } from '@/components/SoundEngine'

type SystemState = 'IDLE' | 'BOOTING' | 'ANALYZING' | 'RESULTS'

export default function Home() {
  const [state, setState] = useState<SystemState>('IDLE')
  const [logs, setLogs] = useState<string[]>([])
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [formData, setFormData] = useState<any>(null)
  const { play } = useSoundEngine()

  const handleStart = (data: any) => {
    setFormData(data)
    setState('BOOTING')
    setLogs([])
  }

  const handleBootComplete = async () => {
    setState('ANALYZING')
    play('scan')

    // Initial dummy logs while waiting
    const initialLogs = [
      '> [NET] Resolving target identity...',
      '> [NET] Initiating deep packet correlation...',
      '> [OSINT] Querying global registries...'
    ]

    // "Stream" these logs
    for (const log of initialLogs) {
      setLogs(prev => [...prev, log])
      await new Promise(r => setTimeout(r, 800))
    }

    // Call actual backend
    try {
      const response = await performAnalysis(formData)

      // Append real backend logs
      for (const log of response.logs) {
        setLogs(prev => [...prev, log])
        await new Promise(r => setTimeout(r, 300)) // Fast scroll for results
      }

      setResults(response.results)
      setState('RESULTS')
      play('found')

    } catch (e) {
      console.error(e)
      setLogs(prev => [...prev, '> [ERR] SYSTEM CONNECTION FAILURE'])
      play('alert')
    }
  }

  return (
    <main className="main-container">
      <header className="header">
        <h1 className="title glitch" data-text="WHO_AM_I_ONLINE">WHO_AM_I_ONLINE</h1>
        <div className="subtitle">CINEMATIC OSINT INTELLIGENCE SYSTEM</div>
      </header>

      <section className="content-area">
        {state === 'IDLE' && (
          <div className="animate-fade-in">
            <p className="description">
              ENTER TARGET PARAMETERS TO INITIATE DEEP SEARCH.
              <br />
              <span className="comment">// ALL INPUTS OPTIONAL. MORE SIGNALS = HIGHER FIDELITY.</span>
            </p>
            <TerminalInput onSubmit={handleStart} />
          </div>
        )}

        {state === 'BOOTING' && (
          <BootSequence onComplete={handleBootComplete} />
        )}

        {state === 'ANALYZING' && (
          <div className="animate-fade-in">
            <h2 className="section-title blink">Analysis In Progress...</h2>
            <AnalysisFeed logs={logs} />
          </div>
        )}

        {state === 'RESULTS' && (
          <div className="animate-slide-in" style={{ width: '100%' }}>
            <div className="results-header">
              <h2 className="section-title">INTELLIGENCE REF: {new Date().getTime().toString(16).toUpperCase()}</h2>
              <button onClick={() => setState('IDLE')} className="reset-btn">NEW_SEARCH</button>
            </div>

            <AnalysisFeed logs={logs} /> {/* Keep logs visible but static/minimized? Or just show logs above */}

            <ResultPanel results={results} />
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="legal-trust">
          <span className="icon">🛡️</span>
          <span>
            PUBLIC DATA ONLY. NO TRACKING. NO SURVEILLANCE. NO PRIVATE SYSTEMS ACCESSED.
          </span>
        </div>
        <div className="version">SYS_VER 1.0.4 // SECURE_MODE</div>
      </footer>

      <style jsx>{`
        .main-container {
          min-height: 100vh;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .title {
          font-size: 3rem;
          color: var(--neon-green);
          margin-bottom: 0.5rem;
          letter-spacing: 5px;
        }
        .subtitle {
          color: var(--muted-green);
          letter-spacing: 3px;
          font-size: 0.9rem;
        }
        .content-area {
          width: 100%;
          max-width: 900px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .description {
          text-align: center;
          color: var(--text-main);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .comment {
          color: var(--muted-green);
          font-size: 0.8rem;
        }
        .section-title {
           color: var(--neon-green);
           margin-bottom: 1rem;
           font-size: 1.2rem;
        }
        .blink {
           animation: blink 1s infinite;
        }
        .results-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 2rem;
           width: 100%;
           border-bottom: 1px solid var(--muted-green);
           padding-bottom: 1rem;
        }
        .reset-btn {
           background: transparent;
           border: 1px solid var(--neon-green);
           color: var(--neon-green);
           padding: 0.5rem 1rem;
           cursor: pointer;
           font-family: var(--font-mono);
           text-transform: uppercase;
        }
        .reset-btn:hover {
           background: var(--neon-green);
           color: var(--bg-dark);
        }

        .footer {
          margin-top: 4rem;
          width: 100%;
          border-top: 1px solid #111;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          color: #444;
          font-size: 0.7rem;
        }
        .legal-trust {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        @media (max-width: 600px) {
           .title { font-size: 2rem; }
           .footer { flex-direction: column; gap: 1rem; align-items: center; }
        }
      `}</style>
    </main>
  )
}
