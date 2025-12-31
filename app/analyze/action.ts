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

    return { results, logs }
}
