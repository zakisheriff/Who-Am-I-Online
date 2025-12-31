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
                        <h3>{res.platform}</h3>
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
                </div>
            ))}

            <style jsx>{`
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }
        .result-card {
           background: rgba(5, 20, 15, 0.9);
           border: 1px solid var(--muted-green);
           padding: 1.5rem;
           transition: all 0.3s;
        }
        .result-card:hover {
           border-color: var(--neon-green);
           background: rgba(13, 59, 46, 0.5);
           box-shadow: 0 0 10px rgba(0, 255, 156, 0.2);
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
        }
        .badge {
           font-size: 0.7rem;
           padding: 2px 6px;
           border: 1px solid currentColor;
           border-radius: 2px;
        }
        .badge.high { color: var(--neon-green); }
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
