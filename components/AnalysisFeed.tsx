import React, { useEffect, useRef } from 'react'
import { generateHexDump } from '@/utils/hex'

export default function AnalysisFeed({ logs }: { logs: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="feed-container">
      {logs.map((log, i) => (
        <div key={i} className="log-line">
          <span style={{ color: '#005500', marginRight: '10px', fontSize: '0.8em' }}>{generateHexDump()}</span>
          <span style={{ color: 'var(--muted-green)' }}>{new Date().toISOString().split('T')[1].slice(0, 8)}</span> <span style={{ color: '#00FF41' }}>{log}</span>
        </div>
      ))}
      <div ref={bottomRef} />

      <style jsx>{`
        .feed-container {
          height: 150px;
          overflow-y: auto;
          background: rgba(0, 20, 10, 0.5);
          border: 1px solid var(--muted-green);
          padding: 1rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          color: var(--text-main);
        }
        .log-line {
          margin-bottom: 0.25rem;
          opacity: 0.8;
          border-left: 2px solid transparent;
          padding-left: 0.5rem;
        }
        .log-line:last-child {
          opacity: 1;
          color: var(--neon-green);
          border-left-color: var(--neon-green);
          animation: blink 1s infinite;
        }
        /* Custom Scrollbar */
        .feed-container::-webkit-scrollbar {
          width: 8px;
        }
        .feed-container::-webkit-scrollbar-track {
          background: #000; 
        }
        .feed-container::-webkit-scrollbar-thumb {
          background: var(--muted-green); 
        }
        .feed-container::-webkit-scrollbar-thumb:hover {
          background: var(--neon-green); 
        }
      `}</style>
    </div>
  )
}
