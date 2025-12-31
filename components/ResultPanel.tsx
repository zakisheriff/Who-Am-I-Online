'use client'

import React, { useEffect, useState } from 'react'
import { AnalysisResult } from '@/osint/types'
import { useSoundEngine } from './SoundEngine'

export default function ResultPanel({ results }: { results: AnalysisResult[] }) {
    const [visibleCount, setVisibleCount] = useState(0)
    const { play } = useSoundEngine()

    useEffect(() => {
        if (visibleCount < results.length) {
            const timer = setTimeout(() => {
                setVisibleCount(prev => prev + 1)
                play('found')
            }, 600) // Staggered reveal
            return () => clearTimeout(timer)
        }
    }, [visibleCount, results.length, play])

    return (
        <div className="results-grid">
            {results.slice(0, visibleCount).map((res, i) => (
                <div key={i} className="result-card animate-slide-in">
                    <div className="card-header">
                        {res.url ? (
                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="platform-link">
                                <h3>{res.platform} ↗</h3>
                            </a>
                        ) : (
                            <h3>{res.platform}</h3>
                        )}
                        <span className={`badge ${res.riskLevel.toLowerCase()}`}>{res.riskLevel} CONFIDENCE</span>
                    </div>

                    <div className="confidence-meter">
                        <div className="fill" style={{ width: `${res.confidence}%` }}></div>
                    </div>
                    <div className="confidence-text">{res.confidence}% SIGNAL INTEGRITY</div>

                    <p className="summary">{res.summary}</p>

                    <ul className="signals-list">
                        {res.signals.map((sig, idx) => (
                            <li key={idx}>[+] {sig.description}</li>
                        ))}
                    </ul>

                    {res.metadata && (
                        <div className="metadata-block" style={{ marginTop: '1rem', borderTop: '1px dashed var(--muted-green)', padding: '0.5rem 0' }}>
                            <div style={{ fontSize: '0.7em', color: 'var(--muted-green)', marginBottom: '0.2rem' }}>[RAW_CAPTURE_DATA]</div>
                            <pre style={{
                                fontSize: '0.7em',
                                color: '#00cc33',
                                background: 'rgba(0,20,0,0.5)',
                                padding: '0.5rem',
                                overflowX: 'auto',
                                border: '1px solid #1a332a'
                            }}>
                                {JSON.stringify(res.metadata, null, 2)}
                            </pre>
                        </div>
                    )}

                    {(res.url || res.dork) && (
                        <div className="action-row">
                            {res.url && (
                                <a href={res.url} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                                    OPEN PROFILE &gt;&gt;
                                </a>
                            )}
                            {res.dork && (
                                <a href={`https://www.google.com/search?q=${encodeURIComponent(res.dork)}`} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                                    RUN GOOGLE DORK &gt;
                                </a>
                            )}
                        </div>
                    )}
                </div>
            ))}

            <style jsx>{`
        .action-row {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .action-btn {
            display: block;
            width: 100%;
            text-align: center;
            border: 1px solid var(--neon-green);
            padding: 0.6rem;
            font-size: 0.9rem;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
            font-family: var(--font-mono);
            font-weight: bold;
            text-transform: uppercase;
        }
        .action-btn.primary {
            background: var(--neon-green);
            color: #000;
        }
        .action-btn.primary:hover {
            background: #fff;
            box-shadow: 0 0 15px var(--neon-green);
        }
        .action-btn.secondary {
            background: transparent;
            color: var(--neon-green);
        }
        .action-btn.secondary:hover {
            background: rgba(0, 255, 65, 0.1);
        }

        .platform-link {
            text-decoration: none;
        }
        .platform-link:hover h3 {
            text-decoration: underline;
            text-shadow: 0 0 8px var(--neon-green);
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }
        .result-card {
           background: rgba(5, 20, 15, 0.95);
           border: 1px solid var(--muted-green);
           padding: 1.5rem;
           transition: all 0.3s;
           display: flex;
           flex-direction: column;
        }
        .result-card:hover {
           border-color: var(--neon-green);
           background: rgba(0, 30, 0, 1);
           box-shadow: 0 0 20px rgba(0, 255, 65, 0.15);
           z-index: 10;
           transform: scale(1.02);
        }
        .card-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 1rem;
        }
        h3 {
           color: var(--neon-green);
           margin: 0;
           text-transform: uppercase;
           letter-spacing: 2px;
           transition: all 0.2s;
        }
        .badge {
           font-size: 0.7rem;
           padding: 2px 6px;
           border: 1px solid currentColor;
           border-radius: 2px;
        }
        .badge.high { color: var(--neon-green); box-shadow: 0 0 5px var(--neon-green); }
        .badge.medium { color: var(--amber-alert); }
        .badge.low { color: #888; }
        
        .confidence-meter {
           height: 4px;
           background: #111;
           margin-bottom: 0.5rem;
           position: relative;
        }
        .fill {
           height: 100%;
           background: var(--neon-green);
           box-shadow: 0 0 5px var(--neon-green);
           transition: width 1s ease-out;
        }
        .confidence-text {
           font-size: 0.7rem;
           color: var(--muted-green);
           text-align: right;
           margin-bottom: 1rem;
        }
        .summary {
           font-size: 0.9rem;
           line-height: 1.4;
           margin-bottom: 1rem;
           color: #ccc;
        }
        .signals-list {
           list-style: none;
           padding: 0;
           font-size: 0.8rem;
           color: var(--neon-green);
        }
        .signals-list li {
           margin-bottom: 0.25rem;
           opacity: 0.8;
        }
      `}</style>
        </div>
    )
}
