'use server'

import { AnalysisInput, AnalysisResult } from '@/osint/types'
import { analyzeUsername } from '@/osint/username'
import { analyzeEmail } from '@/osint/email'

// Simulate delayed processing for "Cinematic" feel
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function performAnalysis(input: AnalysisInput): Promise<{
    results: AnalysisResult[],
    logs: string[]
}> {
    const results: AnalysisResult[] = []
    const logs: string[] = []

    logs.push('> [INIT] Received input vector')
    logs.push('> [CORE] Hashing identity markers...')

    // Parallel execution of available modules
    const tasks = []

    if (input.username) {
        logs.push(`> [MOD_USER] Analyzing username: ${input.username}`)
        tasks.push(analyzeUsername(input.username).then(res => results.push(...res)))
    }

    if (input.email) {
        logs.push(`> [MOD_EMAIL] Tracing email footprint...`)
        tasks.push(analyzeEmail(input.email).then(res => results.push(...res)))
    }

    // We await all actual logic
    await Promise.all(tasks)

    logs.push('> [CORE] Correlating results...')
    logs.push('> [CORE] Computing confidence matrix...')

    // Sort by confidence
    results.sort((a, b) => b.confidence - a.confidence)

    // Simulated "Deep" Network Logs
    const networkLogs = [
        `[NET] ESTABLISHING_TLS_HANDSHAKE: 104.244.42.1:443... SUCCESS`,
        `[NET] VERIFYING_SSL_CERT (CN=*.github.com)... VALID`,
        `[HTTP] GET /users/${input.username || 'unknown'}?v=4... 200 OK (145ms)`,
        `[DTB] PARSING_JSON_PAYLOAD (SIZE: 4.2KB)... DONE`,
        `[SYS] CORRELATING_IDENTITY_SIGNALS...`
    ]

    // Add network logs to the stream
    networkLogs.forEach(log => {
        // Small random chance to skip a log for variety
        if (Math.random() > 0.1) logs.push(log)
    })

    return { results, logs }
}
