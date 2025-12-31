import { Signal, AnalysisResult, SCORING } from './types'

export function calculateConfidence(signals: Signal[]): number {
    let score = 0

    for (const signal of signals) {
        score += signal.confidenceScore
    }

    // Cap at 100
    return Math.min(Math.round(score), 100)
}

export function determineRisk(confidence: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (confidence >= 70) return 'HIGH'
    if (confidence >= 40) return 'MEDIUM'
    return 'LOW'
}

export function generateSummary(platform: string, signals: Signal[], confidence: number): string {
    const signalCount = signals.length
    const signalTypes = signals.map(s => s.type).join(', ')

    if (confidence >= 80) {
        return `Positive identification on ${platform}. multiple high-fidelity signals (${signalTypes}) confirm identity association.`
    }
    if (confidence >= 50) {
        return `Probable match on ${platform}. Correlation of ${signalTypes} suggests presence.`
    }
    return `Weak signal detected on ${platform}. Insufficient data for positive attribution.`
}
